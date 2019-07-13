import jwt from 'jsonwebtoken';
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
    const currentToken = req.headers.authorization || req.body.token;
    if (!currentToken) {
      return res.status(403).json({
        status: 'error',
        error: 'Unathorized. Token not found',
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
      id: decoded.payload.id,
      address: decoded.payload.address,
      type: decoded.payload.type,
      email: decoded.payload.email,
      phoneNumber: decoded.payload.phoneNumber,
      dob: decoded.payload.dob,
      country: decoded.payload.country,
    };

    next();
  }
}
