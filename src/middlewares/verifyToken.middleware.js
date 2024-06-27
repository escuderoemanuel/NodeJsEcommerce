const jwt = require('jsonwebtoken');
const { JWT_PRIVATE_KEY } = require('../config/environment.config');

// JWT Middleware
const verifyToken = (req, res, next) => {
  let accessToken = req.cookies.accessToken;

  // If accessToken is not found in the cookies, look in the Authorization header
  if (!accessToken) {
    const authHeader = req.headers['authorization'];
    accessToken = authHeader && authHeader.split(' ')[1];
  }

  if (!accessToken) {
    return res.status(401).json({ status: 'error', error: 'Token not provided' });
  }

  jwt.verify(accessToken, JWT_PRIVATE_KEY, (error, decoded) => {
    if (error) {
      return res.status(403).json({ status: 'error', error: 'Invalid token', message: error.message });
    }
    req.user = decoded;
    next();
  });
}



module.exports = {
  verifyToken
};