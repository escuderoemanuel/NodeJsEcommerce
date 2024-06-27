const { Router } = require('express');
const UsersController = require('../controllers/users.controller');
const upload = require('../middlewares/upload.middleware');
const getRole = require('../middlewares/getRole.middleware');
const { verifyToken } = require('../middlewares/verifyToken.middleware');

const usersRouter = Router();


usersRouter.get('/', verifyToken, getRole('admin'), UsersController.getAll);
usersRouter.delete('/', verifyToken, getRole('admin'), UsersController.deleteInactive)

usersRouter.put('/:uid', verifyToken, UsersController.update);
usersRouter.delete('/:uid', verifyToken, getRole('admin'), UsersController.delete)
usersRouter.get('/:uid', verifyToken, getRole('admin'), UsersController.getById)

usersRouter.get('/changeRole/:uid', verifyToken, UsersController.changeRole);

usersRouter.post('/:uid/documents', verifyToken, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'identification', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 },
  { name: 'proofOfAccountStatus', maxCount: 1 }
]), UsersController.uploadDocuments)


module.exports = usersRouter