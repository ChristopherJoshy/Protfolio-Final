import { VercelRequest, VercelResponse } from '@vercel/node';

// Hardcoded GitHub token for GitHub Pages deployment
const GITHUB_TOKEN = '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3';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[API] GitHub API request received');
  
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
    console.log('[API] Using hardcoded GitHub token');
    
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      console.error(`[API] GitHub API error: ${response.status}`);
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = await response.json();
    console.log(`[API] Successfully fetched ${repos.length} GitHub repositories`);
    
    // Transform and clean up the data
    const formattedRepos = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at
    }));

    return res.status(200).json(formattedRepos);
  } catch (error) {
    console.error('[API] Error fetching GitHub repos:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch GitHub repositories',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 