import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertCertificateSchema } from '../shared/schema';

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

  // Get certificates
  if (req.method === 'GET') {
    try {
      const certificates = await storage.getCertificates();
      return res.json(certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  }

  // Create a certificate
  if (req.method === 'POST') {
    try {
      const certificateData = insertCertificateSchema.parse(req.body);
      const certificate = await storage.createCertificate(certificateData);
      return res.status(201).json(certificate);
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
      const certificate = await storage.updateCertificate(certificateId, certificateData);
      
      if (!certificate) {
        return res.status(404).json({ error: 'Certificate not found' });
      }
      
      return res.json(certificate);
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
    
    const success = await storage.deleteCertificate(certificateId);
    if (!success) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    return res.status(204).end();
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
} 