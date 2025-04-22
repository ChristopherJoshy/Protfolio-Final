import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IUcurO9YfXP1@ep-broad-star-a49b8m9i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

// Ensure we have a database URL
if (!databaseUrl) {
  console.error('⚠️ DATABASE_URL is not set, using fallback failed');
  throw new Error('DATABASE_URL is not set in environment variables');
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