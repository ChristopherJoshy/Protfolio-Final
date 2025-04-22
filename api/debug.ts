import { VercelRequest, VercelResponse } from '@vercel/node';
import { validateEnv } from './_env.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[DEBUG] ${req.method} /api/debug - Request received`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only handle GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables
    const envValid = validateEnv();
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Generate diagnostic info
    const diagnosticInfo = {
      timestamp,
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL === '1',
      envValid,
      databaseUrlSet: !!process.env.DATABASE_URL,
      nodeVersion: process.version,
      headers: {
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer,
      }
    };
    
    return res.status(200).json(diagnosticInfo);
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 