const getRole = (role) => (req, res, next) => {
  const user = req.user;
  if (user.role !== role) {
    return res.status(403).send({ status: 'error', error: `Accounts of type '${user.role}' are not authorized for this operation` });
  }
  next();
}

module.exports = getRole;