import { Router } from 'express';
import authRouter from './authRouter';
import propertyRouter from './propertyRouter';

const router = Router();

router.use('/auth', authRouter);
router.use('/property', propertyRouter);

export default router;
