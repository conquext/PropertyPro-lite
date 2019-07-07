import { Router } from 'express';
import userController from '../controllers/userController';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const { login, signup } = userController;
const { loginCheck, signupCheck } = validateMiddleware;


/**
* @swagger
* /auth/login:
*   post:
*    tags:
*     - Users
*    name: Login
*    summary: Logs in a user
*    consumes:
*     - application/json
*    produces:
*     - application/json
*    parameters:
*       - in: body
*         name: body
*         description: User
*         required: true
*         schema:
*          type: object
*          properties:
*           email:
*            type: string
*            format: email
*           password:
*            type: string
*            format: password
*           required:
*            email
*            password
*    responses:
*      200:
*       description: User found and logged in successfully
*       schema:
*         type: object
*         $ref: '#/definitions/User'
*      400:
*       description: Bad request
*      401:
*       description: User not found
*      403:
*       description: Username and password don't match
*      500:
*       description: Something went wrong. Try again
*/
router.post('/login', loginCheck, login);

/**
* @swagger
* /auth/signup:
*   post:
*     tags:
*       - Users
*     name: signin
*     summary: Signs up a new user
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         name: body
*         description: User
*         required: true
*         schema:
*          type: object
*          properties:
*            first_name:
*             type: string
*            last_name:
*             type: string
*            email:
*              type: string
*              format: email
*            password:
*              type: string
*              format: password
*            confirm_password:
*              type: string
*              format: password
*            phone_number:
*              type: string
*              format: tel
*            address:
*              type: string
*              format: address
*            state:
*              type: string
*            country:
*              type: string
*            dob:
*              type: string
*              format: date
*            type:
*              type: string
*            required:
*              first_name
*              last_name
*              email
*              password
*              confirm_password
*              phone_number
*     responses:
*       201:
*         description: User signed up successfully
*         schema:
*           $ref: '#/definitions/User'
*           type: object
*       400:
*         description: Bad request
*       403:
*         description: Username and password don't match
*       500:
*         description: Something went wrong. Try again
*/
router.post('/signup', signupCheck, signup);

export default router;
