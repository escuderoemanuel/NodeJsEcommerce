const ProductsModel = require('../models/products.model')

class ProductsDbManager {

  //? ADD
  async addProduct(product) {
    try {
      await ProductsModel.create(product);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //? GET
  async getProducts(req, res) {
    try {
      // Obtain query parameters
      let { limit, page, filter, sort } = req.query

      //? Filtros de búsqueda
      // Filter 'limit' string parsed to number
      limit = parseInt(req.query.limit);
      // Filter 'page' parsed to number
      page = parseInt(req.query.page);
      // Filter 'sort' string (asc or desc)
      if (req.query.sort === 'asc') {
        sort = 1;
      } else if (req.query.sort === 'desc') {
        sort = -1;
      }
      // Filter 'filter' string (title or category)
      filter = {};
      if (req.query.filter) {
        // $option: 'i' so that it is not case sensitive
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

      // If there is a sort, add it to 'options', otherwise I don't.
      // Use a second sorting parameter for the case where there are more products with the same price!
      if (req.query.sort) {
        options.sort = { price: sort, title: 1 }
      }

      // Execute the query passing filter (if any), more options
      let products = await ProductsModel.paginate(filter, options);

      // Creates an object to store the URL query parameters, to build the 'prev' and 'next' links
      let urlQueryParams = {};
      if (req.query.filter) urlQueryParams.filter = req.query.filter;
      if (req.query.sort) urlQueryParams.sort = req.query.sort;
      if (req.query.limit) urlQueryParams.limit = req.query.limit;


      // Get the base URL dynamically from the front end
      const baseUrl = req.baseUrl;

      // Create links for pagination
      // GPT Tip => URLSearchParams: allows you to create a string with the URL query parameters.
      const urlPrevLink = `${baseUrl}?${new URLSearchParams(urlQueryParams).toString()}&page=${products.prevPage}`;

      const urlNextLink = `${baseUrl}?${new URLSearchParams(urlQueryParams).toString()}&page=${products.nextPage}`;


      // Creates an object to store pagination data and products to send to the front end.
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

    } catch (error) {
      throw new Error(error.message)
    }
  }



  //? GET BY ID
  async getProductById(id) {
    try {
      const product = await ProductsModel.findOne({ _id: id }).lean();
      return product;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //? UPDATE
  async updateProduct(id, newProduct) {
    try {
      await ProductsModel.updateOne({ _id: id }, newProduct);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //? DELETE
  async deleteProduct(id) {
    try {
      await ProductsModel.deleteOne({ _id: id });
    } catch (error) {
      throw new Error(error.message)
    }
  }

}

module.exports = ProductsDbManager;