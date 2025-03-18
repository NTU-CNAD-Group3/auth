import dotenv from 'dotenv';
dotenv.config();

class Config {
  constructor() {
    this.PORT = process.env.PORT || 8000;
    this.API_VERSION = process.env.API_VERSION || 'v1';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '';
    this.GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    this.SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.API_GATEWAY_URL = process.env.AUTH_BASE_URL || '';
    this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
    this.DATABASE_HOST = process.env.DATABASE_HOST || '';
    this.DATABASE_USER = process.env.DATABASE_USER || '';
    this.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
    this.DATABASE_NAME = process.env.DATABASE_NAME || '';
    this.DATABASE_PORT = process.env.DATABASE_PORT || '';
  }
}

export default new Config();
