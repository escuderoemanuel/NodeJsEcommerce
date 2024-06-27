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
      // Get queries params
      let { limit, page, filter, sort } = req.query;

      // Filtros de búsqueda
      limit = parseInt(limit) || 10;
      page = parseInt(page) || 1;
      sort = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null;
      const filterCriteria = filter ? {
        $or: [
          { title: { $regex: filter, $options: 'i' } },
          { category: { $regex: filter, $options: 'i' } }
        ]
      } : {};

      // Pagination options
      let options = {
        limit,
        page,
        lean: true,
        sort: sort !== null ? { price: sort, title: 1 } : {}
      };

      // Consult
      const products = await ProductsModel.paginate(filterCriteria, options);

      // URL params to pagonation
      let urlQueryParams = { filter, sort, limit };

      // BaseURL
      const baseUrl = req.baseUrl;

      // Pagination Links
      const urlPrevLink = `${baseUrl}?${new URLSearchParams({ ...urlQueryParams, page: products.prevPage }).toString()}`;
      const urlNextLink = `${baseUrl}?${new URLSearchParams({ ...urlQueryParams, page: products.nextPage }).toString()}`;

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

      // Get user data
      const user = await usersService.getById(req.user.id);
      if (!user) {
        throw new CustomErrors({
          name: 'Error getting product list',
          cause: 'User not found',
          message: 'User not found',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        });
      }

      // Data to rendering
      const renderData = { paginateData, user, products: paginateData.payload };

      // Verify header 'Accept'
      const acceptHeader = req.headers['accept'] || '';
      if (acceptHeader.includes('text/html')) {
        res.render('products', renderData);
      } else {
        res.send(paginateData);
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