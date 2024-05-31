const { usersService } = require('../repositories');

class UsersController {
  static async changeRole(req, res) {
    const uid = req.params.uid;
    try {
      const user = await usersService.getById(uid);
      if (!['user', 'premium'].includes(user.role)) {
        throw new Error(`The user's role is not valid`)
      }

      if (user.role === 'user') {
        user.role = 'premium';
      } else {
        user.role = 'user';
      }

      let updatedUser = await usersService.update(user._id.toString(), { $set: { role: user.role } });
      res.send({ status: 'success', message: `role updated to '${user.role}'` })

    } catch (error) {
      res.status(500).send({ status: 'error', error: error.message })
    }
  }

}

module.exports = UsersController; 