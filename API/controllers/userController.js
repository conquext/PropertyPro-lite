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
  static login(req, res) {
    try {
      const { email, password } = req.body;
      const userFound = UserHelper.findUserByEmail(email);
      if (!userFound) {
        return res.status(401).json({
          status: 'false',
          error: 'Incorrect email',
        });
      }
      if (!UserHelper.comparePassword(password, userFound.password)) {
        return res.status(401).json({
          status: 'false',
          error: 'Incorrect email or Wrong password',
        });
      }
      const jwtToken = UserHelper.generateToken(userFound);
      userFound.token = jwtToken;
      userFound.lastLoggedInAt = new Date();
      userFound.loggedIn = true;
      const loginData = {
        token: userFound.token,
        id: userFound.userId,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email,
        type: userFound.type,
      };

      return res.status(200).json({
        status: 'success',
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
        firstName, lastName, email, phoneNumber, address, type, password, confirmPassword,
      } = req.body;
      const registeredUser = UserHelper.findUserByEmail(email);
      if (registeredUser) {
        return res.status(409).json({
          status: 'false',
          error: 'User already exists',
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          status: 'false',
          error: 'Passwords must match',
        });
      }
      const newUserId = users[users.length - 1].userId + 1;
      const newUser = new User({
        userId: newUserId, firstName, lastName, email, phoneNumber, address, type,
      });

      newUser.password = UserHelper.hashPassword(req.body.password);
      const jwtToken = UserHelper.generateToken(newUser);
      newUser.token = jwtToken;
      newUser.logIn();
      users.push(newUser);

      const signupData = {
        token: newUser.token,
        id: newUserId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        type: newUser.type,
        isAdmin: newUser.isAdmin,
      };

      return res.status(201).json({
        success: 'true',
        message: 'User is registered successfully',
        data: signupData,
      });
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }
}
