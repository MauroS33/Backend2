class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role; // para los roles a definir mas adelante
  }
}

module.exports = UserDTO;