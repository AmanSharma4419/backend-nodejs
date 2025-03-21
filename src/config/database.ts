import knex from 'knex';
import config from '../../knexfile';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

export const db = knex(knexConfig);

// Test the connection
export const testConnection = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}; 