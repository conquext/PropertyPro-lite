/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import 'babel-polyfill';
import cassandraMap from 'cassandra-map';
import Debug from 'debug';
import { debug } from 'util';
import { pool } from './config';

export default class Model {
  constructor({ table }) {
    this.table = table;
    Model.logger(`Our table is ${this.table}`);
  }

  static logger(message) {
    return Debug('dev')(message);
  }

  static async dbQuery(theQuery) {
    try {
      const client = await pool.connect();
      await client.query(theQuery)
        .then(res => console.log(res.rows));
      client.release();
    } catch (error) {
      debug(`this error right here ${theQuery}: ${error}`);
    }
  }

  async insert(data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const query = `INSERT INTO ${this.table} (${columns}) VALUES (${values.map(value => value = cassandraMap.stringify(value))}) RETURNING *;`;

    const returnData = Model.dbQuery(query);

    return returnData;
  }

  async select({ fields }, { clause }) {
    const columns = Object.values(fields) || '*';
    const theClause = `WHERE (${this.table}.${Object.keys(clause)}) = (${Object.values(clause).map(eachClause => eachClause = cassandraMap.stringify(eachClause))})`;
    const query = `SELECT ${columns} FROM ${this.table} ${theClause};`;
    const returnData = Model.dbQuery(query);
    return returnData;
  }

  async update(prop, data, clause) {
    const columns = Object.keys(data) || '*';
    const values = Object.values(data);
    const theClause = clause ? '' : `WHERE ${this.table}.${Object.keys(prop)} = ${Object.values(prop)}`;
    const query = `UPDATE ${this.table} SET (${columns}, lastUpdated) = (${values.map(value => value = cassandraMap.stringify(value))}, ${cassandraMap.stringify(new Date())}) ${theClause}`;
    const returnData = Model.dbQuery(query);
    return returnData;
  }

  async delete(prop) {
    // const columns = Object.keys(prop) || '*';
    // const values = Object.values(prop);
    const theClause = `WHERE ${this.table}.${Object.keys(prop)} = ${Object.values(prop)}`;
    const query = `DELETE FROM ${this.table} ${theClause} RETURNING *`;
    const returnData = Model.dbQuery(query);
    return returnData;
  }
}
