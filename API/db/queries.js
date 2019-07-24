/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import 'babel-polyfill';
import cassandraMap from 'cassandra-map';
import Debug from 'debug';
import { debug } from 'util';
import { pool, tableName, dbConfig } from './config';

export default class Model {
  constructor({ table }) {
    this.table = table;
    Model.logger(`Our table is ${this.table} in ${dbConfig.database}`);
  }

  static logger(message) {
    return Debug('dev')(message);
  }

  static async dbQuery(theQuery) {
    // const client = await pool.connect();
    try {
      return await pool.query(theQuery);
    } catch (error) {
      debug(`this error right here ${theQuery}: ${error}`);
    } finally {
      // pool.release();
    }
  }

  async insert({ data }) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const query = `INSERT INTO ${this.table} (${columns}) VALUES (${values.map(value => value = cassandraMap.stringify(value))}) RETURNING *;`;
      const returnData = await Model.dbQuery(query);
      return returnData;
    } catch (error) {
    //   Model.logger('Cannot execute insert query');
    }
  }

  async select({ returnFields }, { clause }, { join } = null) {
    try {
      let query;
      const columns = Object.values(returnFields) || '*';
      const theClause = Object.keys(clause).length === 0 ? '' : `WHERE (${this.table}.${Object.keys(clause)}) = (${Object.values(clause).map(eachClause => eachClause = cassandraMap.stringify(eachClause))})`;
      if (Object.keys(join).length === 0) {
        query = `SELECT ${columns} FROM ${this.table} ${theClause};`;
      } else {
        const joinTable = Object.keys(join)[0] || '';
        const joinId = Object.values(join)[0] || '';
        const theJoin = `${joinTable} ON ${joinTable}.${joinId} = ${this.table}.${joinId}`;
        query = `SELECT ${columns} FROM ${this.table} INNER JOIN ${theJoin} ${theClause};`;
      }
      const returnData = await Model.dbQuery(query);
      return returnData.rows;
    } catch (error) {
    //   Model.logger('Cannot execute select query');
    }
  }

  async update({ data }, { clause }) {
    try {
      let query = '';
      const columns = Object.keys(data) || '*';
      const values = Object.values(data);
      const theClause = Object.keys(clause).length === 0 ? '' : `WHERE (${this.table}.${Object.keys(clause)}) = (${Object.values(clause).map(eachClause => eachClause = cassandraMap.stringify(eachClause))})`;

      if (this.table === tableName.LOGIN) {
        query = `UPDATE ${this.table} SET (${columns}) = (${values.map(value => value = cassandraMap.stringify(value))}) ${theClause};`;
      } else query = `UPDATE ${this.table} SET (${columns}, lastUpdated) = (${values.map(value => value = cassandraMap.stringify(value))}, ${cassandraMap.stringify(new Date())}) ${theClause};`;

      const returnData = Model.dbQuery(query);

      return returnData;
    } catch (error) {
    //   Model.logger('Cannot execute update query');
    }
  }

  async delete({ clause }) {
    try {
      const theClause = `WHERE ${this.table}.${Object.keys(clause)} = (${Object.values(clause).map(eachClause => eachClause = cassandraMap.stringify(eachClause))})`;
      const query = `DELETE FROM ${this.table} ${theClause} RETURNING *`;
      const returnData = Model.dbQuery(query);
      return returnData;
    } catch (error) {
    //   Model.logger('Cannot execute delete query');
    }
  }
}
