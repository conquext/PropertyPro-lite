import authMiddleware from './authMiddleware';

export default class ValidateMiddleware {
  static methodNotAllowed(req, res) {
    const err = ['Method Not Allowed'];
    return authMiddleware.errorResponse(res, 405, err);
  }

  static pageNotFound(req, res) {
    const err = ['Page Not Found'];
    return authMiddleware.errorResponse(res, 404, err);
  }

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
    req.checkBody('first_name').isLength({ min: 1 }).withMessage('First name is required');
    req.checkBody('last_name').isLength({ min: 1 }).withMessage('Last name is required');
    req.checkBody('first_name').isLength({ min: 3 }).withMessage('First name should contain more than 2 characters');
    req.checkBody('first_name').isAlpha().withMessage('First name should only contain alphabets');
    req.checkBody('email').isLength({ min: 1 }).withMessage('Email is required');
    req.checkBody('password').isLength({ min: 1 }).withMessage('Password is required');
    req.checkBody('email').isEmail().withMessage('Email is invalid');
    req.checkBody('password').isLength({ min: 2 }).withMessage('Password should be atleast 2 characters');
    req.checkBody('phoneNumber').isLength({ min: 3 }).withMessage('Password should be atleast 3 characters');
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
      .isIn(['For Rent', 'For Sale'])
      .withMessage('Select the property status [For Sale or For Rent]');
    req.checkBody('address').exists().withMessage('Provide address of your property')
      .isLength({ min: 3 })
      .withMessage('Address should contain more than 3 characters');
    req.checkBody('city').exists().withMessage('Provide city of your property location');
    req.checkBody('state').exists().withMessage('Provide state of your property location');
    req.checkBody('type').exists().withMessage('Select type of property')
      .isIn(['Residential', 'Flat', 'Luxury', 'Rental', 'Commercial', 'Office Space', 'Garage', 'Apartment', 'Boys Quarter', 'Duplex', 'TownHouse'])
      .withMessage('Select the appropritate property type');
    req.checkBody('rooms').exists().withMessage('Select number of rooms').isDecimal()
      .withMessage('Number of rooms should be numeric');
    req.checkBody('baths').exists().withMessage('Select number of baths').isInt()
      .withMessage('Number of baths should be numeric');
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

  static listingEditCheck(req, res, next) {
    req.checkBody('status').optional().withMessage('Specify property status')
      .isIn(['For Rent', 'For Sale'])
      .withMessage('Select the property status [For Sale or For Rent]');
    req.checkBody('address').optional().withMessage('Provide address of your property')
      .isLength({ min: 5 })
      .withMessage('Address should contain more than 4 characters');
    req.checkBody('type').isIn(['Residential', 'Flat', 'Luxury', 'Rental', 'Commercial', 'Office Space', 'Garage', 'Apartment', 'Boys Quarter', 'Duplex', 'TownHouse'])
      .optional().withMessage('Select the appropritate property type');
    req.checkBody('rooms').optional().isDecimal().withMessage('Number of rooms should be numeric');
    req.checkBody('baths').optional().isDecimal().withMessage('Number of baths should be numeric');
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
