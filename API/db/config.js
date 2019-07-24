import { Pool } from 'pg';
import { config } from 'dotenv';
import Debug from 'debug';

config();
const debug = new Debug('dev');

const dbConfig = {
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.NODE_ENV === 'test' ? process.env.PGDATABASE : process.env.PGDATABASE_TEST || 'propertypro',
  port: process.env.PGPORT || 5432,
  idleTimeoutMillis: 50000,
};

const tableName = {
  USERS: 'users',
  PROPERTIES: 'property',
  FLAGS: 'flags',
  LOGIN: 'login',
  LISTINGS: 'listing',
  DELETED: 'deleted',
};

// let connectionstring;
// process.env.NODE_ENV === 'test' ? connectionstring = process.env.DATABASE_URL_TEST : connectionstring = process.env.DATABASE_URL || 'propertypro';

const connectionstring = process.env.DATABASE_URL || 'propertypro';
const pool = new Pool({ connectionString: connectionstring });

pool.on('error', (err) => {
  debug(`Unexpected error on idle client: ${err}`);
  pool.connect();
//   process.exit();
});
pool.on('connect', () => {
  debug(`idleCount on connect ${pool.idleCount}`);
  debug(`totalClient on connect ${pool.totalCount}`);
  // debug('connected to the Database');
});

pool.on('remove', () => {
  debug(`idleCount on remove ${pool.idleCount}`);
  debug(`totalClient on remove ${pool.totalCount}`);
  debug('removed');
  // process.exit(0);
  // process.exit(0);
});

export { pool, tableName, dbConfig };
