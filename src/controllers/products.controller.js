
const ProductsService = require('../services/products.service');
const ProductsModel = require('../dao/models/products.model');
const productsService = new ProductsService();

class ProductsController {

  static async getAll(req, res) {
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

      const userData = req.tokenUser.serializableUser;
      const renderData = { paginateData, user: userData, products: paginateData.payload };
      res.render('products', renderData);

    } catch (error) {
      res.status(400).send({ error: error.message });
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

  static async create(req, res) {
    try {
      await productsService.create(req.body);
      res.send({ status: 'success', message: 'Product created' });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const pid = req.params.pid;
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
      res.send({ status: 'success', deletedProduct: { productToDelete } });
    } catch (error) {
      res.status(400).send({ status: 'error', message: error.message });
    }
  }
}

module.exports = ProductsController;