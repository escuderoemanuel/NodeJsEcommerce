const getRole = (roles) => (req, res, next) => {
  const user = req.user;

  if (!Array.isArray(roles)) {
    roles = [roles]
  }

  if (!roles.includes(user.role)) {
    return res.status(403).send({ status: 'error', error: `Accounts of type '${user.role}' are not authorized for this operation` });
  }
  next();
}

module.exports = getRole;