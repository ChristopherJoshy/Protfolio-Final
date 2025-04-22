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
    const GITHUB_TOKEN = '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';

    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();
    
    // Transform the response to match our frontend needs
    const formattedRepos = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description || 'No description available',
      language: repo.language || 'Unknown',
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      html_url: repo.html_url,
      languages: [repo.language].filter(Boolean) // Start with primary language
    }));

    // Get languages for each repo
    const reposWithLanguages = await Promise.all(
      formattedRepos.map(async (repo: any) => {
        const languagesResponse = await fetch(repo.languages_url, {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (languagesResponse.ok) {
          const languages = await languagesResponse.json();
          repo.languages = Object.keys(languages);
        }

        return repo;
      })
    );

    res.json(reposWithLanguages);
  } catch (error) {
    console.error('Error in GitHub API:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

export default app;