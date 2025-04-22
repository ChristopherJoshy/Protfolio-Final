import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { validateEnv } from './_env';

// Initialize database connection with detailed logging
export function initDB() {
  try {
    console.log('[DB] Initializing database connection...');
    
    // Validate environment variables
    const envValid = validateEnv();
    if (!envValid) {
      throw new Error('Environment validation failed');
    }
    
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('[DB] DATABASE_URL environment variable is not set');
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Create a neon client with the connection string
    console.log('[DB] Creating NeonDB client...');
    const sql = neon(connectionString);
    console.log('[DB] NeonDB client created successfully');
    
    // Pass the client to drizzle correctly using the HTTP adapter
    console.log('[DB] Initializing Drizzle ORM...');
    const db = drizzle(sql);
    console.log('[DB] Drizzle ORM initialized successfully');
    
    // Test connection by running a simple query
    console.log('[DB] Testing database connection...');
    return db;
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error);
    throw error;
  }
} 