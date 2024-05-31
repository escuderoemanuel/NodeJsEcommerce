// fs will allow us to access operations for files
const fs = require('fs');

const encoding = 'utf-8';

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async getProducts() {

    try {
      // Verify if the file exists.
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(this.path, '[]', encoding)
      }

      // Read the file, parse the data and save the data in the object.
      const data = await fs.promises.readFile(this.path, encoding)
      this.products = await JSON.parse(data)
      return this.products;

    } catch (error) {
      throw new Error(error.message)
    }
  }


  async addProduct(title, description, price, thumbnails, code, stock, status, category) {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(this.path, '[]', encoding)
      }

      // Read the file, parse the data and save the data in the const parsedData.
      const data = await fs.promises.readFile(this.path, encoding);
      const parsedData = await JSON.parse(data);

      // Verify if all the fields are filled.
      if (!title || !description || !price || !code || !stock || !category || !status) {
        throw new Error('All fields are required');
      }

      // Verify if the product code already exists.
      if (parsedData.find(prod => prod.code === code)) {
        throw new Error('The product code already exists.');
      } else {
        // If the product code does not exist, decleare the id variable, check the number of existing ids and add 1 to the last one and assign it to the new product
        const id = parsedData.length > 0 ? parsedData[parsedData.length - 1].id + 1 : 1;
        const product = {
          id,
          title,
          description,
          price,
          thumbnails,
          code,
          stock,
          status,
          category,
        };

        // Add the new product to the products array.
        parsedData.push(product);


        // Save the updated data in the file.
        await fs.promises.writeFile(this.path, JSON.stringify(parsedData, null, 2), encoding);

        //return parsedData;
        return product;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(id) {
    try {
      // Read the file, parse the data and save the data in the const parsedData.
      const data = await fs.promises.readFile(this.path, encoding);
      const parsedData = await JSON.parse(data);

      // Find the product with the specified id.
      const product = parsedData.find(product => product.id === id);

      if (product) {
        return product;
      } else {
        throw new Error(`Product with id ${id} not found.`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(id, field) {
    try {
      // Array of fields that can be modified. (Without this validation you could add new fields)
      const validFields = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'status', 'category'];

      // Verify if the field is valid
      if (typeof field !== 'object' || Object.keys(field).length === 0 || !Object.keys(field).every(key => validFields.includes(key))) {
        throw new Error('The product cannot be modified. Invalid field.');
      }

      // Read the file, parse the data and save the data in the const parsedData.
      const data = await fs.promises.readFile(this.path, encoding);
      const parsedData = await JSON.parse(data);

      // Find the index position of the product to update
      const productIndex = parsedData.findIndex(product => product.id === id);

      // If product index id valid
      if (productIndex !== -1) {
        // Itarates in search of the index of the field to update
        for (const key in field) {
          if (validFields.includes(key)) {
            parsedData[productIndex][key] = field[key]
          }
        }

        // After to update the field => transform the object in json string
        await fs.promises.writeFile(this.path, JSON.stringify(parsedData, null, 2), encoding);
        // To return the updated product and show it if is neccesary
        return parsedData[productIndex]
      } else {
        throw new Error(`Product with id '${id}' not found.`)
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(id) {
    try {
      // Read the file, parse the data and save the data in the const parsedData.
      const data = await fs.promises.readFile(this.path, encoding);
      const parsedData = await JSON.parse(data);

      // Find the index position of the product to delete. If the product is not found, it will return -1.
      const productIndex = parsedData.findIndex(product => product.id === id);

      if (productIndex !== -1) {
        // Delete 1 product, from the specified productIndex
        parsedData.splice(productIndex, 1);
        // After to delete the product => transform the object in json string.
        await fs.promises.writeFile(this.path, JSON.stringify(parsedData, null, 2), encoding);

      } else {
        throw new Error(`Product to delete with id '${id}' not found!`)
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

// Exportación para utilizar en el app.js
module.exports = ProductManager;
