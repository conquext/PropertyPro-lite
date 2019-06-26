import { Router } from 'express';
import userController from '../controllers/userController';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const { login, signup } = userController;
const { loginCheck, signupCheck } = validateMiddleware;

router.post('/login', loginCheck, login);
router.post('/signup', signupCheck, signup);

export default router;
