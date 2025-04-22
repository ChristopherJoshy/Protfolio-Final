import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { initDB } from './_utils.js';
import { insertCertificateSchema, certificates } from '../shared/schema';

// Hardcoded fallback certificates data
const FALLBACK_CERTIFICATES = [
  {
    id: 1,
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    date: "June 2023",
    credentialUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    imageUrl: null,
    createdAt: new Date("2023-06-01").toISOString()
  },
  {
    id: 2,
    title: "React.js Developer",
    issuer: "Meta",
    date: "September 2023",
    credentialUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    imageUrl: null,
    createdAt: new Date("2023-09-01").toISOString()
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API] ${req.method} /api/certificates - Request received`);
  
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

    // Get certificates
    if (req.method === 'GET') {
      console.log('[API] Handling GET request for certificates');
      try {
        const certificatesList = await db.select().from(certificates).orderBy(certificates.createdAt);
        console.log(`[API] Retrieved ${certificatesList.length} certificates from database`);
        return res.status(200).json(certificatesList);
      } catch (error) {
        console.error('[API] Error fetching certificates:', error);
        console.log('[API] Using fallback certificates data');
        return res.status(200).json(FALLBACK_CERTIFICATES);
      }
    }

    // Create a certificate
    if (req.method === 'POST') {
      try {
        const certificateData = insertCertificateSchema.parse(req.body);
        const result = await db.insert(certificates).values(certificateData).returning();
        console.log('Certificate created successfully', result[0].title);
        return res.status(201).json(result[0]);
      } catch (error) {
        console.error('Error creating certificate:', error);
        return res.status(400).json({ error: 'Invalid certificate data' });
      }
    }

    // Update a certificate
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Certificate ID is required' });
      }
      
      const certificateId = parseInt(id as string);
      if (isNaN(certificateId)) {
        return res.status(400).json({ error: 'Invalid certificate ID' });
      }
      
      try {
        const certificateData = req.body;
        const result = await db.update(certificates).set(certificateData)
          .where(eq(certificates.id, certificateId)).returning();
        
        if (result.length === 0) {
          return res.status(404).json({ error: 'Certificate not found' });
        }
        
        console.log('Certificate updated successfully', result[0].title);
        return res.json(result[0]);
      } catch (error) {
        console.error('Error updating certificate:', error);
        return res.status(400).json({ error: 'Invalid certificate data' });
      }
    }

    // Delete a certificate
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Certificate ID is required' });
      }
      
      const certificateId = parseInt(id as string);
      if (isNaN(certificateId)) {
        return res.status(400).json({ error: 'Invalid certificate ID' });
      }
      
      try {
        const result = await db.delete(certificates)
          .where(eq(certificates.id, certificateId)).returning();
        
        if (result.length === 0) {
          return res.status(404).json({ error: 'Certificate not found' });
        }
        
        console.log('Certificate deleted successfully', certificateId);
        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting certificate:', error);
        return res.status(500).json({ error: 'Failed to delete certificate' });
      }
    }

    // Handle unsupported methods
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API] Unhandled error:', error);
    
    // Fall back to hardcoded data for GET requests
    if (req.method === 'GET') {
      console.log('[API] Returning hardcoded fallback certificates data due to critical error');
      return res.status(200).json(FALLBACK_CERTIFICATES);
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 