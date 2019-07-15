import jwt from 'jsonwebtoken';
import { debug } from 'util';
import * as config from '../config';

export default class AuthMiddleware {
  static errorResponse(res, statusCode, error) {
    return res.status(statusCode).json({
      status: 'error',
      error: error[0],
    });
  }

  static validationError(errors) {
    const err = errors.map(error => error.msg);
    return err;
  }

  static authenticateUser(req, res, next) {
    let currentToken = req.headers.authorization || req.headers.token || req.body.token;
    if (!currentToken) {
      return res.status(403).json({
        status: 'error',
        error: 'Unathorized. Token not found',
      });
    }

    currentToken = currentToken.replace('Bearer ', '');
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
