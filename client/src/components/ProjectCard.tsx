import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { type Project } from '@shared/schema';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard = ({ project, className = '' }: ProjectCardProps) => {
  const { id, title, description, techStack, githubLink, demoLink, featured } = project;
  
  // Split techStack string into array
  const technologies = techStack.split(',').map(tech => tech.trim());
  
  // Determine gradient based on title
  const getGradient = (title: string) => {
    if (title.toLowerCase().includes('ai') || title.toLowerCase().includes('mind')) {
      return 'from-green-500 to-teal-600';
    }
    return 'from-blue-500 to-purple-600';
  };
  
  return (
    <Card className={`bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 transition-transform duration-300 ${className}`}>
      <div className="relative">
        <div className={`h-48 bg-gradient-to-r ${getGradient(title)} flex items-center justify-center`}>
          <i className={`${title.toLowerCase().includes('ai') ? 'ri-brain-line' : 'ri-book-open-line'} text-6xl text-white`}></i>
        </div>
        {featured && (
          <div className="absolute top-4 right-4 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold font-space">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {technologies.slice(0, 2).map((tech, index) => (
              <Badge key={index} variant="outline" className="bg-gray-700 text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-gray-400 mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            {/* This would be dynamic in a real implementation */}
            <li className="flex items-start gap-2">
              <i className="ri-check-line text-secondary-500 mt-1"></i>
              <span>{title.includes('KKNotes') ? 'Organized study materials' : 'AI-Powered Analysis'}</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line text-secondary-500 mt-1"></i>
              <span>{title.includes('KKNotes') ? 'Video Tutorials' : 'Personalized Learning'}</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line text-secondary-500 mt-1"></i>
              <span>{title.includes('KKNotes') ? 'PWA Support' : 'Smart Recommendations'}</span>
            </li>
          </ul>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            {githubLink && (
              <a 
                href={githubLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-400 hover:text-primary-300 transition-colors duration-300"
              >
                <i className="ri-github-line text-lg"></i>
              </a>
            )}
            {demoLink && (
              <a 
                href={demoLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-400 hover:text-primary-300 transition-colors duration-300"
              >
                <i className="ri-external-link-line text-lg"></i>
              </a>
            )}
          </div>
          <Link href={`/project/${id}`}>
            <Button variant="default" size="sm" className="bg-primary-600 hover:bg-primary-700">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
