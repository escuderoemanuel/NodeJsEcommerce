const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const chai = require('chai');
const supertest = require('supertest');
const path = require('path');
const { TESTING_URL, MONGO_URL } = require('../config/environment.config');
const expect = chai.expect;
const requester = supertest(TESTING_URL);
const usersModel = require('../dao/models/user.model');

mongoose.connect(MONGO_URL)

describe('🔰 SESSIONS ROUTER TESTS', function () {
  this.timeout(10000); // Increase timeout to 10 seconds

  before(async () => {
    //! Create a new user with faker
    this.userMock = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      age: faker.number.int({ min: 18, max: 90 }),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    this.cookie;
  });

  it('01. [POST]: "/api/sessions/register" should register a new user correctly', async () => {
    //! Register a new user
    const response = await requester.post('/api/sessions/register').send(this.userMock);

    //! Tests
    expect(response.status).to.equal(200);
    expect(response._body.status).to.equal('success');
  });

  it('02. [POST]: "/api/sessions/login" should login an user and return a cookie', async () => {
    //! Register a new user
    const newUser = await requester.post('/api/sessions/register').send(this.userMock);

    //! Extract the email and password
    const loginMocK = {
      email: newUser.request._data.email,
      password: newUser.request._data.password,
    };

    //! Login the created user
    const response = await requester.post('/api/sessions/login').send(loginMocK);

    //! Extract the cookie
    const cookieFromHeaders = response.headers['set-cookie'][0];
    const cookieParts = cookieFromHeaders.split('=');
    this.cookie = {
      name: cookieParts[0],
      value: cookieParts[1]
    }

    //! Tests
    expect(response.status).to.equal(200);
    expect(response._body.status).to.equal('success');
    expect(this.cookie.name).to.be.equal('accessToken')
    expect(this.cookie.value).to.be.ok
  })

  it('03. [GET]: "/api/sessions/current" should return the current user', async () => {
    //! Register a new user
    const newUser = await requester.post('/api/sessions/register').send(this.userMock);

    //! Extract the email and password
    const loginMocK = {
      email: newUser.request._data.email,
      password: newUser.request._data.password,
    };

    //! Login the created user
    const response = await requester.post('/api/sessions/login').send(loginMocK);

    //! Extract the cookie
    const cookieFromHeaders = response.headers['set-cookie'][0];
    const cookieParts = cookieFromHeaders.split('=');
    this.cookie = {
      name: cookieParts[0],
      value: cookieParts[1]
    }

    //! Query the endpoint with the cookie
    const responseCurrent = await requester.get('/current').set('Cookie', `${this.cookie.name}=${this.cookie.value}`);
    const userFromCookie = responseCurrent._body.payload;

    //! Tests
    expect(responseCurrent.statusCode).to.equal(200);
    expect(userFromCookie).to.have.property('email')
    expect(userFromCookie).to.have.property('role')
    expect(userFromCookie.email).to.be.equal(loginMocK.email)
  })

  it('04. [GET]: "/api/sessions/logout" should delete the cookie with the token', async () => {
    //! Register a new user
    const newUser = await requester.post('/api/sessions/register').send(this.userMock);

    //! Extract the email and password
    const loginMocK = {
      email: newUser.request._data.email,
      password: newUser.request._data.password,
    };

    //! Login the created user
    const loginResponse = await requester.post('/api/sessions/login').send(loginMocK);

    //! Extract the login cookie
    const loginHeaders = loginResponse.headers['set-cookie'][0];
    const loginCookieParts = loginHeaders.split('=');
    const loginCookie = {
      name: loginCookieParts[0],
      value: loginCookieParts[1]
    }

    //! Logout the user
    const logoutResponse = await requester.get('/api/sessions/logout');

    //! Extract the logout cookie
    const logoutHeaders = logoutResponse.headers['set-cookie'][0];
    const logoutCookieParts = logoutHeaders.split('=');
    const logoutCookie = {
      name: logoutCookieParts[0],
      value: logoutCookieParts[1]
    }

    //! Extract expiration date of the logout cookie
    const expiresPart = logoutHeaders.split(';').find(part => part.trim().startsWith('Expires='));
    const logoutCookieExpires = expiresPart ? new Date(expiresPart.split('=')[1].trim()) : null;

    //! Tests
    expect(logoutResponse.statusCode).to.equal(200);
    expect(logoutResponse._body.status).to.equal('success');
    expect(logoutCookieExpires).to.be.a('date');
    expect(logoutCookieExpires).to.be.below(new Date());
    expect(logoutCookie.value).not.to.be.equal(loginCookie.value)
  })
});