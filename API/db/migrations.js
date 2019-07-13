import Debug from 'debug';
import { pool, tableName } from './config';

// import 'make-runnable';

const debug = Debug('dev');

const tableSchema = {
  usersKey: `(
          id SERIAL PRIMARY KEY,      
          first_name VARCHAR(128) NOT NULL,
          last_name VARCHAR(128) NOT NULL,
          email VARCHAR(128) UNIQUE NOT NULL,
          password VARCHAR(128) NOT NULL,
          phoneNumber VARCHAR(128) UNIQUE NOT NULL,
          address VARCHAR(128) NOT NULL,
          is_admin BOOLEAN DEFAULT FALSE,
          dob TIMESTAMP,
          state VARCHAR(128),
          country VARCHAR(128),
          type VARCHAR(128) NOT NULL,
          created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,

  propertyKey: `(
          id SERIAL PRIMARY KEY,
          owner INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(128) DEFAULT 'For Rent',
          price INTEGER NOT NULL,
          city VARCHAR(128) NOT NULL,
          state VARCHAR(128) NOT NULL,
          address VARCHAR(128) NOT NULL,
          type VARCHAR(128) NOT NULL,
          created_on TIMESTAMP NOT NULL DEFAULT now(),
          image_url VARCHAR(128) NOT NULL,
          baths INTEGER,
          rooms INTEGER,
          deleted BOOLEAN DEFAULT false,
          ownerEmail VARCHAR(128) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
          ownerPhoneNumber VARCHAR(128) NOT NULL REFERENCES users(phoneNumber) ON DELETE CASCADE,
          lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,

  loginKey: `(
          id SERIAL PRIMARY KEY,
          email VARCHAR(128) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
          password VARCHAR(128) NOT NULL,
          last_login TIMESTAMP
      )`,

  listingKey: `(
          id SERIAL PRIMARY KEY,
          property_id INTEGER NOT NULL REFERENCES property(id),
          password VARCHAR(128) NOT NULL,
          last_modified TIMESTAMP
      )`,

  flagKey: `(
          id SERIAL PRIMARY KEY,
          property_id INTEGER NOT NULL REFERENCES property(id),
          reason VARCHAR(128) NOT NULL,
          description VARCHAR(128) NOT NULL,
          created_on TIMESTAMP
      )`,
};

export default class Migration {
  /**
    * Create A Table
    */

  //   static async dbQuery(theQuery) {
  //     console.log('i got here 1');
  //     await pool.connect().then((client) => {
  //       console.log('i got here 2');
  //       console.log(`this query right here ${theQuery}`);
  //       client.query(`${theQuery}`)
  //         .then((res) => {
  //           debug(res);
  //         console.log('i got here 3');
  //         })
  //         .catch((err) => {
  //           debug(`this error right here: ${err}`);
  //         })
  //         .finally(() => client.release());
  //     });
  //   }

  static async dbQuery(theQuery) {
    try {
      const client = await pool.connect();
      await client.query(theQuery);
      client.release();
    } catch (error) {
      debug(`this error right here ${theQuery}: ${error}`);
    }
  }

  static async create(fields, table) {
    try {
      await this.dbQuery(`CREATE TABLE IF NOT EXISTS ${table} ${fields};`);
    } catch (err) {
      debug(`Error in creating ${table}: ${err}`);
    }
  }

  /**
    * Create A User Table
    */
  static async createUserTable() {
    try {
      await this.create(tableSchema.usersKey, `${tableName.USERS}`);
      debug('Users table created');
    } catch (err) {
      debug(err);
    }
  }

  /**
     * Create A Property Table
     */
  static async createPropertyTable() {
    try {
      await this.create(tableSchema.propertyKey, `${tableName.PROPERTIES}`);
      await debug('Property table created');
    } catch (err) {
      debug(err);
    }
  }

  /**
    * Create users Login Table
    */
  static async createLoginTable() {
    try {
      await this.create(tableSchema.loginKey, `${tableName.LOGIN}`);
      debug('Login table created');
    } catch (err) {
      debug(err);
    }
  }

  /**
    * Create property listing Table
    */
  static async createListingTable() {
    try {
      await this.create(tableSchema.listingKey, `${tableName.LISTINGS}`);
      debug('Property Listing table created');
    } catch (err) {
      debug(err);
    }
  }

  /**
    * Create proeprty flags Table
    */
  static async createFlagTable() {
    try {
      await this.create(tableSchema.flagKey, `${tableName.FLAGS}`);
      await debug('Property Flags table created');
    } catch (err) {
      debug(err);
    }
  }


  /**
    * Create All Table
    */
  static async createAllTables() {
    debug('creating tables');
    try {
      await this.createUserTable();
      await this.createPropertyTable();
      await this.createLoginTable();
      await this.createListingTable();
      await this.createFlagTable();
      debug('Tables successfully created');
    } catch (err) {
      debug(`Error while creating tables: ${err}`);
    }
  }

  static dropUsersTable() {
    this.dbQuery(`DROP TABLE IF EXISTS ${tableName.USERS} cascade;`);
  }

  static dropPropertyTable() {
    this.dbQuery(`DROP TABLE IF EXISTS ${tableName.PROPERTIES} cascade;`);
  }

  static async createSchema(schemaType) {
    await this.dbQuery(`CREATE SCHEMA IF NOT EXISTS ${schemaType};`);
    debug(`${schemaType} schema was created`);
  }

  static async dropSchema(schemaType) {
    await this.dbQuery(`DROP SCHEMA IF EXISTS ${schemaType} cascade;`);
    debug('schema was deleted');
  }

  static async dropAllTables() {
    try {
      debug('all tables to be removed');
      await this.dbQuery('DROP TABLE IF EXISTS users, property, flags, login, listing;');
    } catch (error) {
      debug(`Error while dropping tables ${error}`);
    }
  }
}
