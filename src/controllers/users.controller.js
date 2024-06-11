const { usersService } = require('../repositories');

class UsersController {
  static async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      res.send({ status: 'success', payload: users })
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message })
    }
  }

  static async changeRole(req, res) {
    const uid = req.params.uid;
    try {
      const user = await usersService.getById(uid);
      if (!['user', 'premium'].includes(user.role)) {
        throw new Error(`The user's role is not valid`)
      }

      const requiredDocuments = [
        'Identification',
        'Proof of Address',
        'Proof of Account Status'
      ];

      if (user.role == 'user') {
        if (!user.documents.some(d => d.name.includes('Identification'))) {
          throw new Error('The user has not finished uploading the required documentation')
        }
        if (!user.documents.some(d => d.name.includes('Proof of Address'))) {
          throw new Error('The user has not finished uploading the required documentation')
        }
        if (!user.documents.some(d => d.name.includes('Proof of Account Status'))) {
          throw new Error('The user has not finished uploading the required documentation')
        }
      }

      if (!['user', 'premium'].includes(user.role)) {
        throw new Error('User has invalid role')
      }

      user.role = user.role == 'user' ? 'premium' : 'user'



      let updatedUser = await usersService.update(user._id.toString(), { $set: { role: user.role } });
      res.send({ status: 'success', message: `role updated to '${user.role}'` })

    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message })
    }
  }

  static async uploadDocuments(req, res) {
    try {
      const { uid } = req.params;
      const result = await usersService.addDocuments(uid, req.files)
      res.send({ status: 'success', payload: result })
    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message })
    }
  }
}



module.exports = UsersController; 