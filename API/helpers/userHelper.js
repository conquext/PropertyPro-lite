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

  static findUserById(userId) {
    return this.findUser('userId', userId);
  }

  static findUserByEmail(email) {
    return this.findUser('email', email);
  }

  static findPropertyOwner(propertyId) {
    const propertyFound = property.filter(match => match.propertyId === propertyId);
    if (Object.keys(propertyFound).length !== 0) {
      return this.findUser('userId', propertyFound[0].owner);
    }
    return null;
  }

  static hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static generateToken(user) {
    const payload = {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      type: user.type,
    };
    const token = jwt.sign({ payload }, config.secret, { expiresIn: 86400 });
    return token;
  }
}
