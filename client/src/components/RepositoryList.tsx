import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/hooks/useTheme';

interface Repository {
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  updated_at: string;
}

const RepositoryList = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch('https://api.github.com/users/ChristopherJoshy/repos');
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        
        // Filter repositories with 1 or more stars and sort by stars
        const filteredRepos = data
          .filter((repo: any) => repo.stargazers_count > 0)
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
          .map((repo: any) => ({
            name: repo.name,
            description: repo.description || 'No description available',
            stars: repo.stargazers_count,
            language: repo.language || 'Unknown',
            url: repo.html_url,
            updated_at: new Date(repo.updated_at).toLocaleDateString()
          }));
        
        setRepositories(filteredRepos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="card">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 card rounded-full mx-auto flex items-center justify-center mb-4">
          <i className="ri-error-warning-line text-2xl text-error"></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">Error Loading Repositories</h3>
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 card rounded-full mx-auto flex items-center justify-center mb-4">
          <i className="ri-git-repository-line text-2xl text-primary"></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Repositories Found</h3>
        <p className="text-text-secondary">No repositories with stars were found.</p>
      </div>
    );
  }

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3776ab',
      Java: '#b07219',
      'C++': '#f34b7d',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Unknown: '#6b7280'
    };
    return colors[language] || colors.Unknown;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <Card key={repo.name} className="card group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">
                <a 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-text hover:text-primary transition-colors duration-300"
                >
                  {repo.name}
                </a>
              </h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <i className="ri-star-line mr-1"></i>
                {repo.stars}
              </Badge>
            </div>
            <p className="text-text-secondary mb-4 line-clamp-2">{repo.description}</p>
            <div className="flex items-center justify-between">
              <Badge 
                variant="outline" 
                className="border-border flex items-center gap-2"
                style={{ 
                  backgroundColor: `${getLanguageColor(repo.language)}15`,
                  borderColor: `${getLanguageColor(repo.language)}30`,
                  color: getLanguageColor(repo.language)
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                {repo.language}
              </Badge>
              <span className="text-sm text-text-muted">
                Updated {repo.updated_at}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RepositoryList; 