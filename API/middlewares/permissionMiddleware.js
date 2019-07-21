import UserHelper from '../helpers/userHelper';

export default class PermissionsMiddleware {
  static authAgent(req, res, next) {
    if (req.data.type !== 'admin') {
      if (req.data.type !== 'agent') {
        return res.status(403).json({
          status: 'error',
          error: 'Unauthorized',
        });
      }
    }
    next();
  }

  static async authPropertyOwner(req, res, next) {
    const userId = req.data.id;
    const { id } = req.params || req.query;
    const propertyOwner = await UserHelper.findDbPropertyOwner(parseInt(id, 10));
    if (req.data.type !== 'admin') {
      if (propertyOwner) {
        if (parseInt(userId, 10) !== parseInt(propertyOwner.id, 10)) {
          return res.status(403).json({
            status: 'error',
            error: 'Unauthorized',
          });
        }
      }
    }
    next();
  }
}
