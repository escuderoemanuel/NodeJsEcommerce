const { productsService, usersService } = require('../repositories');
const ProductsModel = require('../dao/models/products.model');
const CustomErrors = require('../utils/errors/CustomErrors');
const TypesOfErrors = require('../utils/errors/TypesOfErrors');
const MailingsService = require('../services/mailings.service');
const mailingsService = new MailingsService();
const generateFakerProducts = require('../utils/generateFakerProducts.utils');


class ProductsController {

  static async getAll(req, res, next) {
    try {
      // Gets the query parameters
      let { limit, page, filter, sort } = req.query;

      // Search filters
      limit = parseInt(req.query.limit);
      page = parseInt(req.query.page);
      sort = req.query.sort === 'asc' ? 1 : req.query.sort === 'desc' ? -1 : null;
      filter = {};
      if (req.query.filter) {
        filter = {
          $or: [
            { title: { $regex: req.query.filter, $options: 'i' } },
            { category: { $regex: req.query.filter, $options: 'i' } }
          ]
        };
      }

      // Pagination
      let options = {
        limit: limit || 10,
        page: page || 1,
        lean: true,
      };
      if (sort !== null) {
        options.sort = { price: sort, title: 1 };
      }

      // Execute the query
      let products = await ProductsModel.paginate(filter, options);

      // URL query parameters
      let urlQueryParams = {};
      if (req.query.filter) urlQueryParams.filter = req.query.filter;
      if (req.query.sort) urlQueryParams.sort = req.query.sort;
      if (req.query.limit) urlQueryParams.limit = req.query.limit;

      // Base URL
      const baseUrl = req.baseUrl;

      // Pagination Links
      const urlPrevLink = `${baseUrl}?${new URLSearchParams(urlQueryParams).toString()}&page=${products.prevPage}`;
      const urlNextLink = `${baseUrl}?${new URLSearchParams(urlQueryParams).toString()}&page=${products.nextPage}`;

      // Pagination Data
      let paginateData = {
        status: 'success',
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? urlPrevLink : null,
        nextLink: products.hasNextPage ? urlNextLink : null,
      };

      const user = await usersService.getById(req.user.id);
      const renderData = { paginateData, user: user, products: paginateData.payload };

      if (!user || !renderData) {
        throw new CustomErrors({
          name: 'Error getting product list',
          cause: 'Error getting product list',
          message: 'Error getting product list',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        });
      }

      // Verify headers 'Accept'. If the query is from the FRONT, make a res.render but if not, make a res.json
      const acceptHeader = req.headers['accept'] || '';
      if (acceptHeader.includes('text/html')) {
        res.render('products', renderData);
      } else {
        let products = await ProductsModel.find();
        res.send({ status: 'success', payload: products });
      }

    } catch (error) {
      next(error);
    }
  }


  static async getById(req, res) {
    try {
      const pid = req.params.pid;
      const product = await productsService.getById(pid);
      res.send({ status: 'success', product });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async create(req, res, next) {
    try {
      const { title, description, code, price, stock, category } = req.body;
      if (!title || !description || !code || !price || !stock || !category)
        // CUSTOM ERROR
        throw new CustomErrors({
          name: 'Product creation error',
          cause: 'All field are required',
          message: 'All field are required',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })

      if (req.user.role === 'premium') {
        req.body.owner = req.user.email;
      }

      const newProduct = {
        ...req.body,
        owner: req.user.email, // Add the product owner
      }
      await productsService.create(newProduct);
      res.send({ status: 'success', message: 'Product created' });
    } catch (error) {
      console.error(error);
      next(error)
    }
  }


  static async update(req, res, next) {
    try {
      const pid = req.params.pid;
      const updatedFields = req.body;

      if (!pid || !updatedFields) {
        // CUSTOM ERROR
        throw new CustomErrors({
          name: 'Product update error',
          cause: 'Product updating error',
          message: 'Error updating product',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })
      }

      await productsService.update(pid, updatedFields);

      const updatedProduct = await productsService.getById(pid);
      res.send({ status: 'success', updatedProduct });
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const pid = req.params.pid;

      // Verify if the pid is valid
      if (!pid) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid product ID',
        });
      }

      const productToDelete = await productsService.getById(pid);

      // Verify if the product exists
      if (!productToDelete) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }

      const currentRole = req.user.role;
      const currentEmail = req.user.email;
      const ownerEmail = productToDelete.owner;
      const owner = await usersService.getByEmail(ownerEmail);

      if (!owner) {
        return res.status(404).json({
          status: 'error',
          message: 'Product owner not found',
        });
      }

      const productOwnerRole = owner.role;

      switch (currentRole) {
        case 'admin':
          if (currentEmail !== ownerEmail && productOwnerRole === 'premium') {
            await productsService.delete(pid);
            await mailingsService.sendDeletedProduct(ownerEmail);
          } else {
            await productsService.delete(pid);
          }
          break;

        case 'premium':
          if (currentEmail === ownerEmail) {
            await productsService.delete(pid);
          } else {
            return res.status(403).json({
              status: 'error',
              message: 'Only owners or can delete their products',
            });
          }
          break;

        default:
          return res.status(403).json({
            status: 'error',
            message: 'User not authorized to delete products',
          });
      }

      res.send({ status: 'success', deletedProduct: productToDelete });
    } catch (error) {
      next(error);
    }
  }


  static async mockingProducts(req, res, next) {
    try {
      const quantity = req.query.quantity || 10;
      const mockingProducts = []
      for (let i = 0; i < quantity; i++) {
        mockingProducts.push(generateFakerProducts())
      }
      res.send({ status: 'success', payload: mockingProducts })
    } catch (error) {
      next(error);
    }
  }


}

module.exports = ProductsController;