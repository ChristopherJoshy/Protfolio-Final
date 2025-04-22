import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { initDB } from './_utils';
import { insertMessageSchema, messages } from '../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API] ${req.method} /api/messages - Request received`);
  console.log('Request body:', JSON.stringify(req.body));
  console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL
  });
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  console.log('[API] CORS headers set');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    console.log('[API] Handling OPTIONS request');
    return res.status(200).end();
  }

  try {
    // Initialize DB connection
    console.log('[API] Initializing database connection');
    const db = initDB();
    console.log('[API] Database connection established');

    // Handle GET request
    if (req.method === 'GET') {
      console.log('[API] Handling GET request');
      try {
        const messagesList = await db.select().from(messages).orderBy(messages.createdAt);
        console.log(`[API] Retrieved ${messagesList.length} messages from database`);
        return res.status(200).json(messagesList);
      } catch (error) {
        console.error('[API] Error fetching messages:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch messages',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Handle POST request
    if (req.method === 'POST') {
      console.log('[API] Handling POST request');
      try {
        console.log('[API] Parsing message data');
        const messageData = insertMessageSchema.parse(req.body);
        console.log('[API] Message data validation successful:', messageData);
        
        console.log('[API] Inserting message into database');
        const result = await db.insert(messages).values(messageData).returning();
        console.log('[API] Message created successfully:', result[0]);
        
        return res.status(201).json(result[0]);
      } catch (error) {
        console.error('[API] Error creating message:', error);
        return res.status(400).json({ 
          error: 'Invalid message data',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Handle unsupported methods
    console.log(`[API] Method ${req.method} not allowed`);
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });
  } catch (error) {
    console.error('[API] Unhandled error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 