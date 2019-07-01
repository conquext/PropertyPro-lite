import jwt from 'jsonwebtoken';
import * as config from '../config';

export default class AuthMiddleware {
  static errorResponse(res, statusCode, error) {
    return res.status(statusCode).json({
      status: 'false',
      error: error[0],
    });
  }

  static validationError(errors) {
    const err = errors.map(error => error.msg);
    return err;
  }

  static authenticateUser(req, res, next) {
    const currentToken = req.headers.authorization;
    if (!currentToken) {
      return res.status(403).json({
        status: 'false',
        error: 'Unathorized. Token not found',
      });
    }

    const decoded = jwt.decode(req.headers.authorization, { secret: config.secret });
    if (!decoded) {
      return res.status(403).json({
        status: 'false',
        error: 'Unathorized. Token invalid. Please login',
      });
    }
    req.data = {
      type: decoded.payload.type,
      userId: decoded.payload.userId,
    };

    next();
  }
}
