const ProductsDao = require('../dao/products.dao');

class ProductsService {

  constructor() {
    this.productsDao = new ProductsDao();
  }

  /* async getAll(req, res) {

    try {
      // Obtengo los parámetros de consulta
      let { limit, page, filter, sort } = req.query;

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
        };
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
        options.sort = { price: sort, title: 1 };
      }

      // Ejecuto la consulta pasando filter (si hay), más options
      let products = await this.dao.getAll(filter, options);

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

      return { paginateData, products: paginateData.payload };
      // return this.dao.getAll().lean()

    } catch (error) {
      // Handle errors
      throw new Error('Service Error fetching products');
    }
  } */
  async getAll(filter, options) {
    try {
      return await this.productsDao.getAll(filter, options);
    } catch (error) {
      throw new Error('Service Error fetching products');
    }
  }

  async getById(pid) {
    try {
      // console.log('pid en Service', pid) //! OK
      const product = await this.productsDao.getById(pid);
      // console.log('product en Service', product) //! OK
      return product;
    } catch (error) {
      throw new Error('Service Error fetching product by ID');
    }
  }

  async create(product) {
    try {
      //return await this.productsDao.create(product);
      const newProduct = await this.productsDao.create(product);
      return newProduct;
    } catch (error) {
      throw new Error('Service Error creating product');
    }
  }

  async update(pid, product) {
    try {
      /* const productFound = await this.dao.getById(pid);
      if (!productFound) {
        throw new Error('Product not found')
      };
      return await this.dao.update(pid, product); */
      return await this.productsDao.update(pid, product);
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  async delete(pid) {
    try {
      await this.productsDao.delete(pid);
      return ({ status: 'success', message: 'Product succesfully removed' })
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

}

module.exports = ProductsService;