import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertProjectSchema } from '../shared/schema';

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

  // Projects routes
  if (req.method === 'GET') {
    const { id, featured } = req.query;
    
    // Get a specific project by ID
    if (id) {
      const projectId = parseInt(id as string);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: 'Invalid project ID' });
      }
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      return res.json(project);
    }
    
    // Get featured projects
    if (featured === 'true') {
      const projects = await storage.getFeaturedProjects();
      return res.json(projects);
    }
    
    // Get all projects
    const projects = await storage.getProjects();
    return res.json(projects);
  }

  // Create a project
  if (req.method === 'POST') {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      return res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(400).json({ error: 'Invalid project data' });
    }
  }

  // Update a project
  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const projectId = parseInt(id as string);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    
    try {
      const projectData = req.body;
      const project = await storage.updateProject(projectId, projectData);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      return res.json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      return res.status(400).json({ error: 'Invalid project data' });
    }
  }

  // Delete a project
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }
    
    const projectId = parseInt(id as string);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    
    const success = await storage.deleteProject(projectId);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    return res.status(204).end();
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
} 