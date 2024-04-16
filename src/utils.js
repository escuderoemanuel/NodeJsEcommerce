const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PRIVATE_KEY = process.env.PRIVATE_KEY;

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
  const accessToken = jwt.sign({ serializableUser }, PRIVATE_KEY, { expiresIn: '1d' });
  // console.log('accessToken en generateToken', accessToken)
  return accessToken;
}

// JWT Middleware
const verifyToken = (req, res, next) => {

  const accessToken = req.cookies.accessToken;
  //  console.log('accessToken en verifyToken', accessToken)

  jwt.verify(accessToken, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).send({ status: 'error', error: 'Forbidden' });
    }
    req.tokenUser = credentials;
    next();
  });
}

module.exports = {
  createHash,
  isValidPassword,
  generateToken,
  verifyToken
};