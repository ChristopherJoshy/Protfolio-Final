import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Initialize database connection
export function initDB() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IUcurO9YfXP1@ep-broad-star-a49b8m9i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  // Create a neon client with the connection string
  const sql = neon(connectionString);
  
  // Pass the client to drizzle correctly using the HTTP adapter
  return drizzle(sql);
} 