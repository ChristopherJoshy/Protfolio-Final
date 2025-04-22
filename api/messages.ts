import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { initDB } from './_utils';
import { insertMessageSchema, messages } from '../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Initialize DB connection
  const db = initDB();

  // Handle GET request
  if (req.method === 'GET') {
    try {
      const messagesList = await db.select().from(messages).orderBy(messages.createdAt);
      console.log(`Retrieved ${messagesList.length} messages from database`);
      return res.status(200).json(messagesList);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const result = await db.insert(messages).values(messageData).returning();
      console.log('Message created successfully from', result[0].email);
      return res.status(201).json(result[0]);
    } catch (error) {
      console.error('Error creating message:', error);
      return res.status(400).json({ error: 'Invalid message data' });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
} 