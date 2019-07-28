/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import UserHelper from '../helpers/userHelper';
import Property from '../models/property';
import authMiddleware from '../middlewares/authMiddleware';

const { errorResponse, successResponse } = authMiddleware;

export default class propertyController {
  /**
   * @description List a new property
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {propertyController} A new property listing
   * @memberof propertyController
   */
  static async listNewProperty(req, res) {
    try {
      const {
        status = 'For Rent', price = 0, state, city, address = 'Not Available', type, baths = 0, rooms = 0, image_url,
      } = req.body;
      const ownerFound = await UserHelper.findDbUserById(parseInt(req.data.id, 10)); // Retrieve agent details from database
      if (ownerFound) {
        const newProperty = new Property(
          // @ts-ignore
          {
            owner: ownerFound.id,
            status,
            type,
            state,
            city,
            address,
            price,
            created_on: new Date().toLocaleString(),
            image_url,
            baths,
            rooms,
            ownerEmail: ownerFound.email,
            owner_email: ownerFound.email,
            owner_phone_number: ownerFound.phoneNumber,
            ownerPhoneNumber: ownerFound.phoneNumber,
          },
        );

        const listingDbData = { // Database record to insert for new property
          owner: ownerFound.id,
          status: newProperty.status,
          price: newProperty.price,
          state: newProperty.state,
          city: newProperty.city,
          address: newProperty.address,
          type: newProperty.type,
          created_on: newProperty.created_on,
          image_url: newProperty.image_url,
          baths: newProperty.baths,
          rooms: newProperty.rooms,
          deleted: false,
          ownerEmail: ownerFound.email,
          ownerPhoneNumber: ownerFound.phonenumber,
        };
        try {
          const newListing = await UserHelper.insertDb('property', listingDbData);
          return res.status(201).json({
            status: 'success',
            message: 'New property listed successfully',
            data: newListing,
          });
        } catch (error) {
          return errorResponse(res, 400, [error]);
        }
      }
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /**
   * @description Returns all property listings
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {propertyController} Property listings
   * @memberof propertyController
   */
  static async getAllProperty(req, res) {
    try {
      const propertyFound = await UserHelper.findDbProperties();

      if (propertyFound) {
        if (propertyFound.length > 1) {
          return res.status(200).json({
            status: 'success',
            message: 'Properties retrieved successfully',
            data: propertyFound,
          });
        }
        return res.status(200).json({
          status: 'success',
          message: 'Property retrieved successfully',
          data: propertyFound[0],
        });
      }
      return errorResponse(res, 400, ['No property found']);
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /**
   * @description Returns a particular property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {propertyController} property listing
   * @memberof propertyController
   */
  static async getProperty(req, res) {
    try {
      const thisId = parseInt(req.params.id, 10);
      let propertyFound = null;
      if (req.query.owner && !(req.query.type || req.query.status)) {
        const { owner } = req.query;
        const ownerFound = await UserHelper.findDbUserById(parseInt(owner, 10));
        if (ownerFound) {
          const theOwnerId = await ownerFound.id;
          propertyFound = await UserHelper.findDbProperty('owner', theOwnerId);
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === parseInt(baths, 10));
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(props => props.rooms === parseInt(rooms, 10));
          }
          if (req.query.price) {
            let { price } = req.query;
            price = price.split('-');
            const priceUpper = price[0] || 0;
            const priceLower = price[1] || Infinity;
            propertyFound = propertyFound.filter(props => (props.price <= parseInt(priceLower, 10) && (props.price >= parseInt(priceUpper, 10))));
          }
        }
      }
      if (req.query.type && !(req.query.owner || req.query.status)) {
        const { type } = req.query;
        propertyFound = await UserHelper.findDbProperty('type', type);
        if (propertyFound) {
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === parseInt(baths, 10));
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(searchProperty => searchProperty.rooms === rooms);
          }
          if (req.query.price) {
            let { price } = req.query;
            price = price.split('-');
            const priceUpper = price[0] || 0;
            const priceLower = price[1] || Infinity;
            propertyFound = propertyFound.filter(props => (props.price <= parseInt(priceLower, 10) && (props.price >= parseInt(priceUpper, 10))));
          }
        }
      }
      if (req.query.status && !(req.query.owner || req.query.type)) {
        const { status } = req.query;
        propertyFound = await UserHelper.findDbProperty('status', status);
        if (propertyFound) {
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === parseInt(baths, 10));
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(props => props.rooms === parseInt(rooms, 10));
          }
          if (req.query.price) {
            let { price } = req.query;
            price = price.split('-');
            const priceUpper = price[0] || 0;
            const priceLower = price[1] || Infinity;
            propertyFound = propertyFound.filter(props => (props.price <= parseInt(priceLower, 10) && (props.price >= parseInt(priceUpper, 10))));
          }
        }
      }
      if (req.query.owner && (req.query.type || req.query.status)) {
        if (req.query.owner) {
          const { owner } = req.query;
          const ownerFound = await UserHelper.findDbUserById(parseInt(owner, 10));
          if (ownerFound) {
            propertyFound = await UserHelper.findDbProperty('owner', ownerFound.id);
            if (propertyFound) {
              if (req.query.type) {
                const { type } = req.query;
                propertyFound = propertyFound.filter(props => props.type === type);
              }
              if (req.query.status) {
                const { status } = req.query;
                propertyFound = propertyFound.filter(props => props.status === status);
              }
              if (req.query.baths) {
                const { baths } = req.query;
                propertyFound = propertyFound.filter(props => props.baths === parseInt(baths, 10));
              }
              if (req.query.rooms) {
                const { rooms } = req.query;
                propertyFound = propertyFound.filter(props => props.rooms === parseInt(rooms, 10));
              }
              if (req.query.price) {
                let { price } = req.query;
                price = price.split('-');
                const priceUpper = price[0] || 0;
                const priceLower = price[1] || Infinity;
                propertyFound = propertyFound.filter(props => (props.price <= parseInt(priceLower, 10) && (props.price >= parseInt(priceUpper, 10))));
              }
            }
          }
        }
      }
      if (!req.query.owner && req.query.type) {
        const { type } = req.query;
        propertyFound = await UserHelper.findDbProperty('type', type);
        if (propertyFound) {
          if (req.query.status) {
            const { status } = req.query;
            propertyFound = propertyFound.filter(props => props.status === status);
          }
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === parseInt(baths, 10));
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(props => props.rooms === parseInt(rooms, 10));
          }
          if (req.query.price) {
            let { price } = req.query;
            price = price.split('-');
            const priceUpper = price[0] || 0;
            const priceLower = price[1] || Infinity;
            propertyFound = propertyFound.filter(props => (props.price <= parseInt(priceLower, 10) && (props.price >= parseInt(priceUpper, 10))));
          }
        }
      }
      if (!req.query.owner && !req.query.type) {
        if (req.query.status) {
          const { status } = req.query;
          propertyFound = propertyFound.filter(props => (props.status === status));
        }
        if (req.query.baths) {
          const { baths } = req.query;
          if (!propertyFound) {
            propertyFound = await UserHelper.findDbProperties();
          }
          propertyFound = propertyFound.filter(props => props.baths === parseInt(baths, 10));
        }
        if (req.query.rooms) {
          const { rooms } = req.query;
          if (!propertyFound) {
            propertyFound = await UserHelper.findDbProperties();
          }
          propertyFound = propertyFound.filter(props => props.rooms === parseInt(rooms, 10));
        }
        if (req.query.price) {
          let { price } = req.query;
          price = price.split('-');
          const priceUpper = price[0] || 0;
          const priceLower = price[1] || 1000000000000000;
          if (!propertyFound) {
            propertyFound = await UserHelper.findDbProperties();
          }
          propertyFound = propertyFound.filter(props => (props.price <= parseInt(priceLower, 10) && (props.price >= parseInt(priceUpper, 10))));
        }
      }
      if (Object.keys(req.query).length === 0) {
        propertyFound = await UserHelper.findDbProperty('property_id', thisId);
      }
      if (propertyFound) {
        if (propertyFound.length === 1) {
          return res.status(200).json({
            status: 'success',
            data: propertyFound[0],
          });
        }
        if (propertyFound.length >= 1) {
          return res.status(200).json({
            status: 'success',
            data: propertyFound,
          });
        }
      }
      return errorResponse(res, 404, ['Property not found']);
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /**
   * @description Edit a property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {propertyController} Edited property listing
   * @memberof propertyController
   */
  static async editProperty(req, res) {
    try {
      const thisId = parseInt(req.params.id, 10);
      let propertyFound = null;
      propertyFound = await UserHelper.findDbProperty('property_id', thisId);
      if (!propertyFound) {
        return errorResponse(res, 404, ['Property not found']);
      }

      if (Object.keys(req.body).length >= 1) {
        const editFields = Object.entries(req.body);
        // eslint-disable-next-line no-restricted-syntax
        for (const [field, value] of editFields) {
          propertyFound[0][field] = value;
        }
      }

      const editDbProperty = {
        status: propertyFound[0].status,
        price: propertyFound[0].price,
        state: propertyFound[0].state,
        city: propertyFound[0].city,
        address: propertyFound[0].address,
        type: propertyFound[0].type,
        image_url: propertyFound[0].image_url,
        baths: propertyFound[0].baths,
        rooms: propertyFound[0].rooms,
      };

      try {
        await UserHelper.updateDb('property', editDbProperty, 'property_id', thisId);
      } catch (error) {
        return errorResponse(res, 400, [error]);
      }

      try {
        const theEditedProperty = await UserHelper.findDbProperty('property_id', thisId);
        return res.status(200).json({
          status: 'success',
          data: theEditedProperty[0],
        });
      } catch (error) {
        return errorResponse(res, 400, [error]);
      }
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /** Update a property listing
   * @description Update a property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {propertyController} Updated property listing
   * @memberof propertyController
   */
  static async updateProperty(req, res) {
    try {
      const thisId = parseInt(req.params.id, 10);
      let propertyFound = null;
      propertyFound = await UserHelper.findDbProperty('property_id', thisId);
      if (!propertyFound) {
        return errorResponse(res, 404, ['Property not found']);
      }

      propertyFound[0].status = 'Sold';

      const updateDbProperty = {
        status: propertyFound[0].status,
      };

      try {
        await UserHelper.updateDb('property', updateDbProperty, 'property_id', thisId);
      } catch (error) {
        return errorResponse(res, 400, [error]);
      }

      try {
        const theUpdatedProperty = await UserHelper.findDbProperty('property_id', thisId);
        return res.status(200).json({
          status: 'success',
          data: theUpdatedProperty[0],
        });
      } catch (error) {
        return errorResponse(res, 400, [error]);
      }
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }

  /**
   * @description Delete a property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns Promise {propertyController} Deleted property listing
   * @memberof propertyController
   */
  static async deleteProperty(req, res) {
    try {
      const thisId = parseInt(req.params.id, 10);
      let propertyFound = null;
      propertyFound = await UserHelper.findDbProperty('property_id', thisId);
      if (!propertyFound) {
        return errorResponse(res, 404, ['Property not found']);
      }
      // @ts-ignore
      try {
        const updatedDbDeleted = propertyFound[0];
        delete updatedDbDeleted.property_id;
        delete updatedDbDeleted.deleted;
        await UserHelper.insertDb('deleted', updatedDbDeleted);
        await UserHelper.deleteDb('property', 'property_id', thisId);
      } catch (error) {
        return errorResponse(res, 400, [error]);
      }

      return successResponse(res, 200, ['Property deleted successfully']);
    } catch (error) {
      return errorResponse(res, 500, [error]);
    }
  }
}
