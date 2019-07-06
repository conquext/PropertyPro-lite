/**
* @swagger
* definitions:
*   Property:
*     type: object
*     properties:
*       propertyId:
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
*       marketer:
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
    propertyId,
    owner,
    status,
    price,
    state,
    city,
    address,
    type,
    createdOn,
    imageUrl,
    baths,
    rooms,
    marketer,
    deleted,
    lastUpdatedOn,
  }) {
    this.propertyId = propertyId;
    this.status = status || 'For Rent';
    this.type = type;
    this.state = state;
    this.city = city;
    this.address = address;
    this.price = price;
    this.createdOn = createdOn || new Date().toLocaleString();
    this.imageUrl = imageUrl;
    this.baths = baths;
    this.rooms = rooms;
    this.marketer = marketer || owner;
    this.lastUpdatedOn = lastUpdatedOn || new Date().toLocaleString();
    this.owner = owner; // userId
    this.deleted = deleted || false;
  }
}

export default Property;
