const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_PRIVATE_KEY } = require('./config/environment.config');

// HASH PASSWORD
const createHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hashedPassword;
}

const isValidPassword = (user, password) => {
  const isValid = bcrypt.compareSync(password, user.password);
  return isValid;
}

// JWT
const generateToken = (serializableUser) => {
  //console.log('serializableUser en generateToken', serializableUser) //! El serializableUser llega aqui correctamente con el siguiente formato
  /* 
  serializableUser(userData) en product controller: {
  id: '661c9a1149c87e2230e74bd2',
  firstName: 'Test',
  lastName: 'Test',
  email: 'test@gmail.com',
  age: 23,
  role: 'user',
  password: '$2b$10$Sr6jY0VsjVV27Qx.Cw1BXOLPDhWQDfekneVA2/UPJPNIfihQ5/sf.'
}
   */

  const accessToken = jwt.sign({ serializableUser }, JWT_PRIVATE_KEY, { expiresIn: '1d' });

  //console.log('accessToken en generateToken', accessToken) //! Desde el navegador genera bien el token

  return ('return accessToken', accessToken);

}

// JWT Middleware
const verifyToken = (req, res, next) => {
  //console.log('Utils req.cookies.accessToken:', req.cookies.accessToken) //! EL NAVEGADOR LO RECUPERA, POSTMAN NO
  const accessToken = req.cookies.accessToken;
  //console.log('Utils accessToken en verifyToken', accessToken) //! Llega bien

  if (accessToken) {

    jwt.verify(accessToken, JWT_PRIVATE_KEY, (error, credentials) => {
      if (error) {
        return res.status(403).send({ status: 'error', error: 'Utils JWT Verify Forbidden', message: error.message });
      }
      req.tokenUser = credentials;
    });
  }
  next();

}

module.exports = {
  createHash,
  isValidPassword,
  generateToken,
  verifyToken
};