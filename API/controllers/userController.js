import User from '../models/user';
import UserHelper from '../helpers/userHelper';
import { users } from '../db/db';

export default class UserController {
  static login(req, res) {
    try {
      const { email, password } = req.body;
      const userFound = UserHelper.findUserByEmail(email);
      if (!userFound) {
        return res.status(401).json({
          status: 'fail',
          error: 'Incorrect email',
        });
      }
      if (!UserHelper.comparePassword(password, userFound.password)) {
        return res.status(401).json({
          status: 'fail',
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
      return res.status(500).json({
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  static signup(req, res) {
    try {
      const {
        firstName, lastName, email, password, phoneNumber, address, type,
      } = req.body;
      const registeredUser = UserHelper.findUserByEmail(email);
      if (registeredUser) {
        return res.status(409).json({
          success: 'false',
          error: 'User already exists',
        });
      }
      const newUserId = users[users.length - 1].userId + 1;
      const newUser = new User({
        userId: newUserId, firstName, lastName, email, phoneNumber, address, type,
      });

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
      res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }
}
