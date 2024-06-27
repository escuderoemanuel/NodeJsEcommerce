class UserDTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.id = user._id;
    this.age = user.age;
    this.email = user.email;
    this.cart = user.cart;
    this.role = user.role;
    this.lastConnection = user.lastConnection;
    this.documents = user.documents;
    this.documents.profilePicture = user.documents?.profilePicture;
  }
}

module.exports = UserDTO;