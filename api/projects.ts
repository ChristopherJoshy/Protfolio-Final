import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { initDB } from './_utils';
import { insertProjectSchema, projects } from '../shared/schema';

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

  // Projects routes
  if (req.method === 'GET') {
    const { id, featured } = req.query;
    
    // Get a specific project by ID
    if (id) {
      const projectId = parseInt(id as string);
      if (isNaN(projectId)) {
        return res.status(400).json({ error: 'Invalid project ID' });
      }
      
      try {
        const result = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
        if (result.length === 0) {
          return res.status(404).json({ error: 'Project not found' });
        }
        return res.json(result[0]);
      } catch (error) {
        console.error('Error getting project:', error);
        return res.status(500).json({ error: 'Failed to fetch project' });
      }
    }
    
    // Get featured projects
    if (featured === 'true') {
      try {
        const featuredProjects = await db.select().from(projects)
          .where(eq(projects.featured, true))
          .orderBy(projects.createdAt);
        console.log(`Retrieved ${featuredProjects.length} featured projects`);
        return res.json(featuredProjects);
      } catch (error) {
        console.error('Error getting featured projects:', error);
        return res.status(500).json({ error: 'Failed to fetch featured projects' });
      }
    }
    
    // Get all projects
    try {
      const projectsList = await db.select().from(projects).orderBy(projects.createdAt);
      console.log(`Retrieved ${projectsList.length} projects from database`);
      return res.json(projectsList);
    } catch (error) {
      console.error('Error getting projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  // Create a project
  if (req.method === 'POST') {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const result = await db.insert(projects).values(projectData).returning();
      console.log('Project created successfully', result[0].title);
      return res.status(201).json(result[0]);
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
      const result = await db.update(projects).set(projectData)
        .where(eq(projects.id, projectId)).returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      console.log('Project updated successfully', result[0].title);
      return res.json(result[0]);
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
    
    try {
      const result = await db.delete(projects)
        .where(eq(projects.id, projectId)).returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      console.log('Project deleted successfully', projectId);
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
} 