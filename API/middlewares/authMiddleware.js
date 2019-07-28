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

  static async authenticateUser(req, res, next) {
    let currentToken = req.headers.authorization || req.headers.token || req.body.token;
    let tokenFound = null;

    if (!currentToken) {
      return res.status(403).json({
        status: 'error',
        error: 'Unathorized. Token not found',
      });
    }

    currentToken = currentToken.replace('Bearer ', '');
    tokenFound = await UserHelper.findDbLogin('token', currentToken);

    if (tokenFound === null) {
      return res.status(403).json({
        status: 'error',
        error: 'Unathorized. Token invalid. Please login',
      });
    }

    if (Object.keys(tokenFound).length === 0) {
      return res.status(403).json({
        status: 'error',
        error: 'Unathorized. Token invalid. Please login',
      });
    }
    const decoded = jwt.decode(currentToken, { secret: config.secret });
    if (!decoded) {
      return res.status(403).json({
        status: 'error',
        error: 'Unathorized. Token invalid. Please login',
      });
    }
    req.data = {
      id: decoded.payload.id || '',
      first_name: decoded.payload.first_name || '',
      last_name: decoded.payload.last_name || '',
      address: decoded.payload.address || '',
      type: decoded.payload.type || '',
      email: decoded.payload.email || '',
      phoneNumber: decoded.payload.phoneNumber || '',
      dob: decoded.payload.dob || '',
      country: decoded.payload.country || '',
    };

    next();
  }
}
