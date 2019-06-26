import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../db/db';
import * as config from '../config';

export default class UserHelper {
  static findUser(field, value) {
    // eslint-disable-next-line no-restricted-syntax
    for (const user of users) {
      if (user[field] === value) {
        return user;
      }
    }
    return null;
  }

  static findUserById(userId) {
    return this.findUser('userId', userId);
  }

  static findUserByEmail(email) {
    return this.findUser('email', email);
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
    };
    const token = jwt.sign({ payload }, config.secret, { expiresIn: 86400 });
    return token;
  }
}
