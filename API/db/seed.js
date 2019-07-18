import debug from 'debug';
import Model from './queries';
import { tableName, dbConfig } from './config';
import Migration from './migrations';


const usersTable = new Model({ table: tableName.USERS });
const propertiesTable = new Model({ table: tableName.PROPERTIES });
const flagsTable = new Model({ table: tableName.FLAGS });
const loginTable = new Model({ table: tableName.LOGIN });


const user1 = {
  email: 'email1@email.com',
  first_name: 'Nameone',
  last_name: 'Jones',
  phoneNumber: '080001',
  address: 'New Ikoyi, Lagos',
  is_admin: false,
  dob: new Date(1, 1, 1990),
  state: 'Lagos',
  country: 'Nigeria',
  type: 'user',
};

const user1Login = {
  email: 'email1@email.com',
  password: '$2a$10$mRLrXtSI/KMDivF8GUBwXuHqEYGEziZjL0hBwMNd5p.ZZ4K8aBgoC',
};

const user2Login = {
  email: 'email2@email.com',
  password: '$2b$15$l2ofh4pVyG7k2fKJ1KXspOL.vsXDoSHzPH8vkJDaYmCSzoTsUWMD.',
};

const agent1Login = {
  email: 'email3@email.com',
  password: '$2a$10$mRLrXtSI/KMDivF8GUBwXuHqEYGEziZjL0hBwMNd5p.ZZ4K8aBgoC',
};

const user2 = {
  email: 'email2@email.com',
  first_name: 'Nametwo',
  last_name: 'Jones',
  phoneNumber: '080002',
  address: '1, Berger Street, Lagos',
  is_admin: true,
  dob: new Date(1, 2, 1992),
  state: 'Lagos',
  country: 'Nigeria',
  type: 'user',
};

const user2Update = {
  email: 'email2@email.com',
  first_name: 'NametwoUpdate',
  last_name: 'Jones',
};

const agent1 = {
  email: 'email3@email.com',
  first_name: 'Namethree',
  last_name: 'Jones',
  phoneNumber: '080003',
  address: 'Plot 10, Block 20, Lekki',
  is_admin: true,
  dob: new Date(1, 3, 1993),
  state: 'Lagos',
  country: 'Nigeria',
  type: 'agent',
};

const property1 = {
  owner: 3,
  status: 'For Sale',
  price: '40000',
  state: 'Lagos',
  city: 'Ikeja',
  address: '234, Eleyele, Ikeja',
  type: 'Flat',
  created_on: new Date(1, 1, 2019),
  image_url: 'www.wwwww',
  baths: '2',
  rooms: '3',
  //   marketer: 'Etihad Properties',
  deleted: false,
  ownerEmail: 'email3@email.com',
  ownerPhoneNumber: '080003',
};

const flag1 = {
  property_id: 1,
  reason: 'Very expensive',
  description: 'Its something else',
  created_on: new Date(3, 1, 2019),
};

class Seeder {
  /**
     * Create and seed all tables
     */
  constructor() {
    this.database = dbConfig.database;
    debug(`Seeding Migration into ${this.database}`);
    try {
      Migration.createAllTables();
    } catch (err) {
      debug(err);
    }
  }

  /**
    * Insert data in Table
    */
  static insertSeed(data, table) {
    const query = `${table}.insert({data: ${data}})`;
    Model.dbQuery(query);
  }

  /**
    * Inserts A sample entity in all Table
    */
  static async insertData() {
    try {
      await usersTable.insert({ data: user1 });
      await usersTable.insert({ data: user2 });
      await usersTable.insert({ data: agent1 });
      await loginTable.insert({ data: user1Login });
      await loginTable.insert({ data: user2Login });
      await loginTable.insert({ data: agent1Login });
      await propertiesTable.insert({ data: property1 });
      await flagsTable.insert({ data: flag1 });
    } catch (err) {
      debug(err);
    }
  }

  static async updateData() {
    try {
      await usersTable.update({ data: user2Update }, { clause: { id: 2 } });
    } catch (error) {
      debug(error);
    }
  }

  static async selectData() {
    try {
      await usersTable.select({ returnFields: ['id', 'created_on', 'first_name', 'last_name'] }, { clause: { type: 'agent' } }, { join: { } });
    } catch (error) {
      debug(error);
    }
  }

  static async deleteData() {
    try {
      await usersTable.delete({ clause: { id: 2 } });
    } catch (error) {
      debug(error);
    }
  }

  static async seed() {
    try {
      await Migration.dropAllTables();
      await Migration.createAllTables();
      await Seeder.insertData();
    } catch (err) {
      debug(err);
    }
  }
}

Seeder.seed();
// Seeder.insertData();
// Seeder.updateData();
// Seeder.selectData();
// Seeder.deleteData();
