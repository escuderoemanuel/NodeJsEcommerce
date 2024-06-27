const jwt = require('jsonwebtoken');
const { JWT_PRIVATE_KEY } = require('../config/environment.config');

class TestTokenController {
  static getTestToken(req, res) {

    try {
      const testUser = { id: 'test_id', email: 'test@example.com' };
      const testToken = jwt.sign(testUser, JWT_PRIVATE_KEY, { expiresIn: '7d' }); // Token valid for 7 days
      res.json({ token: testToken });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error in TestToken' });
    }
  }
}

module.exports = {
  getTestToken: TestTokenController.getTestToken
};
