const { usersService } = require('../repositories');
const UserDTO = require('../dao/DTOs/UserDTO');

class UsersController {
  static async getAll(req, res) {
    const uid = req.user.id;
    try {
      const user = await usersService.getById(uid);
      const users = await usersService.getAll();
      const usersDTO = users.map(u => {
        const userDTO = new UserDTO(u);
        return {
          ...userDTO,
          isUser: u.role === 'user',
          isPremium: u.role === 'premium',
          isAdmin: u.role === 'admin'
        };
      });
      const acceptHeader = req.headers['accept'] || '';
      if (acceptHeader.includes('text/html')) {
        res.render('users', { user, users: usersDTO });
      } else {
        res.send({ status: 'success', payload: usersDTO });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message });
    }
  }

  static async getById(req, res) {
    const { uid } = req.params;
    try {
      const user = await usersService.getById(uid);
      const userDTO = new UserDTO(user);
      res.send({ status: 'success', payload: userDTO });
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message });
    }
  }


  static async handleRoleChange(user, userUpdates) {
    if (userUpdates.role && user.role === 'user' && (userUpdates.role === 'premium' || userUpdates.role === 'admin')) {
      const requiredDocuments = [
        user.documents.identification,
        user.documents.proofOfAddress,
        user.documents.proofOfAccountStatus,
      ];
      if (requiredDocuments.some(d => d === null)) {
        throw new Error('The user has not finished uploading the required documentation');
      }
    }
    if (userUpdates.role && user.role !== 'user' && userUpdates.role === 'user') {
      userUpdates.role = 'user';
    }
    return userUpdates;
  }


  static async changeRole(req, res) {
    const { uid } = req.params;
    const userUpdates = req.body;
    try {
      const user = await usersService.getById(uid);
      const updatedUser = await UsersController.handleRoleChange(user, userUpdates);
      const result = await usersService.update(uid, updatedUser);
      console.log('result', result)
      res.send({ status: 'success', message: 'User updated successfully', payload: result });
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message });
    }
  }


  static async uploadDocuments(req, res) {
    const { uid } = req.params;
    const files = req.files;

    const documents = {
      profilePicture: 'profilePicture',
      identification: 'identification',
      proofOfAddress: 'proofOfAddress',
      proofOfAccountStatus: 'proofOfAccountStatus'
    }

    try {
      const user = await usersService.getById(uid);
      if (!user) {
        return res.status(404).send({ status: 'error', message: 'User not found' });
      }

      // Asigno los docs subidos al campo que le corresponde
      Object.keys(files).forEach(field => {
        const file = files[field][0];
        const docType = documents[field];
        if (docType) {
          user.documents[docType] = {
            name: file.originalname,
            reference: file.path.split('public')[1].replace(/\\/g, '/'),
          }
        }
      })

      const result = await usersService.update(uid, user);
      res.send({ status: 'success', message: 'Documents uploaded successfully', payload: result });
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message });
    }
  }


  static async deleteInactive(req, res) {
    try {
      const result = await usersService.deleteInactive();
      res.send({ status: 'success', message: 'Inactive users deleted successfully', payload: result })
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message })
    }
  }


  static async delete(req, res) {
    try {
      const { uid } = req.params;
      const currentUser = req.user;
      if (uid === currentUser.id) {
        return res.status(400).send({ status: 'error', message: 'You cannot delete your own account' })
      }
      const result = await usersService.delete(uid);
      res.send({ status: 'success', payload: result })
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message })
    }
  }


  static async update(req, res) {
    const { uid } = req.params;
    const userUpdates = req.body;
    try {
      const user = await usersService.getById(uid);
      const updatedUser = await UsersController.handleRoleChange(user, userUpdates);
      const result = await usersService.update(uid, updatedUser);
      res.send({ status: 'success', message: 'User updated successfully', payload: result });
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message });
    }
  }

}

module.exports = UsersController;
