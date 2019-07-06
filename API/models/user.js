/**
* @swagger
* definitions:
*   error:
*     properties:
*       statusCode:
*         type: integer
*         format: int32
*         default: 400
*       message:
*         type: string
*       error:
*         type: string
*   success:
*     properties:
*       statusCode:
*         type: integer
*         format: int32
*         default: 200
*       message:
*         type: string
*       data:
*         type: object
*   User:
*     type: object
*     properties:
*       id:
*         type: number
*         format: integer
*       first_name:
*         type: string
*       last_name:
*         type: string
*       email:
*         type: string
*         format: email
*       password:
*         type: string
*         format: password
*       phone_number:
*         type: number
*         format: tel
*       address:
*         type: string
*       is_admin:
*         type: boolean
*       dob:
*         type: string
*         format: date
*       state:
*         type: string
*       country:
*         type: string
*/

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
