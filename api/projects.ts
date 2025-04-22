import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { initDB } from './_utils.js';
import { insertProjectSchema, projects } from '../shared/schema';

// Hardcoded fallback projects data
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "KKNotesV2",
    description: "A premium resource hub for KTU Computer Science Engineering study materials featuring high-quality notes and curated video tutorials.",
    techStack: "JavaScript, HTML, CSS",
    imageUrl: null,
    demoLink: "https://kknotes.vercel.app",
    githubLink: "https://github.com/ChristopherJoshy/KKNotes",
    featured: true,
    createdAt: new Date("2023-08-01").toISOString()
  },
  {
    id: 2,
    title: "MaestraMind",
    description: "An AI-powered adaptive learning web application that transforms study notes into personalized learning experiences using Google's Gemini API.",
    techStack: "JavaScript, HTML/CSS, Firebase, Gemini API",
    imageUrl: null,
    demoLink: "https://maestramind.vercel.app",
    githubLink: "https://github.com/ChristopherJoshy/MaestraMind",
    featured: true,
    createdAt: new Date("2023-11-01").toISOString()
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API] ${req.method} /api/projects - Request received`);
  
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

    // Projects routes
    if (req.method === 'GET') {
      const { id, featured } = req.query;
      console.log('[API] Handling GET request for projects', { id, featured });
      
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
          // Find in fallback data
          const fallbackProject = FALLBACK_PROJECTS.find(p => p.id === projectId);
          if (fallbackProject) {
            console.log('[API] Using fallback project data for ID', projectId);
            return res.json(fallbackProject);
          }
          return res.status(404).json({ error: 'Project not found' });
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
          // Use fallback featured projects
          const fallbackFeatured = FALLBACK_PROJECTS.filter(p => p.featured);
          console.log('[API] Using fallback featured projects data');
          return res.json(fallbackFeatured);
        }
      }
      
      // Get all projects
      try {
        const projectsList = await db.select().from(projects).orderBy(projects.createdAt);
        console.log(`Retrieved ${projectsList.length} projects from database`);
        return res.json(projectsList);
      } catch (error) {
        console.error('Error getting projects:', error);
        console.log('[API] Using fallback projects data');
        return res.json(FALLBACK_PROJECTS);
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
    console.log(`[API] Method ${req.method} not allowed`);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[API] Unhandled error:', error);
    
    // Fall back to hardcoded data for GET requests
    if (req.method === 'GET') {
      const { id, featured } = req.query;
      
      if (id) {
        const projectId = parseInt(id as string);
        const fallbackProject = FALLBACK_PROJECTS.find(p => p.id === projectId);
        if (!isNaN(projectId) && fallbackProject) {
          console.log('[API] Returning hardcoded fallback project for ID', projectId);
          return res.status(200).json(fallbackProject);
        }
      }
      
      if (featured === 'true') {
        console.log('[API] Returning hardcoded fallback featured projects');
        return res.status(200).json(FALLBACK_PROJECTS.filter(p => p.featured));
      }
      
      console.log('[API] Returning all hardcoded fallback projects');
      return res.status(200).json(FALLBACK_PROJECTS);
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 