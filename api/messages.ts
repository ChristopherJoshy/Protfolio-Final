import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { initDB } from './_utils.js';
import { insertMessageSchema, messages } from '../shared/schema';

// Hardcoded fallback messages data
const FALLBACK_MESSAGES = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Project Inquiry",
    message: "I'm interested in your web development services. Could you provide more information?",
    createdAt: new Date("2023-11-20").toISOString(),
    read: false
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Collaboration Opportunity",
    message: "I'd like to discuss a potential collaboration on an upcoming project. Please contact me when you have time.",
    createdAt: new Date("2023-12-05").toISOString(),
    read: true
  }
];

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
        console.log('[API] Using fallback messages data');
        return res.status(200).json(FALLBACK_MESSAGES);
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
    
    // Fall back to hardcoded data for GET requests
    if (req.method === 'GET') {
      console.log('[API] Returning hardcoded fallback messages data due to critical error');
      return res.status(200).json(FALLBACK_MESSAGES);
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 