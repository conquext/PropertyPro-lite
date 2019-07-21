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

/**
 * @swagger
 * /property:
 *    post:
 *      summary: Add more property
 *      description: Create a new property listing
 *      tags:
 *        - Property
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        description: Property details
 *        required: true
 *        properties:
 *         status:
 *          type: string
 *          format: ['For Sale', 'For Rent']
 *         type:
 *          type: string
 *         address:
 *          type: string
 *          format: address
 *         rooms:
 *          type: number
 *         baths:
 *          type: number
 *         price:
 *          type: number
 *         image_url:
 *          type: string
 *          format: url
 *         ownerEmail:
 *          type: string
 *          format: email
 *         ownerPhoneNumber:
 *          type: string
 *          format: string
 *      security:
 *        - bearerAuth: []
 *          type: apikey
 *      responses:
 *       201:
 *        description: New Property listed successfully
 *        schema:
 *         type: object
 *         $ref: '#/definitions/property'
 *       403:
 *        description: Unathorized
 *       400:
 *        description: Bad request
 *       500:
 *        description: Something went wrong try again
 *
 */
router.post('', authAgent, propertyListingCheck, listNewProperty);
// router.post('', authAgent, listNewProperty);

/**
 * @swagger
 * /property:
 *    get:
 *      description: Return all property listings
 *      summary: Find properties
 *      produces:
 *        application/json
 *      tags:
 *        - Property
 *      security:
 *       - bearerAuth: []
 *         type: apikey
 *      responses:
 *        200:
 *          description: Properties retrieved successfully
 *          schema:
 *            $ref: '#/definitions/Property'
 *        400:
 *          description: Bad request
 *        404:
 *          description: Property not found
 *        500:
 *          description: Something went wrong try again
 *
 */
router.get('', getAllProperty);

/**
 * @swagger
 * /property/{id}:
 *    get:
 *      description: Return a specific property listing
 *      summary: Find a property
 *      produces:
 *        application/json
 *      tags:
 *        - Property
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          type: string
 *        - in: query
 *          name: status
 *          description: search by property status
 *          required: false
 *          type: string
 *          items:
 *           type: string
 *        - in: query
 *          name: type
 *          description: search query
 *          required: false
 *          type: string
 *          items:
 *           type: string
 *        - in: query
 *          name: baths
 *          description: search by baths
 *          required: false
 *          type: string
 *          items:
 *           type: string
 *        - in: query
 *          name: rooms
 *          description: search by rooms
 *          required: false
 *          type: array
 *          items:
 *           type: string
 *      security:
 *       - bearerAuth: []
 *         type: apikey
 *      responses:
 *        200:
 *          description: Property retrieved successfully
 *          schema:
 *            $ref: '#/definitions/Property'
 *        404:
 *          description: Property not found
 *        400:
 *          description: Bad request
 *        500:
 *          description: Something went wrong try again
 */

router.get('/:id', getProperty);

/**
 * @swagger
 * /property/{id}:
 *    patch:
 *      description: Edit a property listing
 *      summary: Edit property listing
 *      produces:
 *        application/json
 *      tags:
 *        - Property
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          type: string
 *        - in: body
 *          name: body
 *          required: true
 *          description: Edit listing details
 *          schema:
 *            type: object
 *            $ref: '#/definitions/Property'
 *      security:
 *        - bearerAuth: []
 *          type: apikey
 *      responses:
 *        200:
 *          description: Property updated successfully
 *          schema:
 *            $ref: '#/definitions/Property'
 *        403:
 *          description: Unauthorized. No auth token
 *        404:
 *          description: Property not found
 *        400:
 *          description: Bad request
 *        500:
 *          description: Something went wrong try again
 *
 */
router.patch('/:id', authPropertyOwner, listingEditCheck, editProperty);

/**
 * @swagger
 * /property/{id}/sold:
 *    patch:
 *      description: Update a property listing
 *      summary: Update listing
 *      produces:
 *        application/json
 *      tags:
 *        - Property
 *      parameters:
*        - in: path
 *          name: id
 *          required: true
 *          type: string
 *      security:
 *        - bearerAuth: []
 *          type: apikey
 *      responses:
 *        200:
 *          description: Property updated successfully
 *          schema:
 *            $ref: '#/definitions/Property'
 *        403:
 *          description: Unauthorized. No auth token
 *        404:
 *          description: Property not found
 *        400:
 *          description: Bad request
 *        500:
 *          description: Something went wrong try again
 *
 */
router.patch('/:id/sold', authPropertyOwner, updateProperty);

/**
 * @swagger
 * /property/{id}:
 *    delete:
 *      description: Delete a property listing
 *      summary: Delete listing
 *      produces:
 *        application/json
 *      tags:
 *        - Property
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          type: string
 *      security:
 *        - bearerAuth: []
 *          type: apikey
 *      responses:
 *        200:
 *          description: Property deleted successfully
 *          schema:
 *            $ref: '#/definitions/Property'
 *        403:
 *          description: Unauthorized. No auth token
 *        404:
 *          description: Property not found
 *        400:
 *          description: Bad request
 *        500:
 *          description: Something went wrong try again
 *
 */
router.delete('/:id', authPropertyOwner, deleteProperty);

export default router;
