/* eslint-disable camelcase */
import moment from 'moment';
import crypto from 'crypto';
import { config } from 'dotenv';
import User from '../models/user';
import UserHelper from '../helpers/userHelper';
import authMiddleware from '../middlewares/authMiddleware';
import { tableName } from '../db/config';

config();
const { errorResponse, successResponse } = authMiddleware;

export default class UserController {
  /**
   * @description Logins a registered user
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {UserController} A logged-in user
   * @memberof UserController
   */
  static async signin(req, res) {
    try {
      const { email, password } = req.body;
      const userFound = await UserHelper.findDbUserByEmailLogin(email);
      if (!userFound) {
        return errorResponse(res, 401, ['Incorrect email or Wrong password']);
      }
      if (!UserHelper.compareWithHash(password, userFound.password)) {
        return errorResponse(res, 401, ['Incorrect email or Wrong password']);
      }
      const jwtToken = await UserHelper.generateToken(userFound);
      userFound.token = jwtToken;
      userFound.last_login = new Date();
      userFound.logged_in = true;

      const loginData = {
        token: userFound.token,
        id: userFound.id,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        email: userFound.email,
        type: userFound.type,
      };

      const loginDbData = {
        token: userFound.token,
        logged_in: userFound.logged_in,
        last_login: new Date(),
      };

      try {
        await UserHelper.updateDb(tableName.LOGIN, loginDbData, 'email', userFound.email);
      } catch (error) {
        return errorResponse(res, 400, [error]);
      }

      return res.status(200).json({
        status: 'success',
        token: loginData.token,
        data: loginData,
      });
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /**
   * @description Register a new user
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {UserController} A new user
   * @memberof UserController
   */
  static async signup(req, res) {
    try {
      const {
        first_name, last_name, email, phoneNumber, dob, address, type = 'user', password,
      } = req.body;
      const registeredUser = await UserHelper.findDbUserByEmail(email); // Check if email exists in database
      if (registeredUser) {
        return errorResponse(res, 409, ['User already exists']);
      }
      const phoneNumberExist = await UserHelper.findDbUser('phonenumber', phoneNumber); // Check if number exists in database

      if (phoneNumberExist) {
        return errorResponse(res, 409, ['Phone Number already exists']);
      }
      // if (password !== confirm_password) {
      // return errorResponse(res, 409, ['Passwords must match']);
      // }
      // @ts-ignore
      const newUser = new User({
        first_name, last_name, email, phoneNumber, address, type, dob,
      });

      newUser.password = await UserHelper.hashPassword(password);

      const signupDbData = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        type: newUser.type,
        is_admin: newUser.is_admin,
        address: newUser.address || 'Not Available',
        phoneNumber: newUser.phoneNumber,
        dob: newUser.dob || new Date(),
        state: newUser.state || 'Not Available',
        country: newUser.country || 'Not Available',
      };

      try {
        const newlyRegUser = await UserHelper.insertDb(tableName.USERS, signupDbData); // Insert new users details in db
        newUser.token = await UserHelper.generateToken(newlyRegUser);
        newUser.logged_in = true;

        const loginDbData = {
          token: newUser.token,
          email: newUser.email,
          password: newUser.password,
          logged_in: newUser.logged_in || false,
          last_login: new Date(),
        };

        await UserHelper.insertDb(tableName.LOGIN, loginDbData); // Insert new login details in login

        const signupData = {
          token: newUser.token,
          id: newlyRegUser.id,
          first_name: newlyRegUser.first_name,
          last_name: newlyRegUser.last_name,
          email: newlyRegUser.email,
          type: newlyRegUser.type,
          is_admin: newlyRegUser.is_admin,
          phoneNumber: newlyRegUser.phoneNumber,
        };

        return res.status(201).json({
          status: 'success',
          message: 'User is registered successfully',
          token: signupData.token,
          data: signupData,
        });
      } catch (error) {
        return errorResponse(res, 400, [error]);
      }
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /**
   * @description Generate link to reset a user password
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {UserController} A reset link for new password
   * @memberof UserController
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const userFound = await UserHelper.findDbUserByEmailLogin(email); // Does this user exist in login database?
      if (!userFound) {
        return errorResponse(res, 404, ['User Not Found']);
      }
      const resetToken = await crypto.randomBytes(32).toString('hex'); // Generate reset token if user exist
      const resetTokenHash = await UserHelper.hashPassword(resetToken); // Hash the reset token to be stored
      const forgotPasswordData = {
        user_id: userFound.id,
        email: userFound.email,
        resetToken: resetTokenHash,
        created_on: new Date(),
        expire_time: moment.utc().add(process.env.TOKENEXPIRY, 'seconds'),
      };
      await UserHelper.deleteDb(tableName.FORGOTPASSWORD, 'email', userFound.email); // Delete any exist reset in database
      const item = UserHelper.insertDb(tableName.FORGOTPASSWORD, forgotPasswordData); // Insert new reset token in database
      if (!item) {
        return (errorResponse(res, 400, ['Oops problem in generating password reset link']));
      }

      await UserHelper.sendMail(userFound, resetToken); // Send reset link to user email

      return res.status(200).json({
        success: true,
        message: 'Check your mail to reset your password',
      });
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /**
   * @description Resets a user password
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {UserController} A new password record
   * @memberof UserController
   */
  static async resetPassword(req, res) {
    try {
      const { id, resetToken } = req.params;
      const { password } = req.body;
      const thisUserResetDetail = await UserHelper.findOne(tableName.FORGOTPASSWORD, 'user_id', id); // Check database for a reset request

      if (thisUserResetDetail) {
        const expireTime = moment.utc(thisUserResetDetail.expire); // Check if reset token is not expired
        if (moment().isAfter(expireTime) && UserHelper.compareWithHash(resetToken, thisUserResetDetail.resettoken)) {
          const newPassword = await UserHelper.hashPassword(password);
          const loginDbData = {
            token: '',
            password: newPassword,
            logged_in: false,
            last_login: new Date(),
          };
          await UserHelper.updateDb(tableName.LOGIN, loginDbData, 'email', thisUserResetDetail.email); // Update password for login
          await UserHelper.deleteDb(tableName.FORGOTPASSWORD, 'email', thisUserResetDetail.email); // Delete reset request from database
          return successResponse(res, 200, ['Password Updated successfully']);
        }
      }
      return errorResponse(res, 400, ['Invalid or expired reset token']);
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }
}
