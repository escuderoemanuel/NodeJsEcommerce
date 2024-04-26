const jwt = require('jsonwebtoken');
const { JWT_PRIVATE_KEY } = require('../config/environment.config');

// JWT Middleware
const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    jwt.verify(accessToken, JWT_PRIVATE_KEY, (error, decoded) => {
      if (error) {
        return res.status(403).send({ status: 'error', error: 'Utils JWT Verify Forbidden', message: error.message });
      }
      req.user = decoded;
      next();
    });
  }
}

module.exports = {
  verifyToken
};