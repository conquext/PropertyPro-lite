/* eslint-disable camelcase */
import User from '../models/user';
import UserHelper from '../helpers/userHelper';

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
        return res.status(401).json({
          status: 'error',
          error: 'Incorrect email or Wrong password',
        });
      }
      if (!UserHelper.comparePassword(password, userFound.password)) {
        return res.status(401).json({
          status: 'error',
          error: 'Incorrect email or Wrong password',
        });
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
        await UserHelper.updateDb('login', loginDbData, 'email', userFound.email);
      } catch (error) {
        // throw new Error('Something went wrong. Try again.');
      }

      return res.status(200).json({
        status: 'success',
        token: loginData.token,
        data: loginData,
      });
    } catch (error) {
      throw new Error(`Something went wrong. Try again. ${error}`);
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
      const registeredUser = await UserHelper.findDbUserByEmail(email);
      if (registeredUser) {
        return res.status(409).json({
          status: 'error',
          error: 'User already exists',
        });
      }
      const phoneNumberExist = await UserHelper.findDbUser('phonenumber', phoneNumber);

      if (phoneNumberExist) {
        return res.status(409).json({
          status: 'error',
          error: 'Phone Number already exists',
        });
      }
      // if (password !== confirm_password) {
      //   return res.status(400).json({
      //     status: 'error',
      //     error: 'Passwords must match',
      //   });
      // }
      // @ts-ignore
      const newUser = new User({
        first_name, last_name, email, phoneNumber, address, type, dob,
      });

      newUser.password = await UserHelper.hashPassword(password);

      // users.push(newUser);

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
        const newlyRegUser = await UserHelper.insertDb('users', signupDbData);
        newUser.token = await UserHelper.generateToken(newlyRegUser);
        newUser.logged_in = true;

        const loginDbData = {
          token: newUser.token,
          email: newUser.email,
          password: newUser.password,
          logged_in: newUser.logged_in || false,
          last_login: new Date(),
        };

        await UserHelper.insertDb('login', loginDbData);

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
        // throw new Error('Something went wrong. Try again.');
      }
    } catch (error) {
      throw new Error(`Something went wrong. Try again. ${error}`);
    }
  }
}
