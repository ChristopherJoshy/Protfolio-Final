import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { validateEnv } from './_env.js';

// Initialize database connection with detailed logging
export function initDB() {
  try {
    console.log('[DB] Initializing database connection...');
    
    // Validate environment variables
    const envValid = validateEnv();
    if (!envValid) {
      throw new Error('Environment validation failed');
    }
    
    // Extra safety check for DATABASE_URL
    let connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn('[DB] DATABASE_URL not found in process.env, using fallback from vercel.json');
      connectionString = 'postgresql://neondb_owner:npg_IUcurO9YfXP1@ep-broad-star-a49b8m9i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
    }
    
    if (!connectionString) {
      console.error('[DB] No DATABASE_URL available after fallback attempt');
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Create a neon client with the connection string
    console.log('[DB] Creating NeonDB client with connection string...');
    const sql = neon(connectionString);
    console.log('[DB] NeonDB client created successfully');
    
    // Test the connection by running a simple query
    console.log('[DB] Testing database connection...');
    sql`SELECT 1`.then(() => {
      console.log('[DB] Database connection test successful');
    }).catch(err => {
      console.error('[DB] Database connection test failed:', err);
    });
    
    // Pass the client to drizzle correctly using the HTTP adapter
    console.log('[DB] Initializing Drizzle ORM...');
    const db = drizzle(sql);
    console.log('[DB] Drizzle ORM initialized successfully');
    
    return db;
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('[DB] Error name:', error.name);
      console.error('[DB] Error message:', error.message);
      console.error('[DB] Error stack:', error.stack);
    }
    
    throw error;
  }
} 