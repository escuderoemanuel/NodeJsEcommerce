const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const chai = require('chai');
const supertest = require('supertest');
const { TESTING_URL, MONGO_URL } = require('../config/environment.config');
const expect = chai.expect;
const requester = supertest(TESTING_URL);
const productsModel = require('../dao/models/products.model');

mongoose.connect(MONGO_URL);

describe('🔰 PRODUCTS ROUTER TESTS', function () {
  this.timeout(10000); // Increase timeout to 10 seconds

  //! Set general variables and functions
  before(async () => {
    this.userMock = {
      email: 'user@user.com',
      password: '1111'
    };
    this.adminMock = {
      email: 'admin@admin.com',
      password: '1111'
    };
    this.premiumMock = {
      email: 'premium@premium.com',
      password: '1111'
    };
    this.cookie = null;

    //! Function to get the cookie from the response headers
    this.getCookie = async (userMock) => {
      const loginResponse = await requester.post('/api/sessions/login').send(userMock);
      const cookieFromHeaders = loginResponse.headers['set-cookie'][0];
      const cookieMainPart = cookieFromHeaders.split(';')[0];
      const cookieParts = cookieMainPart.split('=');
      return {
        name: cookieParts[0].trim(),
        value: cookieParts[1].trim()
      };
    }
  });

  beforeEach(async () => {
    this.productMock = {
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      thumbnails: [
        faker.image.url(),
        faker.image.url()
      ],
      code: faker.string.alphanumeric(8),
      stock: faker.number.int({ min: 1, max: 10 }),
      category: faker.commerce.department(),
      status: faker.datatype.boolean(1)
    };
  });


  it('01. [GET]: "/products" should get all products with any user role ', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Get the products
    const productsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);

    //! Tests
    expect(productsResponse.status).to.equal(200);
    expect(productsResponse._body.status).to.equal('success');
    expect(productsResponse._body.payload).to.be.an('array');
  });

  it('02. [POST]: "/products" should reject the creation of a new product with an account with role "user"', async () => {
    //! Get the cookie from the user with role 'user'
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;
    //! Create a new Product
    const productsResponse = await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);
    //! Tests
    expect(productsResponse.statusCode).to.equal(403);
    expect(productsResponse._body).to.have.property('error');
    expect(productsResponse._body.status).to.equal('error');
  });

  it('03. [POST]: "/products" should allow the creation of a new product with an account with role "premium"', async () => {
    //! Get the cookie from the user with role 'premium'
    this.cookie = await this.getCookie(this.premiumMock);
    const token = this.cookie.value;

    //! Create a new Product
    const productsResponse = await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);
    //! Tests
    expect(productsResponse.statusCode).to.equal(200);
    expect(productsResponse._body.status).to.equal('success');
    expect(productsResponse._body).to.have.property('message').and.equal('Product created');
  });

  it('04. [POST]: "/products" should allow the creation of a new product with an account with role "admin"', async () => {
    //! Get the cookie from the user with role 'admin'
    this.cookie = await this.getCookie(this.adminMock);
    const token = this.cookie.value;

    //! Create a new Product
    const productsResponse = await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);
    //! Tests
    expect(productsResponse.statusCode).to.equal(200);
    expect(productsResponse._body.status).to.equal('success');
    expect(productsResponse._body).to.have.property('message').and.equal('Product created');
  });



  it('05. [GET]: "/products/{pid}" should get the product with the queried "pid" with any user role', async () => {
    //! Get the cookie from the user with role 'admin'
    this.cookie = await this.getCookie(this.adminMock);
    const token = this.cookie.value;

    //! Create a new product to query
    await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);

    //! Consult all products to extract any pid
    const productsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Consult a product by id
    const productResponse = await requester.get(`/products/${pid}`).set('Authorization', `Bearer ${token}`);

    //! Tests
    expect(productResponse.statusCode).to.equal(200);
    expect(productResponse._body.status).to.equal('success');
    expect(productResponse._body).to.have.property('product');
    expect(productResponse._body.product).to.have.property('_id');
  });

  it('06. [PUT]: "/products/{pid}" should update a product with an account with role "user"', async () => {
    //! Get the cookie from the user with role 'user'
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Create a new product to update
    await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);

    //! Consult all products to extract a pid and stock
    const productsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Consult a product by id
    const productResponse = await requester.get(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const initialProduct = productResponse._body.product;
    const initialStock = initialProduct.stock;

    //! Update the product stock by id
    let newStock;
    do {
      newStock = faker.number.int({ min: 1, max: 30 });
    } while (newStock === initialStock);

    const updateProductResponse = await requester.put(`/products/${pid}`).send({ stock: newStock }).set('Authorization', `Bearer ${token}`);

    //! Consult the updated product
    const updatedProductResponse = await requester.get(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const updatedProduct = updatedProductResponse._body.product;
    const updatedStock = updatedProduct.stock;
    //! Tests
    expect(updateProductResponse.statusCode).to.equal(403);
    expect(updateProductResponse._body.status).to.equal('error');
    expect(initialStock).to.equal(updatedStock);
  });

  it('07. [PUT]: "/products/{pid}" should update a product with an account with role "admin"', async () => {
    //! Get the cookie from the user with role 'admin'
    this.cookie = await this.getCookie(this.adminMock);
    const token = this.cookie.value;

    //! Create a new product to update
    await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);

    //! Consult all products to extract a pid and stock
    const productsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Consult a product by id
    const productResponse = await requester.get(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const initialProduct = productResponse._body.product;
    const initialStock = initialProduct.stock;

    //! Update the product stock by id
    let newStock;
    do {
      newStock = faker.number.int({ min: 1, max: 30 });
    } while (newStock === initialStock);

    const updateProductResponse = await requester.put(`/products/${pid}`).send({ stock: newStock }).set('Authorization', `Bearer ${token}`);

    //! Consult the updated product
    const updatedProductResponse = await requester.get(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const updatedProduct = updatedProductResponse._body.product;
    const updatedStock = updatedProduct.stock;

    //! Tests
    expect(updateProductResponse.statusCode).to.equal(200);
    expect(updateProductResponse._body.status).to.equal('success');
    expect(initialStock).to.not.equal(updatedStock);
  });

  it('08. [PUT]: "/products/{pid}" should update a product with an account with role "premium"', async () => {
    //! Get the cookie from the user with role 'admin'
    this.cookie = await this.getCookie(this.premiumMock);
    const token = this.cookie.value;

    //! Create a new product to update
    await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);

    //! Consult all products to extract a pid and stock
    const productsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Consult a product by id
    const productResponse = await requester.get(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const initialProduct = productResponse._body.product;
    const initialStock = initialProduct.stock;

    //! Update the product stock by id
    let newStock;
    do {
      newStock = faker.number.int({ min: 1, max: 30 });
    } while (newStock === initialStock);

    const updateProductResponse = await requester.put(`/products/${pid}`).send({ stock: newStock }).set('Authorization', `Bearer ${token}`);

    //! Consult the updated product
    const updatedProductResponse = await requester.get(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const updatedProduct = updatedProductResponse._body.product;
    const updatedStock = updatedProduct.stock;

    //! Tests
    expect(updateProductResponse.statusCode).to.equal(200);
    expect(updateProductResponse._body.status).to.equal('success');
    expect(initialStock).to.not.equal(updatedStock);
  });

  it('09. [DELETE]: "/products/{pid}" should reject the deletion of a product if the account is role "user"', async () => {
    //! Get the cookie from the user with role 'user'
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Create a new product to delete
    await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);

    //! Consult all products to extract a pid
    const initialProductsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const initialQuantityProducts = initialProductsResponse._body.payload.length;
    const pid = initialProductsResponse._body.payload[initialProductsResponse._body.payload.length - 1]._id;

    //! Delete the product by id
    const deleteProductResponse = await requester.delete(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const newProductsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const newQuantityProducts = newProductsResponse._body.payload.length;

    //! Tests
    expect(deleteProductResponse.statusCode).to.equal(403);
    expect(deleteProductResponse._body.status).to.equal('error');
    expect(initialQuantityProducts).to.equal(newQuantityProducts);
  });

  it('10. [DELETE]: "/products/{pid}" should reject the deletion of a product if the account is role "premium"', async () => {
    //! Get the cookie from the user with role 'premium'
    this.cookie = await this.getCookie(this.premiumMock);
    const token = this.cookie.value;

    //! Create a new product to delete
    await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);

    //! Consult all products to extract a pid
    const initialProductsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const initialQuantityProducts = initialProductsResponse._body.payload.length;
    const pid = initialProductsResponse._body.payload[initialProductsResponse._body.payload.length - 1]._id;

    //! Delete the product by id
    const deleteProductResponse = await requester.delete(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const newProductsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const newQuantityProducts = newProductsResponse._body.payload.length;

    //! Tests
    expect(deleteProductResponse.statusCode).to.equal(200);
    expect(deleteProductResponse._body.status).to.equal('success');
    expect(initialQuantityProducts).not.to.equal(newQuantityProducts);
  });

  it('11. [DELETE]: "/products/{pid}" should allow the deletion of a product if the account is role "admin"', async () => {
    //! Get the cookie from the user with role 'admin'
    this.cookie = await this.getCookie(this.adminMock);
    const token = this.cookie.value;

    //! Create a new product to delete
    await requester.post('/products').send(this.productMock).set('Authorization', `Bearer ${token}`);

    //! Consult all products to extract a pid
    const initialProductsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const initialQuantityProducts = initialProductsResponse._body.payload.length;
    const pid = initialProductsResponse._body.payload[initialProductsResponse._body.payload.length - 1]._id;

    //! Delete the product by id
    const deleteProductResponse = await requester.delete(`/products/${pid}`).set('Authorization', `Bearer ${token}`);
    const newProductsResponse = await requester.get('/products').set('Authorization', `Bearer ${token}`);
    const newQuantityProducts = newProductsResponse._body.payload.length;

    //! Tests
    expect(deleteProductResponse.statusCode).to.equal(200);
    expect(deleteProductResponse._body.status).to.equal('success');
    expect(initialQuantityProducts).not.to.equal(newQuantityProducts);
  });
});

