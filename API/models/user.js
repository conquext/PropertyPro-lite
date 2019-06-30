/* eslint-disable no-unused-vars */
export default class User {
  constructor({
    userId,
    email,
    firstName,
    lastName,
    password,
    phoneNumber,
    address,
    isAdmin,
    dob,
    state,
    country,
    loggedIn,
    type,
    createdAt,
    lastLoggedInAt,
  }) {
    this.userId = userId || '';
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.phoneNumber = phoneNumber || '';
    this.address = address || '';
    this.isAdmin = isAdmin || false;
    this.dob = dob || '';
    this.state = state || '';
    this.country = country || '';
    this.accountNumber = '';
    this.loggedIn = false;
    this.type = type || 'user';
    this.balance = null;
    this.token = '';
    this.createdAt = new Date();
    this.lastLoggedInAt = null;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  getLastLoggedInAt() {
    return this.lastLoggedInAt;
  }

  logIn() {
    this.lastLoggedInAt = new Date();
    this.loggedIn = true;
  }

  logOut() {
    this.loggedIn = false;
  }

  getFirstName() {
    return this.firstName;
  }

  getLastName() {
    return this.lastName;
  }

  getName() {
    return `${this.getLastName()} ${this.getFirstName()}`;
  }

  setName(name) {
    this.name = name;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    this.email = email;
  }

  getUserId() {
    return this.userId;
  }

  getType() {
    return this.type;
  }

  getDob() {
    return this.dob;
  }

  setDob(dob) {
    this.dob = dob;
  }

  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  isAdmin() {
    return this.type === 'admin';
  }

  getToken() {
    return this.token;
  }

  getPassword() {
    return this.password;
  }

  getUserData() {
    return {
      token: this.getToken(),
      id: this.getUserId(),
      firstName: this.getFirstName(),
      lastName: this.getLastName(),
      email: this.getEmail(),
      isAdmin: this.isAdmin(),
    };
  }
}
