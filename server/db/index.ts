import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import { config } from './config';

// Get the database URL from hardcoded config
const databaseUrl = config.DATABASE_URL;

// Ensure we have a database URL
if (!databaseUrl) {
  console.error('⚠️ Database URL is not available');
  throw new Error('Database URL is missing in config');
}

console.log('✅ Using database connection:', databaseUrl.includes('postgresql://') ? 'Valid PostgreSQL URL' : 'Invalid URL format');

// Create the SQL client
const sql = neon(databaseUrl);

// Create the database instance
export const db = drizzle(sql, { schema });

// Export a health check function
export async function checkDatabaseConnection() {
  try {
    // Try a simple query to check connection
    await sql`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
} 