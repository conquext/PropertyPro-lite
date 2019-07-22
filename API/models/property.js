/**
* @swagger
* definitions:
*   error:
*     properties:
*       statusCode:
*         type: integer
*         format: int32
*         default: 400
*       message:
*         type: string
*       error:
*         type: string
*   success:
*     properties:
*       statusCode:
*         type: integer
*         format: int32
*         default: 200
*       message:
*         type: string
*       data:
*         type: object
*   Property:
*     type: object
*     properties:
*       property_id:
*         type: string
*       owner:
*         type: string
*       status:
*         type: string
*         enum:
*           - "For Rent"
*           - "For Sale"
*       type:
*         type: string
*       address:
*         type: string
*       state:
*         type: string
*       city:
*         type: string
*       country:
*         type: string
*       baths:
*         type: integer
*       rooms:
*         type: integer
*       price:
*         type: integer
*       ownerEmail:
*         type: string
*       ownerPhoneNumber:
*         type: string
*       created_on:
*         type: boolean
*         format: date-time
*       deleted:
*         type: boolean
*       last_updatedOn:
*         type: string
*         format: date-time
*/

class Property {
  constructor({
    owner,
    status,
    price,
    state,
    city,
    address,
    type,
    created_on,
    image_url,
    baths,
    rooms,
    owner_email,
    ownerEmail,
    owner_phone_number,
    ownerPhoneNumber,
    marketer,
    deleted,
    lastUpdatedOn,
  }) {
    this.status = status;
    this.type = type;
    this.state = state;
    this.city = city;
    this.address = address;
    this.price = price;
    this.created_on = created_on;
    this.image_url = image_url;
    this.baths = baths;
    this.rooms = rooms;
    this.owner_email = owner_email;
    this.ownerEmail = ownerEmail;
    this.owner_phone_number = owner_phone_number;
    this.ownerPhoneNumber = ownerPhoneNumber;
    this.marketer = marketer || owner;
    this.lastUpdatedOn = lastUpdatedOn || new Date().toLocaleString();
    this.owner = owner; // userId
    this.deleted = deleted || false;
  }
}

export default Property;
