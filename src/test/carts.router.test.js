const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const chai = require('chai');
const supertest = require('supertest');
const { TESTING_URL, MONGO_URL } = require('../config/environment.config');
const expect = chai.expect;
const requester = supertest(TESTING_URL);
const cartsModel = require('../dao/models/carts.model');

mongoose.connect(MONGO_URL);

describe('🔰 CARTS ROUTER TESTS', function () {
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
    this.cartMock = {
      products: []
    };
  });


  it('01. [GET]: "/api/carts" should get all carts with any user role', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Get all carts
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);

    //! Tests
    expect(getCartsResponse.statusCode).to.equal(200);
    expect(getCartsResponse._body.status).to.equal('success');
    expect(getCartsResponse._body).to.have.property('carts');
    expect(getCartsResponse._body.carts).to.be.an('array');
  })

  it('02. [POST]: "/api/carts" should create a cart', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Create a cart
    const createCartResponse = await requester.post('/api/carts').set('Authorization', `Bearer ${token}`);

    //! Tests
    expect(createCartResponse.statusCode).to.equal(200);
    expect(createCartResponse._body.status).to.equal('success');
    expect(createCartResponse._body).to.have.property('payload');
    expect(createCartResponse._body.payload).to.have.property('_id');
  })

  it('03. [GET]: "/api/carts/{cid}" should to get a cart by id', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Get all carts
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = getCartsResponse._body.carts[0]._id

    //! Get a cart by id
    const getCartByIdResponse = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);

    //! Tests
    expect(getCartByIdResponse.statusCode).to.equal(200);
    expect(getCartByIdResponse._body.status).to.equal('success');
    expect(getCartByIdResponse._body).to.have.property('payload');
    expect(getCartByIdResponse._body.payload).to.have.property('_id');
    expect(getCartByIdResponse._body.payload).to.have.property('products').to.be.an('array');
  })

  it('04. [DELETE]: "/api/carts/{cid}" should empty a cart by id', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Create a cart
    const createCartResponse = await requester.post('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = createCartResponse._body.payload._id;

    //! Empty a cart by id
    const deleteCartByIdResponse = await requester.delete(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);

    //! Get a cart by id
    const getCartByIdResponse = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const quantityOfProductsInTheCart = getCartByIdResponse._body.payload.products.length

    //! Tests
    expect(deleteCartByIdResponse.statusCode).to.equal(200);
    expect(deleteCartByIdResponse._body.status).to.equal('success');
    expect(quantityOfProductsInTheCart).to.equal(0);
  })

  it('05. [GET]: "/api/carts/{cid}/purchase" should generate a ticket', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Create a cart
    const createCartResponse = await requester.post('/api/carts').set('Authorization', `Bearer ${token}`);

    //! Get all carts
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = getCartsResponse._body.carts[getCartsResponse._body.carts.length - 1]._id

    //! Purchase a cart
    const purchaseCartResponse = await requester.get(`/api/carts/${cid}/purchase`).set('Authorization', `Bearer ${token}`);

    //! Tests
    expect(purchaseCartResponse.statusCode).to.equal(200);
    expect(purchaseCartResponse._body.status).to.equal('success');
    expect(purchaseCartResponse._body).to.have.property('payload').to.be.an('array');
  })

  it('06. [POST]: "/api/carts/{cid}/product/{pid}" should add a product by id to cart by id for an account with role "user"', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.userMock);
    const token = this.cookie.value;

    //! Create a cart
    const createCartResponse = await requester.post('/api/carts').set('Authorization', `Bearer ${token}`);

    //! Get all carts to extract the id to the created cart
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = getCartsResponse._body.carts[getCartsResponse._body.carts.length - 1]._id

    //! Consult all products to extract any pid
    const productsResponse = await requester.get('/api/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Add a product to cart
    const addProductToCartResponse = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Authorization', `Bearer ${token}`);

    //! Get cart by id to verify if the product was added successfully
    const getCartByIdResponse = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const quantityOfProductsInTheCart = getCartByIdResponse._body.payload.products.length

    //! Tests
    expect(addProductToCartResponse.statusCode).to.equal(200);
    expect(addProductToCartResponse._body.status).to.equal('success')
    expect(quantityOfProductsInTheCart).to.equal(1)
  })

  it('07. [POST]: "/api/carts/{cid}/product/{pid}" should add a product by id to cart by id for an account with role "premium"', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.premiumMock);
    const token = this.cookie.value;

    //! Create a cart
    const createCartResponse = await requester.post('/api/carts').set('Authorization', `Bearer ${token}`);

    //! Get all carts to extract the id to the created cart
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = getCartsResponse._body.carts[getCartsResponse._body.carts.length - 1]._id

    //! Consult all products to extract any pid
    const productsResponse = await requester.get('/api/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Add a product to cart
    const addProductToCartResponse = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Authorization', `Bearer ${token}`);

    //! Get cart by id to verify if the product was added successfully
    const getCartByIdResponse = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const quantityOfProductsInTheCart = getCartByIdResponse._body.payload.products.length

    //! Tests
    expect(addProductToCartResponse.statusCode).to.equal(200);
    expect(addProductToCartResponse._body.status).to.equal('success')
    expect(quantityOfProductsInTheCart).to.equal(1)
  })

  it('08. [POST]: "/api/carts/{cid}/product/{pid}" should NOT add a product by id to cart by id for an account with role "admin"', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.adminMock);
    const token = this.cookie.value;

    //! Create a cart
    const createCartResponse = await requester.post('/api/carts').set('Authorization', `Bearer ${token}`);

    //! Get all carts to extract the id to the created cart
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = getCartsResponse._body.carts[getCartsResponse._body.carts.length - 1]._id

    //! Consult all products to extract any pid
    const productsResponse = await requester.get('/api/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Add a product to cart
    const addProductToCartResponse = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Authorization', `Bearer ${token}`);

    //! Get cart by id to verify if the product was added successfully
    const getCartByIdResponse = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const quantityOfProductsInTheCart = getCartByIdResponse._body.payload.products.length

    //! Tests
    expect(addProductToCartResponse.statusCode).to.equal(403);
    expect(addProductToCartResponse._body.status).to.equal('error')
    expect(quantityOfProductsInTheCart).to.equal(0)
  })

  it('09. [DELETE]: "/api/carts/{cid}/product/{pid}" should delete from the cart a product by id', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.premiumMock);
    const token = this.cookie.value;

    //! Get all carts to extract the id to the created cart
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = getCartsResponse._body.carts[getCartsResponse._body.carts.length - 1]._id

    //! Consult all products to extract any pid
    const productsResponse = await requester.get('/api/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Add a product to cart
    const addProductToCartResponse = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Authorization', `Bearer ${token}`);

    //! Get cart by id to verify if the product was added successfully
    const getCartByIdResponseBeforeDelete = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const quantityOfProductsInTheCartBeforeDelete = getCartByIdResponseBeforeDelete._body.payload.products.length

    //! Delete product from cart
    const deleteProductFromCartResponse = await requester.delete(`/api/carts/${cid}/product/${pid}`)

    //! Get cart by id to verify if the product was deleted successfully
    const getCartByIdResponseAfterDelete = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const quantityOfProductsInTheCartAfterDelete = getCartByIdResponseAfterDelete._body.payload.products.length

    //! Tests
    expect(deleteProductFromCartResponse.statusCode).to.equal(200);
    expect(deleteProductFromCartResponse._body.status).to.equal('success');
    expect(quantityOfProductsInTheCartBeforeDelete).not.to.equal(quantityOfProductsInTheCartAfterDelete)
  })

  it('10. [PUT]: "/api/carts/{cid}/product/{pid}" should update the quantity of a product', async () => {
    //! Get the cookie
    this.cookie = await this.getCookie(this.premiumMock);
    const token = this.cookie.value;

    //! Get all carts to extract the id to the created cart
    const getCartsResponse = await requester.get('/api/carts').set('Authorization', `Bearer ${token}`);
    const cid = getCartsResponse._body.carts[getCartsResponse._body.carts.length - 1]._id;

    //! Consult all products to extract any pid
    const productsResponse = await requester.get('/api/products').set('Authorization', `Bearer ${token}`);
    const pid = productsResponse._body.payload[0]._id;

    //! Add a product to cart
    const addProductToCartResponse = await requester.post(`/api/carts/${cid}/product/${pid}`).set('Authorization', `Bearer ${token}`);

    //! Get cart by id to verify if the product was added successfully
    const getCartByIdResponseBeforeUpdate = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const productInCartBeforeUpdate = getCartByIdResponseBeforeUpdate._body.payload.products.find(p => p.product._id === pid);
    const quantityOfProductInCartBeforeUpdate = productInCartBeforeUpdate.quantity;

    //! Update the product stock by id
    let newQuantity;
    do {
      newQuantity = faker.number.int({ min: 1, max: 30 });
    } while (newQuantity === quantityOfProductInCartBeforeUpdate);

    //! Update the quantity of the added product
    const updateProductFromCartResponse = await requester.put(`/api/carts/${cid}/product/${pid}`).send({ 'quantity': newQuantity }).set('Authorization', `Bearer ${token}`);

    //! Get cart by id to verify if the product quantity was updated successfully
    const getCartByIdResponseAfterUpdate = await requester.get(`/api/carts/${cid}`).set('Authorization', `Bearer ${token}`);
    const productInCartAfterUpdate = getCartByIdResponseAfterUpdate._body.payload.products.find(p => p.product._id === pid);
    const quantityOfProductInCartAfterUpdate = productInCartAfterUpdate.quantity;

    //! Tests
    expect(updateProductFromCartResponse.statusCode).to.equal(200);
    expect(updateProductFromCartResponse._body.status).to.equal('success');
    expect(quantityOfProductInCartBeforeUpdate).not.to.equal(quantityOfProductInCartAfterUpdate);
  });
});

