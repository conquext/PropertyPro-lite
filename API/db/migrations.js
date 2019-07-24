import Debug from 'debug';
import { pool, tableName, dbConfig } from './config';

// import 'make-runnable';

const debug = Debug('dev');

const tableSchema = {
  usersKey: `(
          id SERIAL PRIMARY KEY,      
          first_name VARCHAR(128) NOT NULL,
          last_name VARCHAR(128) NOT NULL,
          email VARCHAR(128) UNIQUE NOT NULL,
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
          property_id SERIAL PRIMARY KEY,
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
          login_id SERIAL PRIMARY KEY,
          email VARCHAR(128) UNIQUE NOT NULL REFERENCES users(email) ON DELETE CASCADE,
          password VARCHAR(128) NOT NULL,
          token VARCHAR(528),
          logged_in BOOLEAN DEFAULT false,
          last_login TIMESTAMP
      )`,

  listingKey: `(
          listing_id SERIAL PRIMARY KEY,
          property_id INTEGER NOT NULL REFERENCES property(property_id),
          password VARCHAR(128) NOT NULL,
          last_modified TIMESTAMP,
          lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

  flagKey: `(
          flag_id SERIAL PRIMARY KEY,
          property_id INTEGER NOT NULL REFERENCES property(property_id),
          reason VARCHAR(128) NOT NULL,
          description VARCHAR(128) NOT NULL,
          created_on TIMESTAMP,
          lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,

  deletedPropertyKey: `(
        deleted_id SERIAL PRIMARY KEY,
        owner INTEGER NOT NULL REFERENCES users(id),
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
        deletedOn BOOLEAN DEFAULT false,
        ownerEmail VARCHAR(128) NOT NULL REFERENCES users(email),
        ownerPhoneNumber VARCHAR(128) NOT NULL REFERENCES users(phoneNumber),
        lastUpdated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`,
};

export default class Migration {
  /**
    * Create A Table
    */

  static async dbQuery(theQuery) {
    const client = await pool.connect();
    try {
      await client.query(theQuery);
      // client.release();
    } catch (error) {
      client.release();
    //   debug(`Error in ${theQuery}: ${error}`);
    } finally { client.release(); }
  }

  static async create(fields, table) {
    try {
      await this.dbQuery(`CREATE TABLE IF NOT EXISTS ${table} ${fields};`);
    } catch (err) {
    //   debug(`Error in creating ${table}: ${err}`);
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
    //   debug(err);
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
    //   debug(err);
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
    //   debug(err);
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
    //   debug(err);
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
    //   debug(err);
    }
  }

  /**
    * Create deleted property Table
    */
  static async createDeletedTable() {
    try {
      await this.create(tableSchema.deletedPropertyKey, `${tableName.DELETED}`);
      await debug('Deleted Properties table created');
    } catch (err) {
    //   debug(err);
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
      await this.createDeletedTable();
      debug('Tables successfully created');
    } catch (err) {
      debug(`Error while creating tables: ${err}`);
    }
  }

  static dropUsersTable() {
    // this.dbQuery(`DROP TABLE IF EXISTS ${tableName.USERS} cascade;`);
  }

  static dropPropertyTable() {
    // this.dbQuery(`DROP TABLE IF EXISTS ${tableName.PROPERTIES} cascade;`);
  }

  static async createSchema(schemaType) {
    await this.dbQuery(`CREATE SCHEMA IF NOT EXISTS ${schemaType};`);
    await this.dbQuery(`GRANT ALL ON SCHEMA ${schemaType} TO ${dbConfig.user}`);
    await this.dbQuery(`GRANT USAGE ON SCHEMA ${schemaType} TO ${dbConfig.user}`);
    await this.dbQuery(`GRANT ALL ON SCHEMA ${schemaType} To postgres`);
    await this.dbQuery(`COMMENT ON SCHEMA ${schemaType} IS 'standard public schema'`);
    // debug(`${schemaType} schema was created`);
  }

  static async dropSchema(schemaType) {
    await this.dbQuery(`DROP SCHEMA IF EXISTS ${schemaType} cascade;`);
    // debug('schema was deleted');
  }

  static async dropAllTables() {
    try {
      debug('all tables to be removed');
      //   await this.dbQuery(`DROP TABLE IF EXISTS ${tableName.USERS}, ${tableName.PROPERTIES}, ${tableName.LISTINGS}, ${tableName.LOGIN}, ${tableName.FLAGS}, ${tableName.DELETED};`);
      await this.dropSchema('public');
      await this.createSchema('public');
    } catch (error) {
    //   debug(`Error while dropping tables ${error}`);
    }
  }
}
