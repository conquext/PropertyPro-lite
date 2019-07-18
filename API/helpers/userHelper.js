import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Debug from 'debug';
import { users, property } from '../db/db';
import * as config from '../config';
import Model from '../db/queries';
import { tableName } from '../db/config';

const debug = Debug('dev');
const usersTable = new Model({ table: tableName.USERS });
const propertiesTable = new Model({ table: tableName.PROPERTIES });
const flagsTable = new Model({ table: tableName.FLAGS });
const loginTable = new Model({ table: tableName.LOGIN });
const deletedTable = new Model({ table: tableName.DELETED });

export default class UserHelper {
  static async find({ table }, { returnFields }, { fields }, { values }, { join }) {
    const tableModel = this.pickTable(table);
    try {
      await tableModel.select({ returnFields }, { clause: { [fields]: values } }, { join });
    } catch (error) {
      debug(`Error in selecting from ${table} table: ${error}`);
    }
  }

  static findUser(field, value) {
    let userFound = null;
    userFound = users.filter(thisUser => thisUser[field] === value);
    if (Object.keys(userFound).length !== 0) {
      return userFound[0];
    }
    return null;
  }

  static async findDbUser(field, value) {
    try {
      let userFound = null;
      userFound = await usersTable.select({ returnFields: '*' }, { clause: { [field]: value } }, { join: { } });
      if (Object.keys(userFound).length !== 0) {
        return userFound[0];
      }
      return null;
    } catch (err) {
      debug(`Error in finding ${field} in Users table: ${err}`);
    }
  }

  static async findDbUserLogin(field, value) {
    try {
      let userFound = null;
      userFound = await usersTable.select({ returnFields: '*' }, { clause: { [field]: value } }, { join: { login: 'email' } });
      if (Object.keys(userFound).length !== 0) {
        return userFound[0];
      }
      return userFound;
    } catch (err) {
      debug(`Error in finding user in login db: ${err}`);
    }
  }


  static findUserById(id) {
    return this.findUser('id', id);
  }

  static findDbUserById(id) {
    return this.findDbUser('id', id);
  }

  static findUserByEmail(email) {
    return this.findUser('email', email);
  }

  static findDbUserByEmailLogin(email) {
    return this.findDbUserLogin('email', email);
  }

  static findDbUserByToken(token) {
    return this.findDbLogin('token', token);
  }

  static findDbUserByEmail(email) {
    return this.findDbUser('email', email);
  }

  static findPropertyOwner(id) {
    const propertyFound = property.filter(match => match.id === id);
    if (Object.keys(propertyFound).length !== 0) {
      return this.findUser('id', propertyFound[0].owner);
    }
    return null;
  }

  static async findDbProperty(field, value) {
    try {
      let propertyFound = null;
      propertyFound = await propertiesTable.select({ returnFields: '*' }, { clause: { [field]: value } }, { join: { } });
      if (Object.keys(propertyFound).length !== 0) {
        return propertyFound;
      }
      return propertyFound;
    } catch (err) {
      debug(`Error in finding property in db: ${err}`);
    }
  }

  static async findDbProperties() {
    try {
      let propertyFound = null;
      propertyFound = await propertiesTable.select({ returnFields: '*' }, { clause: { } }, { join: { } });
      if (Object.keys(propertyFound).length !== 0) {
        return propertyFound;
      }
      return propertyFound;
    } catch (err) {
      debug(`Error in finding property in db: ${err}`);
    }
  }


  static async findDbPropertyOwner(id) {
    const propertyFound = await propertiesTable.select({ returnFields: '*' }, { clause: { id } });
    if (Object.keys(propertyFound).length !== 0) {
      return this.findDbUser('id', propertyFound[0].owner);
    }
    return null;
  }

  static async findDbLogin(field, value) {
    try {
      let fieldFound = null;
      fieldFound = await loginTable.select({ returnFields: [field] }, { clause: { [field]: value } }, { join: { } });
      if (Object.keys(fieldFound).length !== 0) {
        return fieldFound[0];
      }
      return null;
    } catch (err) {
      debug(`Error in finding ${field} in Login table: ${err}`);
    }
  }

  static pickTable(table) {
    // tableName.array.forEach(element => {
    //   const `${table}Table` = new Model({ table: tableName.USERS });
    // });
    // const tableSelected = table.toString().toUpperCase();
    // return `${tableSelected}Table`;

    let tableModel;
    table === 'users' ? tableModel = usersTable
      : table === 'login' ? tableModel = loginTable
        : table === 'property' ? tableModel = propertiesTable
          : table === 'flags' ? tableModel = flagsTable
            : table === 'deleted' ? tableModel = deletedTable
              : tableModel = null;

    return tableModel;
  }

  static async updateDb(table, data, field, value) {
    const tableModel = this.pickTable(table);
    try {
      await tableModel.update({ data }, { clause: { [field]: value } });
    } catch (error) {
      debug(`Error in updating ${table} db: ${error}`);
    }
  }

  static async insertDb(table, data) {
    const tableModel = this.pickTable(table);
    try {
      const returnData = await tableModel.insert({ data });
      return returnData.rows[0];
    } catch (error) {
      debug(`Error in inserting into ${table} db: ${error}`);
    }
  }

  static async deleteDb(table, field, value) {
    const tableModel = this.pickTable(table);
    try {
      const returnData = await tableModel.delete({ clause: { [field]: value } });
      return returnData.rows[0];
    } catch (error) {
      debug(`Error in inserting into ${table} db: ${error}`);
    }
  }

  static async updateDbLogin(data, email) {
    try {
      await loginTable.update({ data }, { clause: { email } });
    } catch (error) {
      debug(`Error in updating login db: ${error}`);
    }
  }

  // static async insert() {
  //   const user2 = {
  //     email: 'email2@email.com',
  //     first_name: 'Nametwo',
  //     last_name: 'Jones',
  //     phoneNumber: '080002',
  //     address: '1, Berger Street, Lagos',
  //     is_admin: true,
  //     dob: new Date(1, 2, 1992),
  //     state: 'Lagos',
  //     country: 'Nigeria',
  //     type: 'user',
  //   };
  //   await usersTable.insert(user1);
  // }

  // static insertDbUser(user, table) {
  //   return this.insert('user', user, table);
  // }

  static hashPassword(password) {
    // @ts-ignore
    const salt = bcrypt.genSaltSync(10);
    // @ts-ignore
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  static comparePassword(password, hash) {
    // @ts-ignore
    return bcrypt.compareSync(password, hash);
  }

  static generateToken(user) {
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
    const token = jwt.sign({ payload }, config.secret, { expiresIn: 86400 });
    return token;
  }
}
