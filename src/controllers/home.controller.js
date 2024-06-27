const { productsService } = require('../repositories');

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

      // This is to better format the json in the browser (I personally prefer the 'JSON Viewer Pro' browser extension)
      res.setHeader('Content-Type', 'application/json');
      // Return the paginateData object
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