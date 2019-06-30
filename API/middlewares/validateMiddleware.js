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
    req.checkBody('firstName').isAlpha().withMessage('First name should only contain alphabets');
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');
    req.checkBody('email').isEmail().withMessage('Email is invalid');
    req.checkBody('password').isLength({ min: 6 }).withMessage('Password should be atleast 6 characters');
    req.checkBody('type').exists().withMessage('Specify user type')
      .isIn(['user', 'agent', 'admin'])
      .withMessage('Choose a valid user type');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static propertyListingCheck(req, res, next) {
    req.checkBody('status').exists()
      .withMessage('Specify property status')
      .isIn(['For Rent ', 'For Sale'])
      .withMessage('Select the property status [For Sale or For Rent]');
    req.checkBody('address').exists().withMessage('Provide address of your property')
      .isLength({ min: 5 })
      .withMessage('Address should contain more than 4 characters');
    req.checkBody('type').exists().withMessage('Select type of property')
      .isIn(['Residential', 'Flat', 'Luxury', 'Rental', 'Commercial', 'Office Space', 'Garage', 'Apartment', 'Boys Quarter', 'Duplex', 'TownHouse'])
      .withMessage('Select the appropritate property type');
    req.checkBody('rooms').exists().withMessage('Select number of rooms').isDecimal()
      .withMessage('Number of rooms should be numeric');
    req.checkBody('baths').exists().withMessage('Select number of baths').isInt()
      .withMessage('Number of baths should be numberic');
    req.checkBody('price').exists().withMessage('Provide price information');
    req.checkBody('price').isDecimal().withMessage('Price should be in decimal');
    req.checkBody('image_url').exists().withMessage('Provide image link')
      .isURL()
      .withMessage('Provide a valid url link');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static listingUpdateCheck(req, res, next) {
    req.checkBody('status').isIn(['For Rent ', 'For Sale', 'Sold']).withMessage('Select the property sstatus [For Sale or For Rent]')
      .exists()
      .withMessage('Specify property status');

    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }

  static listingEditCheck(req, res, next) {
    req.checkBody('status').isIn(['For Rent ', 'For Sale']).withMessage('Select the property sstatus [For Sale or For Rent]')
      .optional()
      .withMessage('Specify property status');
    req.checkBody('address').optional().withMessage('Provide address of your property')
      .isLength({ min: 5 })
      .withMessage('Address should contain more than 4 characters');
    req.checkBody('type').isIn(['Residential', 'Flat', 'Luxury', 'Rental', 'Commercial', 'Office Space', 'Garage', 'Apartment', 'Boys Quarter', 'Duplex', 'TownHouse'])
      .optional().withMessage('Select the appropritate property type');
    req.checkBody('rooms').optional().isDecimal().withMessage('Number of rooms should be numeric');
    req.checkBody('baths').optional().isDecimal().withMessage('Number of baths should be numberic');
    req.checkBody('price').optional().withMessage().withMessage('Provide price information')
      .optional()
      .isDecimal()
      .withMessage('Price should be in decimal');
    req.checkBody('image_url').isURL().optional().withMessage('Provide a valid url link');


    const errors = req.validationErrors();
    if (errors) {
      const err = authMiddleware.validationError(errors);
      return authMiddleware.errorResponse(res, 400, err);
    }
    next();
  }
}
