const { productsService } = require('../repositories');

class HomeViewController {
  static async getHome(req, res) {
    try {
      let result = await productsService.getAll(req, res)
      let paginateData = result.paginateData
      // Esto es para darle mejor formato al json en el navegador (personalmente prefiero la extensión de navegador 'JSON Viewer Pro')
      res.setHeader('Content-Type', 'application/json');
      // Devuelve el objeto paginateData
      res.send(JSON.stringify(paginateData, null, 2));

    } catch (error) {
      console.log('Error', error.message)
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