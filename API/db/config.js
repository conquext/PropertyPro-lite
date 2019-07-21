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
  idleTimeoutMillis: 30000,
};

const tableName = {
  USERS: 'users',
  PROPERTIES: 'property',
  FLAGS: 'flags',
  LOGIN: 'login',
  LISTINGS: 'listing',
  DELETED: 'deleted',
};

const connectionstring = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: connectionstring });

pool.on('error', (err) => {
//   debug(`Unexpected error on idle client: ${err}`);
//   process.exit();
});
pool.on('connect', () => {
  // debug('connected to the Database');
});
pool.on('remove', () => {
//   debug('removed');
  process.exit(0);
});

export { pool, tableName, dbConfig };
