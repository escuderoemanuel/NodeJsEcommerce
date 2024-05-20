const { productsService } = require('../repositories');
const ProductsModel = require('../dao/models/products.model');
const CustomErrors = require('../utils/errors/CustomErrors');
const { getCreateProductErrorInfo } = require('../utils/errors/ErrorInfo');
const TypesOfErrors = require('../utils/errors/TypesOfErrors');

class ProductsController {

  static async getAll(req, res, next) {
    try {
      // Obtengo los parámetros de consulta
      let { limit, page, filter, sort } = req.query

      //? Filtros de búsqueda
      // Filtro 'limit' string parseado a number
      limit = parseInt(req.query.limit);
      // Filtro 'page' parseado a number
      page = parseInt(req.query.page);
      // Filtro 'sort' string (asc o desc)
      if (req.query.sort === 'asc') {
        sort = 1;
      } else if (req.query.sort === 'desc') {
        sort = -1;
      }
      // Filtro 'filter' string (title o category)
      filter = {};
      if (req.query.filter) {
        // $option: 'i' para que no distinga mayúsculas de minúsculas
        filter = {
          $or: [{ title: { $regex: req.query.filter, $options: 'i' } }, { category: { $regex: req.query.filter, $options: 'i' } }]
        }
      }

      //? Paginación
      let options = {
        limit: limit || 10,
        page: page || 1,
        lean: true,
      };

      // Si hay un sort, lo agrego a 'options', sino no
      // Utilizo un segundo parámetro de ordenamiento para el caso en el que haya más productos con el mismo precio!
      if (req.query.sort) {
        options.sort = { price: sort, title: 1 }
      }

      // Ejecuto la consulta pasando filter (si hay), más options
      let products = await ProductsModel.paginate(filter, options);
      // let products = await productsService.paginate(filter, options);

      // Creo un objeto para almacenar los parámetros de consulta de la url, para armar los links 'prev' y 'next'
      let urlQueryParams = {};
      if (req.query.filter) urlQueryParams.filter = req.query.filter;
      if (req.query.sort) urlQueryParams.sort = req.query.sort;
      if (req.query.limit) urlQueryParams.limit = req.query.limit;


      // Obtiene la URL base dinámicamente desde el front
      const baseUrl = req.baseUrl;

      // Creo los links para la paginación
      // GPT Tip => URLSearchParams: permite crear un string con los parámetros de consulta de la url.
      const urlPrevLink = `${baseUrl}?${new URLSearchParams(urlQueryParams).toString()}&page=${products.prevPage}`;

      const urlNextLink = `${baseUrl}?${new URLSearchParams(urlQueryParams).toString()}&page=${products.nextPage}`;


      // Creo un objeto para almacenar los datos de paginación y los productos para enviarlos al front.
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



      const user = req.user;
      const renderData = { paginateData, user: user, products: paginateData.payload };

      if (!user || !renderData) {
        // CUSTOM ERROR
        throw new CustomErrors({
          name: 'Error getting product list',
          cause: 'Error getting product list',
          message: 'Error getting product list',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })
      }

      res.render('products', renderData);

    } catch (error) {
      next(error)
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
      const { title, description, code, price, stock, category, status } = req.body;
      if (!title || !description || !code || !price || !stock || !category || !status)
        // CUSTOM ERROR
        throw new CustomErrors({
          name: 'Product creation error',
          cause: 'Product creation error',
          message: 'Error creating product',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })

      if (req.user.role === 'premium') {
        req.body.owner = req.user.email;
      }

      await productsService.create(req.body);
      res.send({ status: 'success', message: 'Product created' });
    } catch (error) {
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
      const productToDelete = await productsService.getById(pid);


      if (!pid || !productToDelete) {
        // CUSTOM ERROR
        throw new CustomErrors({
          name: 'Product delete error',
          cause: 'Product deleting error',
          message: 'Error deleting product',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })
      }

      if (req.user.role === 'premium' && productToDelete.owner !== req.user.email) {
        throw new CustomErrors({
          name: 'Product delete error',
          cause: 'Product deleting error',
          message: 'Only owners can delete products they have created',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })
      }

      const productDeleted = await productsService.delete(pid);
      res.send({ status: 'success', deletedProduct: { productToDelete } });
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ProductsController;