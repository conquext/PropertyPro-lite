/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable camelcase */
import { property } from '../db/db';
import UserHelper from '../helpers/userHelper';
import Property from '../models/property';

export default class propertyController {
  /**
   * @description List a new property
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {propertyController} A new property listing
   * @memberof propertyController
   */
  static listNewProperty(req, res) {
    try {
      const newId = property[property.length - 1].id + 1;
      const {
        status = 'For Rent', price = 0, state, city, address, type, baths = 0, rooms = 0, image_url,
      } = req.body;
      const ownerFound = UserHelper.findUserById(parseInt(req.data.id, 10));
      if (ownerFound) {
        const newProperty = new Property(
          // @ts-ignore
          {
            id: newId,
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
        property.push(newProperty);

        return res.status(201).json({
          status: 'success',
          message: 'New property listed successfully',
          data: newProperty,
        });
      }
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }

  /**
   * @description Returns all property listings
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {propertyController} Property listings
   * @memberof propertyController
   */
  static getAllProperty(req, res) {
    try {
      const propertyFound = [];
      property.map((searchProperty) => {
        if (searchProperty.deleted === false) {
          propertyFound.push(searchProperty);
        }
        return propertyFound;
      });

      if (propertyFound.length === 1) {
        return res.status(200).json({
          status: 'success',
          message: 'Property retrieved successfully',
          data: propertyFound[0],
        });
      }
      if (propertyFound.length > 1) {
        return res.status(200).json({
          status: 'success',
          message: 'Properties retrieved successfully',
          data: propertyFound,
        });
      }
      if (propertyFound.length < 1) {
        return res.status(400).json({
          status: 'error',
          error: 'No property found',
        });
      }
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }

  /**
   * @description Returns a particular property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {propertyController} property listing
   * @memberof propertyController
   */
  static getProperty(req, res) {
    try {
      const thisid = parseInt(req.params.id, 10);
      let propertyFound = null;

      if (req.query.owner && !(req.query.type || req.query.status)) {
        const { owner } = req.query;
        const ownerFound = UserHelper.findUserById(parseInt(owner, 10));
        if (ownerFound) {
          propertyFound = property.filter(searchProperty => (searchProperty.owner === ownerFound.id) && (searchProperty.deleted === false));
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === baths);
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(props => props.rooms === rooms);
          }
        }
      }
      if (req.query.type && !(req.query.owner || req.query.status)) {
        const { type } = req.query;
        propertyFound = property.filter(searchProperty => (searchProperty.type === type) && (searchProperty.deleted === false));
        if (Object.keys(propertyFound).length !== 0) {
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === baths);
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(searchProperty => searchProperty.rooms === rooms);
          }
        }
      }
      if (req.query.status && !(req.query.owner || req.query.type)) {
        const { status } = req.query;
        propertyFound = property.filter(props => (props.status === status) && (props.deleted === false));
        if (Object.keys(propertyFound).length !== 0) {
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === baths);
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(props => props.rooms === rooms);
          }
        }
      }
      if (req.query.owner && (req.query.type || req.query.status)) {
        if (req.query.owner) {
          const { owner } = req.query;
          const ownerFound = UserHelper.findUserById(parseInt(owner, 10));
          if (ownerFound) {
            propertyFound = property.filter(searchProperty => (searchProperty.owner === ownerFound.id) && (searchProperty.deleted === false));
            if (Object.keys(propertyFound).length !== 0) {
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
                propertyFound = propertyFound.filter(props => props.baths === baths);
              }
              if (req.query.rooms) {
                const { rooms } = req.query;
                propertyFound = propertyFound.filter(props => props.rooms === rooms);
              }
            }
          }
        }
      }
      if (!req.query.owner && req.query.type) {
        const { type } = req.query;
        propertyFound = property.filter(props => (props.type === type) && (props.deleted === false));
        if (Object.keys(propertyFound).length !== 0) {
          if (req.query.status) {
            const { status } = req.query;
            propertyFound = propertyFound.filter(props => props.status === status);
          }
          if (req.query.baths) {
            const { baths } = req.query;
            propertyFound = propertyFound.filter(props => props.baths === baths);
          }
          if (req.query.rooms) {
            const { rooms } = req.query;
            propertyFound = propertyFound.filter(props => props.rooms === rooms);
          }
        }
      }
      if (!req.query.owner && !req.query.type) {
        if (req.query.status) {
          const { status } = req.query;
          propertyFound = propertyFound.filter(props => (props.status === status) && (props.deleted === false));
        }
        if (req.query.baths) {
          const { baths } = req.query;
          propertyFound = property.filter(props => props.baths === baths);
        }
        if (req.query.rooms) {
          const { rooms } = req.query;
          propertyFound = propertyFound.filter(props => props.rooms === rooms);
        }
      }
      if (Object.keys(req.query).length === 0) {
        propertyFound = property.filter(searchProperty => (searchProperty.id === thisid) && (searchProperty.deleted === false));
      }

      // if (propertyFound.length === 1) {
      //   return res.status(200).json({
      //     status: 'success',
      //     data: propertyFound[0],
      //   });
      // }
      if (propertyFound.length >= 1) {
        return res.status(200).json({
          status: 'success',
          data: propertyFound[0],
        });
      }
      return res.status(404).json({
        status: 'error',
        error: 'Property not found',
      });
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }

  /**
   * @description Edit a property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {propertyController} Edited property listing
   * @memberof propertyController
   */
  static editProperty(req, res) {
    try {
      const thisid = parseInt(req.params.id, 10);
      let propertyFound = null;
      propertyFound = property.filter(searchProperty => ((searchProperty.id === thisid) && (searchProperty.deleted === false)));
      if (Object.keys(propertyFound).length === 0) {
        return res.status(404).json({
          status: 'error',
          error: 'Property not found',
        });
      }

      if (Object.keys(req.body).length >= 1) {
        const editFields = Object.entries(req.body);
        // eslint-disable-next-line no-restricted-syntax
        for (const [field, value] of editFields) {
          propertyFound[0][field] = value;
        }
        propertyFound[0].lastUpdatedOn = new Date().toLocaleDateString();
      }
      return res.status(200).json({
        status: 'success',
        data: propertyFound[0],
      });
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }

  /** Update a property listing
   * @description Update a property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {propertyController} Updated property listing
   * @memberof propertyController
   */
  static updateProperty(req, res) {
    try {
      const thisid = parseInt(req.params.id, 10);
      let propertyFound = null;
      propertyFound = property.filter(searchProperty => ((searchProperty.id === thisid) && (searchProperty.deleted === false)));
      if (Object.keys(propertyFound).length === 0) {
        return res.status(404).json({
          status: 'error',
          error: 'Property not found',
        });
      }

      propertyFound[0].status = 'Sold';

      return res.status(200).json({
        status: 'success',
        data: propertyFound[0],
      });
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }

  /**
   * @description Delete a property listing
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {propertyController} Deleted property listing
   * @memberof propertyController
   */
  static deleteProperty(req, res) {
    try {
      const thisid = parseInt(req.params.id, 10);
      let propertyFound = null;
      let propertyIndex = null;
      property.map((searchProperty, index) => {
        if (searchProperty.id === thisid) {
          if (searchProperty.deleted !== true) {
            propertyFound = searchProperty;
            propertyIndex = index;
          }
        }
      });
      if (!propertyFound) {
        return res.status(404).json({
          status: 'error',
          error: 'Property not found',
        });
      }
      // @ts-ignore
      propertyFound.deleted = true;
      property.splice(propertyIndex, 1);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Property deleted successfully',
        },
      });
    } catch (error) {
      throw new Error('Something went wrong. Try again.');
    }
  }
}
