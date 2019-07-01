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

  logIn() {
    this.lastLoggedInAt = new Date();
    this.loggedIn = true;
  }
}
