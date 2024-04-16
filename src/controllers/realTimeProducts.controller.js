// Manager
const ProductsDbManager = require('../dao/dbManager/ProductsDbManager');
const manager = new ProductsDbManager();

class RealTimeProductsController {
  static async getAll(req, res) {
    try {
      let paginateData = await manager.getProducts(req, res);
      res.render('realtimeproducts',
        paginateData
      );
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

module.exports = RealTimeProductsController;