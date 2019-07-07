import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, property } from '../db/db';
import * as config from '../config';

export default class UserHelper {
  static findUser(field, value) {
    let userFound = null;
    userFound = users.filter(thisUser => thisUser[field] === value);
    if (Object.keys(userFound).length !== 0) {
      return userFound[0];
    }
    return null;
  }

  static findUserById(id) {
    return this.findUser('id', id);
  }

  static findUserByEmail(email) {
    return this.findUser('email', email);
  }

  static findPropertyOwner(id) {
    const propertyFound = property.filter(match => match.id === id);
    if (Object.keys(propertyFound).length !== 0) {
      return this.findUser('id', propertyFound[0].owner);
    }
    return null;
  }

  static hashPassword(password) {
    // @ts-ignore
    const salt = bcrypt.genSaltSync(10);
    // @ts-ignore
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static comparePassword(password, hash) {
    // @ts-ignore
    return bcrypt.compareSync(password, hash);
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      address: user.address,
      type: user.type,
      phoneNumber: user.phoneNumber,
      is_admin: user.isAdmin,
      dob: user.dob,
      state: user.state,
      country: user.country,
      createdAt: user.createdAt,
    };
    const token = jwt.sign({ payload }, config.secret, { expiresIn: 86400 });
    return token;
  }
}
