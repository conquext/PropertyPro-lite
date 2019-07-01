import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import propertyController from '../controllers/propertyController';
import permissionMiddleware from '../middlewares/permissionMiddleware';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const {
  listNewProperty, getAllProperty, getProperty, editProperty, updateProperty, deleteProperty,
} = propertyController;

const { authAgent, authPropertyOwner } = permissionMiddleware;
const { propertyListingCheck, listingEditCheck } = validateMiddleware;
const { authenticateUser } = authMiddleware;

router.use(authenticateUser);

router.post('', authAgent, propertyListingCheck, listNewProperty);
router.get('/', getAllProperty);
router.get('/:propertyId', getProperty);
router.patch('/:propertyId', authPropertyOwner, listingEditCheck, editProperty);
router.patch('/:propertyId/sold', authPropertyOwner, updateProperty);
router.delete('/:propertyId', authPropertyOwner, deleteProperty);

export default router;
