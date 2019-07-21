/* eslint-disable camelcase */
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
*       phoneNumber:
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
    id,
    email,
    first_name,
    last_name,
    password,
    phoneNumber,
    address,
    is_admin,
    dob,
    state,
    country,
    loggedIn,
    type,
    created_on,
    lastLoggedInAt,
  }) {
    this.id = id || '';
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.password = password;
    this.phoneNumber = phoneNumber || '';
    this.address = address || '';
    this.is_admin = is_admin || false;
    this.dob = dob || '';
    this.state = state || '';
    this.country = country || '';
    this.loggedIn = false;
    this.type = type || 'user';
    this.is_admin = is_admin || false;
    this.token = '';
    this.created_on = new Date();
    this.lastLoggedInAt = null;
  }
}
