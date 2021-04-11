const { Pool } = require('pg');
const config = require('../utils/config');

const env = process.env.NODE_ENV || 'development';

let pgConfig;
if (env === 'development') {
  pgConfig = {
    host: config.HOST,
    port: config.POSTGRES_PORT,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
    database: config.DATABASE_NAME,
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0,
  };
} else {
  pgConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const pool = new Pool(pgConfig);

module.exports = pool;
