import UserHelper from '../helpers/userHelper';

export default class PermissionsMiddleware {
  static authUser(req, res, next) {
    if (req.data.type !== 'user') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authAgent(req, res, next) {
    if (req.data.type !== 'agent') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authAdmin(req, res, next) {
    if (req.data.type !== 'admin') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authPropertyOwner(req, res, next) {
    const { userId } = req.data;
    const { propertyId } = req.params || req.query;

    const propertyOwner = UserHelper.findPropertyOwner(parseInt(propertyId, 10));

    if (propertyOwner) {
      if (parseInt(userId, 10) !== parseInt(propertyOwner.userId, 10)) {
        return res.status(403).json({
          status: 403,
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }
    next();
  }

  static authPropertyOwnerOrAdmin(req, res, next) {
    const { type, userId } = req.data;
    const { propertyId } = req.params || req.query;

    const propertyOwner = UserHelper.findPropertyOwner(parseInt(propertyId, 10));

    if (type !== 'admin') {
      if (parseInt(userId, 10) !== parseInt(propertyOwner.userId, 10)) {
        return res.status(403).json({
          status: 403,
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }
    next();
  }
}
