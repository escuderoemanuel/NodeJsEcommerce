const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');
const { productsService } = require('../repositories');
const manager = new ProductsDbManager();


class HomeViewController {
  static async getHome(req, res, next) {
    try {
      let result = await productsService.getAll(req, res)
      let paginateData = result.paginateData

      if (!result) {
        // CUSTOM ERROR
        throw new CustomErrors({
          name: 'Error getting list of products',
          cause: 'Error getting list of products',
          message: 'Error getting list of products',
          code: TypesOfErrors.INVALID_PARAM_ERROR
        })
      }

      // Esto es para darle mejor formato al json en el navegador (personalmente prefiero la extensión de navegador 'JSON Viewer Pro')
      res.setHeader('Content-Type', 'application/json');
      // Devuelve el objeto paginateData
      res.send(JSON.stringify(paginateData, null, 2));

    } catch (error) {
      next(error)
    }
  }

  static async getChat(req, res) {
    try {
      res.render('chat', {});
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

}

module.exports = HomeViewController