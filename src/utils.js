const bcrypt = require('bcrypt');

// HASH PASSWORD
const createHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hashedPassword;
}

const isValidPassword = (user, password) => {
  const isValid = bcrypt.compareSync(password, user.password);
  return isValid;
}

module.exports = {
  createHash,
  isValidPassword,
};