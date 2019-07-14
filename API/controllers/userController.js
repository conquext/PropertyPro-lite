/* eslint-disable camelcase */
import User from '../models/user';
import UserHelper from '../helpers/userHelper';
import { users } from '../db/db';

export default class UserController {
  /**
   * @description Logins a registered user
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {UserController} A logged-in user
   * @memberof UserController
   */
  static signin(req, res) {
    try {
      const { email, password } = req.body;
      const userFound = UserHelper.findUserByEmail(email);
      if (!userFound) {
        return res.status(401).json({
          status: 'error',
          error: 'Incorrect email',
        });
      }
      if (!UserHelper.comparePassword(password, userFound.password)) {
        return res.status(401).json({
          status: 'error',
          error: 'Incorrect email or Wrong password',
        });
      }
      const jwtToken = UserHelper.generateToken(userFound);
      userFound.token = jwtToken;
      userFound.lastLoggedInAt = new Date();
      userFound.loggedIn = true;
      const loginData = {
        token: userFound.token,
        id: userFound.id,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        email: userFound.email,
        type: userFound.type,
      };

      return res.status(200).json({
        status: 'success',
        token: loginData.token,
        data: loginData,
      });
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }

  /**
   * @description Register a new user
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {UserController} A new user
   * @memberof UserController
   */
  static signup(req, res) {
    try {
      const {
        first_name, last_name, email, phoneNumber, address, type, password, confirm_password,
      } = req.body;
      const registeredUser = UserHelper.findUserByEmail(email);
      if (registeredUser) {
        return res.status(409).json({
          status: 'error',
          error: 'User already exists',
        });
      }
      // if (password !== confirm_password) {
      //   return res.status(400).json({
      //     status: 'error',
      //     error: 'Passwords must match',
      //   });
      // }
      const newId = users[users.length - 1].id + 1;
      // @ts-ignore
      const newUser = new User({
        id: newId, first_name, last_name, email, phoneNumber, address, type,
      });

      newUser.password = UserHelper.hashPassword(req.body.password);
      const jwtToken = UserHelper.generateToken(newUser);
      newUser.token = jwtToken;
      newUser.logIn();
      users.push(newUser);

      const signupData = {
        token: newUser.token,
        id: newId,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        type: newUser.type,
        is_admin: newUser.is_admin,
      };

      return res.status(201).json({
        status: 'success',
        message: 'User is registered successfully',
        token: signupData.token,
        data: signupData,
      });
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }
}
