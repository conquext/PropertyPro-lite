import { Pool } from 'pg';
import { config } from 'dotenv';
import Debug from 'debug';

config();
const debug = new Debug('dev');

const tableName = {
  USERS: 'users',
  PROPERTIES: 'property',
  FLAGS: 'flags',
  LOGIN: 'login',
  LISTINGS: 'listing',
  DELETED: 'deleted',
  FORGOTPASSWORD: 'forgotpassword',
};

const connectionstring = process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL || 'propertypro';
const dbConfig = {
  user: connectionstring.slice(11, connectionstring.length).split('@')[0].split(':')[0] || 'postgres',
  password: connectionstring.slice(11, connectionstring.length).split('@')[0].split(':')[1] || '',
  host: connectionstring.slice(11, connectionstring.length).split('@')[1].split('/')[0].split(':')[0] || 'localhost',
  database: connectionstring.slice(11, connectionstring.length).split('@')[1].split('/')[1] || 'propertypro',
  port: connectionstring.slice(11, connectionstring.length).split('@')[1].split('/')[0].split(':')[1] || 5432,
  idleTimeoutMillis: 50000,
};
const pool = new Pool({ connectionString: connectionstring });

pool.on('error', (err) => {
  // debug(`Unexpected error on idle client: ${err}`);
//   process.exit();
});
pool.on('connect', () => {
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
