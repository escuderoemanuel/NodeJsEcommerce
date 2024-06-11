const { Router } = require('express');
const UsersController = require('../controllers/users.controller');
const upload = require('../middlewares/upload.middleware');

const usersRouter = Router();

usersRouter.get('/', UsersController.getAll);
usersRouter.get('/premium/:uid', UsersController.changeRole);
usersRouter.post('/:uid/documents', upload.any(), UsersController.uploadDocuments)

module.exports = usersRouter