import jwt from 'jsonwebtoken';
import * as config from '../config';

export default class AuthMiddleware {
  static errorResponse(res, statusCode, error) {
    return res.status(statusCode).json({
      status: 'fail',
      error: error[0],
    });
  }

  static successResponse(res, statusCode, success) {
    return res.status(statusCode).json({
      status: 'success',
      data: success,
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
        status: 'fail',
        error: 'Unathorized. Token not found',
      });
    }

    const decoded = jwt.decode(req.headers.authorization, { secret: config.secret });
    if (!decoded) {
      return res.status(403).json({
        status: 'fail',
        error: 'Unathorized. Token invalid. Please login',
      });
    }
    req.data = {
      type: decoded.user.type,
      userId: decoded.user.userId,
      firstName: decoded.user.firstName,
      lastName: decoded.user.lastName,
    //   decoded
    };
    next();
  }
}
