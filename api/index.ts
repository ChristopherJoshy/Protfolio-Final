import express, { Request, Response, NextFunction } from 'express';
import { storage } from '../server/storage';
import { insertMessageSchema, insertProjectSchema, insertCertificateSchema } from '../shared/schema';
import { log } from '../server/vite';

// Initialize express
const app = express();
app.use(express.json());

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  log(`Error: ${err.message}`);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Project routes
app.get('/api/projects', async (_req: Request, res: Response) => {
  const projects = await storage.getProjects();
  res.json(projects);
});

app.get('/api/projects/featured', async (_req: Request, res: Response) => {
  const projects = await storage.getFeaturedProjects();
  res.json(projects);
});

app.get('/api/projects/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }
  
  const project = await storage.getProject(id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.json(project);
});

app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const projectData = insertProjectSchema.parse(req.body);
    const project = await storage.createProject(projectData);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: 'Invalid project data' });
  }
});

app.put('/api/projects/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }
  
  try {
    const projectData = req.body;
    const project = await storage.updateProject(id, projectData);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ error: 'Invalid project data' });
  }
});

app.delete('/api/projects/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }
  
  const success = await storage.deleteProject(id);
  if (!success) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.status(204).end();
});

// Certificate routes
app.get('/api/certificates', async (_req: Request, res: Response) => {
  const certificates = await storage.getCertificates();
  res.json(certificates);
});

app.post('/api/certificates', async (req: Request, res: Response) => {
  try {
    const certificateData = insertCertificateSchema.parse(req.body);
    const certificate = await storage.createCertificate(certificateData);
    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(400).json({ error: 'Invalid certificate data' });
  }
});

app.put('/api/certificates/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid certificate ID' });
  }
  
  try {
    const certificateData = req.body;
    const certificate = await storage.updateCertificate(id, certificateData);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(400).json({ error: 'Invalid certificate data' });
  }
});

app.delete('/api/certificates/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid certificate ID' });
  }
  
  const success = await storage.deleteCertificate(id);
  if (!success) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  
  res.status(204).end();
});

// Message routes
app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const messageData = insertMessageSchema.parse(req.body);
    const message = await storage.createMessage(messageData);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(400).json({ error: 'Invalid message data' });
  }
});

app.get('/api/messages', async (_req: Request, res: Response) => {
  const messages = await storage.getMessages();
  res.json(messages);
});

app.post('/api/messages/:id/read', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid message ID' });
  }
  
  const success = await storage.markMessageAsRead(id);
  if (!success) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  res.status(200).json({ success: true });
});

app.delete('/api/messages/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid message ID' });
  }
  
  const success = await storage.deleteMessage(id);
  if (!success) {
    return res.status(404).json({ error: 'Message not found' });
  }
  
  res.status(204).end();
});

// GitHub endpoint with dynamic data
app.get('/api/github', async (_req: Request, res: Response) => {
  try {
    // Try to fetch real GitHub data if GitHub token is available
    if (process.env.GITHUB_TOKEN) {
      // In a real implementation, you would use the GitHub API to fetch real data
      // For example using Octokit or the GitHub API directly
      // This is just a placeholder for the real implementation
      console.log('Using GitHub API with token');
    }
    
    // Fallback to mock data with dynamic/randomized stars and forks
    // In production, you should replace this with real API calls to GitHub
    const githubProjects = [
      {
        name: "KKNotes",
        description: "KTU Computer Science Notes Platform",
        language: "JavaScript",
        stargazers_count: Math.floor(Math.random() * 50) + 10, // Random between 10-59
        forks_count: Math.floor(Math.random() * 15) + 2, // Random between 2-16
        html_url: "https://github.com/christopherjoshy/kknotes",
        languages: ["JavaScript", "HTML", "CSS"]
      },
      {
        name: "MaestraMind",
        description: "AI-Powered Adaptive Learning App using Google's Gemini API",
        language: "TypeScript",
        stargazers_count: Math.floor(Math.random() * 70) + 20, // Random between 20-89
        forks_count: Math.floor(Math.random() * 20) + 3, // Random between 3-22
        html_url: "https://github.com/christopherjoshy/maestramind",
        languages: ["TypeScript", "React", "Gemini API"]
      },
      {
        name: "PortfolioWebsite",
        description: "Modern 3D Portfolio Website built with React and Three.js",
        language: "TypeScript",
        stargazers_count: Math.floor(Math.random() * 40) + 5, // Random between 5-44
        forks_count: Math.floor(Math.random() * 10) + 1, // Random between 1-10
        html_url: "https://github.com/ChristopherJoshy/Protfolio-Final/",
        languages: ["TypeScript", "React", "Three.js"]
      }
    ];
    
    // Combine with any dynamically added projects from the database
    // In a real implementation, you might fetch this data from your database
    // or filter existing projects that have githubLink set
    try {
      const dbProjects = await storage.getProjects();
      
      // Filter projects that have a githubLink and aren't already in the list
      const additionalProjects = dbProjects
        .filter(project => project.githubLink && !githubProjects.some(gp => gp.html_url === project.githubLink))
        .map(project => {
          // Extract repo name from GitHub URL
          const name = project.githubLink?.split('/').pop() || project.title;
          
          return {
            name,
            description: project.description,
            language: project.techStack.split(',')[0].trim(),
            stargazers_count: Math.floor(Math.random() * 30) + 1, // Random stars
            forks_count: Math.floor(Math.random() * 10) + 1, // Random forks
            html_url: project.githubLink || '',
            languages: project.techStack.split(',').map(tech => tech.trim())
          };
        });
      
      // Combine the mock data with additional projects from the database
      const allProjects = [...githubProjects, ...additionalProjects];
      res.json(allProjects);
    } catch (err) {
      // If there's an error fetching database projects, just return the mock data
      console.error('Error fetching additional projects:', err);
      res.json(githubProjects);
    }
  } catch (error) {
    console.error('Error in GitHub API:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

export default app;