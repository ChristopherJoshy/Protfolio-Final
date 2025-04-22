import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';

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
          <Card key={i} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
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
        <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-full mx-auto flex items-center justify-center mb-4`}>
          <i className="ri-error-warning-line text-2xl text-red-500"></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">Error Loading Repositories</h3>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{error}</p>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-full mx-auto flex items-center justify-center mb-4`}>
          <i className="ri-git-repository-line text-2xl text-primary-400"></i>
        </div>
        <h3 className="text-xl font-semibold mb-2">No Repositories Found</h3>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>No repositories with stars were found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repositories.map((repo) => (
        <Card 
          key={repo.name} 
          className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors duration-300`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <a 
                  href={repo.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors duration-300"
                >
                  {repo.name}
                </a>
              </h3>
              <Badge variant="secondary" className={theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}>
                <i className="ri-star-line mr-1"></i>
                {repo.stars}
              </Badge>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>{repo.description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-200'}>
                {repo.language}
              </Badge>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
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