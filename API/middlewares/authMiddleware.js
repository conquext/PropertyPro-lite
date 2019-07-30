import jwt from 'jsonwebtoken';
import * as config from '../config';
import UserHelper from '../helpers/userHelper';

export default class AuthMiddleware {
  static errorResponse(res, statusCode, error) {
    return res.status(statusCode).json({
      status: 'error',
      error: error[0],
    });
  }

  static successResponse(res, statusCode, data) {
    return res.status(statusCode).json({
      status: 'success',
      message: data[0],
    });
  }

  static validationError(errors) {
    const err = errors.map(error => error.msg);
    return err;
  }

  static async sessionActive(req) {
    let currentToken = req.cookies.token || req.body.token || req.headers.token || req.headers.authorization;

    // this approach is stateful. Checks database for user and return user
    if (currentToken) {
      currentToken = currentToken.replace('Bearer ', '');
      const userFound = await UserHelper.findDbUserByTokenLogin(currentToken);
      if (userFound && Object.keys(userFound).length > 0) {
        const decoded = jwt.decode(currentToken, { secret: config.secret });
        if (decoded) {
          return userFound;
        }
      }
    }

    // this approach is stateless, checks token for validity and return decoded token object
    // if (currentToken) {
    //   currentToken = currentToken.replace('Bearer ', '');
    //   const tokenFound = await UserHelper.findDbLogin('token', currentToken);
    //   if (tokenFound && Object.keys(tokenFound).length > 0) {
    //     const decoded = jwt.decode(currentToken, { secret: config.secret });
    //     if (decoded) {
    //       const returnUser = {
    //         id: decoded.payload.id || '',
    //         first_name: decoded.payload.first_name || '',
    //         last_name: decoded.payload.last_name || '',
    //         address: decoded.payload.address || '',
    //         type: decoded.payload.type || '',
    //         email: decoded.payload.email || '',
    //         phoneNumber: decoded.payload.phoneNumber || '',
    //         dob: decoded.payload.dob || '',
    //         country: decoded.payload.country || '',
    //       };
    //       return returnUser;
    //     }
    //   }
    // }
    // return null;
  }

  static async authenticateUser(req, res, next) {
    const inSession = await AuthMiddleware.sessionActive(req);
    if (!inSession) {
      return AuthMiddleware.errorResponse(res, 403, ['Unauthorized. Please login']);
    }

    req.data = {
      id: inSession.id || '',
      first_name: inSession.first_name || '',
      last_name: inSession.last_name || '',
      address: inSession.address || '',
      type: inSession.type || '',
      email: inSession.email || '',
      phoneNumber: inSession.phoneNumber || '',
      dob: inSession.dob || '',
      country: inSession.country || '',
    };

    next();
  }
}
