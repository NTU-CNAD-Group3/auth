import pg from 'pg';
import config from '@/config.js';
import logger from '@/utils/logger.js';

export const pool = new pg.Pool({
  host: `${config.DATABASE_HOST}`,
  user: `${config.DATABASE_USER}`,
  password: `${config.DATABASE_PASSWORD}`,
  port: `${config.DATABASE_PORT}`,
  database: `${config.DATABASE_NAME}`,
});

pool.on('error', () => {
  process.exit(-1);
});

const createTableText = `
  CREATE TABLE IF NOT EXISTS users (
    id                      SERIAL        PRIMARY KEY,
    email                   VARCHAR(255)  NOT NULL UNIQUE,
    username                VARCHAR(255)  NOT NULL,
    password                VARCHAR(255)  NOT NULL,
    provider                VARCHAR(255)  NOT NULL CHECK (provider IN ('local', 'google', 'github')) DEFAULT 'local',
    role                    VARCHAR(255)  NOT NULL CHECK (role IN ('verified_user', 'unverified_user', 'admin')) DEFAULT 'unverified_user',
    emailVerificationToken  VARCHAR(255)  UNIQUE,
    createdAt               TIMESTAMP     WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS users_email_index ON users USING btree (email);
  CREATE UNIQUE INDEX IF NOT EXISTS users_emailVerificationToken_index ON users USING btree (emailVerificationToken);
`;

export const databaseConnection = async () => {
  try {
    await pool.connect();
    await pool.query(createTableText);
    logger.info({
      message: `msg=Database connected`,
    });
  } catch (error) {
    logger.error({
      message: `msg=Database connection error error=${error}`,
    });
  }
};
