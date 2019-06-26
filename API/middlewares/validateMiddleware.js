import authMiddleware from './authMiddleware';

export default class ValidateMiddleware {
  static loginCheck(req, res, next) {
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
    req.checkBody('email').isEmail().withMessage('Email is invalid');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static signupCheck(req, res, next) {
    req.checkBody('firstName').isLength({ min: 1 }).withMessage('First name is required');
    req.checkBody('lastName').isLength({ min: 1 }).withMessage('Last name is required');
    req.checkBody('firstName').isLength({ min: 3 }).withMessage('First name should contain more than 2 characters');
    req.checkBody('firstName').isAlpha().withMessage('First name should only contain alphabets')
      .exists()
      .withMessage('Please enter your first name');
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');
    req.checkBody('email').isEmail().withMessage('Email is invalid');
    // req.checkBody('password').isAlphaNumeric().withMessage('Password should be alphanumeric')
    req.checkBody('password').exists().withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password should be atleast 6 characters');
    req.checkBody('type').isIn(['user', 'agent', 'admin']).withMessage('Choose a valid user type')
      .exists()
      .withMessage('Specify user type');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }
}
