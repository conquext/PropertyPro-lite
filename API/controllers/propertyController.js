import { property } from '../db/db';
import UserHelper from '../helpers/userHelper';
import Property from '../models/property';

export default class propertyController {
  static listNewProperty(req, res) {
    try {
      const newPropertyId = property[property.length - 1].propertyId + 1;
      const {
        status, price, state, city, address, type, baths, rooms,
      } = req.body;

      const ownerFound = UserHelper.findUserById(parseInt(req.data.userId, 10));
      if (ownerFound) {
        const newProperty = new Property(
          {
            propertyId: newPropertyId,
            owner: ownerFound.userId,
            status,
            price,
            state,
            city,
            address,
            type,
            baths,
            rooms,
          },
        );
        property.push(newProperty);

        return res.status(201).json({
          status: 201,
          success: 'true',
          message: 'New property listed successfully',
          data: newProperty,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }

  static getAllProperty(req, res) {
    try {
      const propertyFound = [];
      property.map(searchProperty => propertyFound.push(searchProperty));
      if (propertyFound.length === 1) {
        return res.status(200).json({
          status: 200,
          message: 'Properties retrieved successfully',
          data: propertyFound,
        });
      }
      if (propertyFound.length > 1) {
        return res.status(200).json({
          status: 200,
          message: 'Property retrieved successfully',
          data: propertyFound,
        });
      }
      if (propertyFound.length < 1) {
        return res.status(400).json({
          status: 400,
          error: 'No property found',
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  static getProperty(req, res) {
    try {
      const thisPropertyId = parseInt(req.params.propertyId, 10);
      let propertyFound = null;

      if (req.query.owner && !(req.query.type || req.query.status)) {
        const { owner } = req.query;
        const ownerFound = UserHelper.findUserById(parseInt(owner, 10));
        if (ownerFound) {
          propertyFound = property.filter(searchProperty => (searchProperty.owner === ownerFound.userId));
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
        console.log('I ran');
        const { type } = req.query;
        propertyFound = property.filter(searchProperty => searchProperty.type === type);
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
        propertyFound = property.filter(props => props.status === status);
        if (Object.keys(propertyFound) !== 0) {
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
            propertyFound = property.filter(searchProperty => (searchProperty.owner === ownerFound.userId));
            if (Object.keys(propertyFound) !== 0) {
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
        console.log('I rean');
        const { type } = req.query;
        propertyFound = property.filter(props => props.type === type);
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
          propertyFound = propertyFound.filter(props => props.status === status);
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
        propertyFound = property.filter((searchProperty => searchProperty.propertyId === thisPropertyId));
      }
      if (propertyFound.length >= 1) {
        return res.status(200).json({
          status: 200,
          data: propertyFound,
        });
      }
      return res.status(404).json({
        status: 404,
        success: 'false',
        error: 'Property not found',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  static editProperty(req, res) {
    try {
      const thisPropertyId = parseInt(req.params.propertyId, 10);
      let propertyFound = null;
      propertyFound = property.filter((searchProperty => searchProperty.propertyId === thisPropertyId));
      if (Object.keys(propertyFound).length === 0) {
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'Property not found',
        });
      }

      if (Object.keys(req.body).length !== 0) {
        const editFields = Object.entries(req.body);
        // eslint-disable-next-line no-restricted-syntax
        for (const [field, value] of editFields) {
          propertyFound[0][field] = value;
        }
        // propertyFound.setUpdate();
      }

      return res.status(200).json({
        status: 200,
        data: propertyFound,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  static updateProperty(req, res) {
    try {
      const thisPropertyId = parseInt(req.params.propertyId, 10);
      let propertyFound = null;
      propertyFound = property.filter((searchProperty => searchProperty.propertyId === thisPropertyId));
      if (Object.keys(propertyFound) === 0) {
        return res.status(404).json({
          status: 404,
          error: 'Property not found',
        });
      }

      propertyFound[0].status = 'Sold';

      return res.status(200).json({
        status: 200,
        data: propertyFound,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  static deleteProperty(req, res) {
    try {
      const thisPropertyId = parseInt(req.params.propertyId, 10);
      let propertyFound = null;
      let propertyIndex = '';
      property.map((searchProperty, index) => {
        if (searchProperty.propertyId === thisPropertyId) {
          propertyFound = searchProperty;
          propertyIndex = index;
        }
      });
      if (!propertyFound) {
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'Property not found',
        });
      }
      propertyFound.deleted = true;
      property.splice(propertyIndex, 1);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Property deleted successfully',
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }
}
