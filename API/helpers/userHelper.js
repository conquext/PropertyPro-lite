/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Debug from 'debug';
import * as config from '../config';
import Model from '../db/queries';
import { tableName } from '../db/config';

const debug = Debug('dev');
const usersTable = new Model({ table: tableName.USERS });
const propertiesTable = new Model({ table: tableName.PROPERTIES });
const flagsTable = new Model({ table: tableName.FLAGS });
const loginTable = new Model({ table: tableName.LOGIN });
const deletedTable = new Model({ table: tableName.DELETED });
const forgotPasswordTable = new Model({ table: tableName.FORGOTPASSWORD });

const smtpTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL,
    clientId: process.env.GMAIL_ID,
    clientSecret: process.env.GMAIL_SECRET,
    refreshToken: process.env.GMAIL_REFRESH,
  },
});

export default class UserHelper {
  static async sendMail(userFound, resetToken) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: userFound.email,
      subject: 'Reset password',
      html: `${'<h4><b>Reset Password</b></h4>'
                      + '<p>To reset your password, click link to complete this form:</p>'
                      + '<a href='}${process.env.CLIENT_URL}/resetpassword/${userFound.id}/${resetToken}">${process.env.CLIENT_URL}/resetpassword/${userFound.id}/${resetToken}</a>`
                      + '<p>This link expires in 5 hours<p>'
                      + '<br><br>'
                      + '<p>--Team</p>',
    };
    try {
      await smtpTransport.sendMail(mailOptions, (info) => {
        // debug('INFO', info);
      });
    } catch (error) {
      // debug('ERROR IN SENDING EMAIL', error);
      return 'sent';
    }
  }

  static async findOne(table, field, value) {
    const tableModel = this.pickTable(table);
    try {
      const entityFound = await tableModel.select({ returnFields: '*' }, { clause: { [field]: value } }, { join: { } });
      if (entityFound) {
        if (entityFound.length !== 0) {
          return entityFound[0];
        }
      }
      return null;
    } catch (error) {
      // debug(`Error in selecting from ${table} table: ${error}`);
    }
  }

  static async findDbUser(field, value) {
    try {
      const userFound = await usersTable.select({ returnFields: '*' }, { clause: { [field]: value } }, { join: { } });
      if (userFound.length) {
        if (userFound.length !== 0) {
          return userFound[0];
        }
      }
      return null;
    } catch (err) {
      // debug(`Error in finding ${field} in Users table: ${err}`);
    }
  }

  static async findDbUserLogin(field, value) {
    try {
      const userFound = await usersTable.select({ returnFields: '*' }, { clause: { [field]: value } }, { join: { login: 'email' } });
      if (userFound.length) {
        if (userFound.length !== 0) {
          return userFound[0];
        }
      }
      return null;
    } catch (err) {
      // debug(`Error in finding user in login db: ${err}`);
    }
  }

  static findDbUserById(id) {
    return this.findDbUser('id', id);
  }

  static findDbUserByEmailLogin(email) {
    return this.findDbUserLogin('email', email);
  }

  static findDbUserByEmail(email) {
    return this.findDbUser('email', email);
  }

  static async findDbProperty(field, value) {
    try {
      const propertyFound = await propertiesTable.select({ returnFields: '*' }, { clause: { [field]: value } }, { join: { } });
      if (propertyFound.length) {
        if (propertyFound.length !== 0) {
          return propertyFound;
        }
      }
      return null;
    } catch (err) {
      // debug(`Error in finding property in db: ${err}`);
    }
  }

  static async findDbProperties() {
    try {
      const propertyFound = await propertiesTable.select({ returnFields: '*' }, { clause: { } }, { join: { } });
      if (propertyFound.length) {
        if (propertyFound.length !== 0) {
          return propertyFound;
        }
      }
      return null;
    } catch (err) {
      // debug(`Error in finding property in db: ${err}`);
    }
  }


  static async findDbPropertyOwner(id) {
    try {
      const propertyFound = await propertiesTable.select({ returnFields: '*' }, { clause: { property_id: id } }, { join: { } });
      if (propertyFound.length) {
        if (propertyFound.length !== 0) {
          return this.findDbUser('id', propertyFound[0].owner);
        }
      }
      return null;
    } catch (error) {
      // debug(`Error in finding property ${id} in property table: ${error}`);
    }
  }

  static async findDbLogin(field, value) {
    try {
      const fieldFound = await loginTable.select({ returnFields: [field] }, { clause: { [field]: value } }, { join: { } });
      if (fieldFound.length) {
        if (fieldFound.length !== 0) {
          return fieldFound[0];
        }
      }
      return null;
    } catch (err) {
      // debug(`Error in finding ${field} in Login table: ${err}`);
    }
  }

  static pickTable(table) {
    let tableModel;
    table === tableName.USERS ? tableModel = usersTable
      : table === tableName.LOGIN ? tableModel = loginTable
        : table === tableName.PROPERTIES ? tableModel = propertiesTable
          : table === tableName.FLAGS ? tableModel = flagsTable
            : table === tableName.DELETED ? tableModel = deletedTable
              : table === tableName.FORGOTPASSWORD ? tableModel = forgotPasswordTable
                : tableModel = null;

    return tableModel;
  }

  static async updateDb(table, data, field, value) {
    const tableModel = this.pickTable(table);
    try {
      await tableModel.update({ data }, { clause: { [field]: value } });
    } catch (error) {
      // debug(`Error in updating ${table} db: ${error}`);
    }
  }

  static async insertDb(table, data) {
    const tableModel = this.pickTable(table);
    try {
      const returnData = await tableModel.insert({ data });
      if (returnData.rows.length !== 0) {
        return returnData.rows[0];
      }
      return returnData;
    } catch (error) {
      // debug(`Error in inserting into ${table} db: ${error}`);
    }
  }

  static async deleteDb(table, field, value) {
    const tableModel = this.pickTable(table);
    try {
      const returnData = await tableModel.delete({ clause: { [field]: value } });
      if (returnData.rows.length !== 0) {
        return returnData.rows[0];
      }
      return returnData;
    } catch (error) {
      // debug(`Error in inserting into ${table} db: ${error}`);
    }
  }

  static async updateDbLogin(data, email) {
    try {
      await loginTable.update({ data }, { clause: { email } });
    } catch (error) {
      // debug(`Error in updating login db: ${error}`);
    }
  }

  static async hashPassword(password) {
    // @ts-ignore
    const salt = await bcrypt.genSaltSync(10);
    // @ts-ignore
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  }

  static compareWithHash(password, hash) {
    // @ts-ignore
    return bcrypt.compareSync(password, hash);
  }

  static async generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      address: user.address,
      type: user.type,
      phoneNumber: user.phoneNumber,
      is_admin: user.isAdmin,
      dob: user.dob,
      state: user.state,
      country: user.country,
      createdAt: user.createdAt,
    };
    const token = await jwt.sign({ payload }, config.secret, { expiresIn: 86400 });
    return token;
  }
}
