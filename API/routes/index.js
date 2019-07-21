import { Router } from 'express';
import authRouter from './authRouter';
import propertyRouter from './propertyRouter';
import validateMiddleware from '../middlewares/validateMiddleware';


const router = Router();

const { methodNotAllowed, pageNotFound } = validateMiddleware;

router.use('/auth', authRouter);
router.use('/property', propertyRouter);

export default router;
