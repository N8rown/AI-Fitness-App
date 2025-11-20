import dotenv from 'dotenv';
import { initializeDatabase } from './db/schema.js';
import { closePool } from './db/connection.js';

dotenv.config();

async function migrate() {
  try {
    console.log('Running database migrations...');
    await initializeDatabase();
    await closePool();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
