import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { initDB } from './_utils';
import { insertCertificateSchema, certificates } from '../shared/schema';

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

  // Get certificates
  if (req.method === 'GET') {
    try {
      const certificatesList = await db.select().from(certificates).orderBy(certificates.createdAt);
      console.log(`Retrieved ${certificatesList.length} certificates from database`);
      return res.json(certificatesList);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return res.status(500).json({ error: 'Failed to fetch certificates' });
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
} 