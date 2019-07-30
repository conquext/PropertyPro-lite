import { Router } from 'express';
import userController from '../controllers/userController';
import validateMiddleware from '../middlewares/validateMiddleware';

const router = Router();

const { signin, signout, signup, forgotPassword, resetPassword } = userController;
const { loginCheck, signupCheck, forgetPasswordCheck, resetPasswordCheck } = validateMiddleware;


/**
* @swagger
* /auth/signin:
*   post:
*    tags:
*     - Users
*    name: Signin
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
router.post('/signin', loginCheck, signin);

/**
* @swagger
* /auth/signout:
*   post:
*    tags:
*     - Users
*    name: Signout
*    summary: Signs out a user
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
router.post('/signout', signout);

/**
* @swagger
* /auth/signup:
*   post:
*     tags:
*       - Users
*     name: signup
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
*            phoneNumber:
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
*              type
*              phoneNumber
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

/**
* @swagger
* /auth/forgotpassword:
*   post:
*     tags:
*       - Users
*     name: Request Password Reset
*     summary: Generate link to reset password for a registered user
*     consumes:
*       - application/json
*     produces:
*       - application/html
*     parameters:
*       - in: body
*         name: body
*         description: User Email
*         required: true
*         schema:
*          type: object
*          properties:
*            email:
*              type: string
*              format: email
*            required:
*              email
*     responses:
*       200:
*         description: Check your mail to reset your password.
*       400:
*         description: Bad request
*       500:
*         description: Something went wrong. Try again
*/
router.post('/forgotpassword', forgetPasswordCheck, forgotPassword);

/**
* @swagger
* /auth/resetpassword/{id}/{resetToken}:
*   post:
*    tags:
*     - Users
*    name: Reset Password
*    summary: Reset a user password
*    consumes:
*     - application/json
*    produces:
*     - application/json
*    parameters:
*      - in: path
*        name: id
*        required: true
*        type: string
*      - in: path
*        name: resetToken
*        required: true
*        type: string
*      - in: body
*        name: body
*        description: User
*        required: true
*        schema:
*          type: object
*          properties:
*           password:
*            type: string
*            format: password
*           confirm_password:
*            type: string
*            format: password
*           required:
*            password
*            confirm_password
*    responses:
*      200:
*       description: Password Reset successfully
*      400:
*       description: Bad request
*      500:
*       description: Something went wrong. Try again
*/
// router.use('/resetpassword', resetPasswordCheck, resetPassword);
router.post('/resetpassword/:id/:resetToken', resetPasswordCheck, resetPassword);


export default router;
