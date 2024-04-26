const getRole = (role) => (req, res, next) => {
  const user = req.user;
  if (user.role !== role) {
    return res.status(403).send({ status: 'error', error: `Account of type '${role}' are not authorized` });
  }
  next();
}

module.exports = getRole;