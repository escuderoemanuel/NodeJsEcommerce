//const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');
//const manager = new ProductsDbManager();
const ProductsService = require('../services/products.service');
const productsService = new ProductsService();

class ProductsController {


  /* static async getAll(req, res) {
    try {
      let paginateData = await productsService.getAll(req, res);
      // console.log('paginateData', paginateData)

      const userData = req.tokenUser.serializableUser;
      console.log('userData', userData)

      // Combinar los datos del usuario y los datos de paginación en un solo objeto porque handlebars no deja pasar más de 1
      const renderData = { ...paginateData, user: userData };

      res.render('products', renderData);
      //res.render('products', { user: userData });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  } */
  static async getAll(req, res) {
    try {
      let { limit, page, filter, sort } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
      if (sort === 'asc') sort = 1;
      else if (sort === 'desc') sort = -1;
      filter = {};
      if (req.query.filter) {
        filter = {
          $or: [{ title: { $regex: req.query.filter, $options: 'i' } }, { category: { $regex: req.query.filter, $options: 'i' } }],
        };
      }

      const options = {
        limit: limit || 10,
        page: page || 1,
        lean: true,
      };

      if (sort) {
        options.sort = { price: sort, title: 1 };
      }

      const products = await productsService.getAll(filter, options);

      const urlQueryParams = { ...req.query };

      const baseUrl = req.baseUrl;

      const urlPrevLink = `${baseUrl}?${new URLSearchParams({ ...urlQueryParams, page: products.prevPage }).toString()}`;
      const urlNextLink = `${baseUrl}?${new URLSearchParams({ ...urlQueryParams, page: products.nextPage }).toString()}`;

      const paginateData = {
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

      res.render('products', { ...paginateData, user: req.tokenUser.serializableUser })
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const pid = req.params.pid;
      console.log('pid en controller', pid) //! OK
      const product = await productsService.getById(pid);
      console.log('product', product) //! NO LLEGA AQUI

      res.send({ status: 'success', product });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      await productsService.create(req.body);
      //const products = await productsService.getAll(req, res);
      res.send({ status: 'success', message: 'Product created' });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const pid = req.params.pid;
      // console.log('PUT ID', id)
      const updatedFields = req.body;
      await productsService.update(pid, updatedFields);
      const updatedProduct = await productsService.getById(pid);
      res.send({ status: 'success', updatedProduct });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const pid = req.params.pid;
      const productToDelete = await productsService.getById(pid);
      await productsService.delete(pid);
      //const products = await productsService.getAll(req, res);
      res.send({ status: 'success', deletedProduct: { productToDelete } });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }

}

module.exports = ProductsController;