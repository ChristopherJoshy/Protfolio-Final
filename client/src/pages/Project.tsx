import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type Project } from '@shared/schema';

const ProjectPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const projectId = id ? parseInt(id) : undefined;
  
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });
  
  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 pb-12 bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (error || !project) {
    return (
      <>
        <Header />
        <div className="min-h-screen pt-24 pb-12 bg-gray-900 flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8 text-center">Sorry, the project you're looking for doesn't exist or there was an error loading it.</p>
          <Link href="/#projects">
            <Button className="bg-primary-600 hover:bg-primary-700">
              Back to Projects
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  // Split techStack string into array
  const technologies = project.techStack.split(',').map(tech => tech.trim());
  
  // Determine gradient based on title
  const getGradient = (title: string) => {
    if (title.toLowerCase().includes('ai') || title.toLowerCase().includes('mind')) {
      return 'from-green-500 to-teal-600';
    }
    return 'from-blue-500 to-purple-600';
  };
  
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-12 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <Link href="/#projects">
              <Button variant="link" className="text-primary-400 px-0">
                <i className="ri-arrow-left-line mr-2"></i>
                Back to Projects
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
                <div className={`h-64 bg-gradient-to-r ${getGradient(project.title)} flex items-center justify-center`}>
                  <i className={`${project.title.toLowerCase().includes('ai') ? 'ri-brain-line' : 'ri-book-open-line'} text-8xl text-white opacity-50`}></i>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold font-space">{project.title}</h1>
                    {project.featured && (
                      <Badge className="bg-secondary-500 hover:bg-secondary-600">Featured Project</Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-8">{project.description}</p>
                  
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2">
                      {technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 py-1 px-3">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    {project.demoLink && (
                      <Button asChild className="bg-primary-600 hover:bg-primary-700">
                        <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                          <i className="ri-global-line mr-2"></i>
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubLink && (
                      <Button asChild variant="outline" className="bg-gray-700 hover:bg-gray-600">
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                          <i className="ri-github-line mr-2"></i>
                          View Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Overview</h3>
                    <p className="text-gray-300">
                      {project.title.includes('KKNotes') 
                        ? 'KKNotes is a comprehensive web application designed to provide KTU Computer Science Engineering students with easy access to high-quality study materials, including notes and video tutorials. The platform features a modern, responsive design that works seamlessly on both desktop and mobile devices.'
                        : 'MaestraMind is a solo-developer-friendly adaptive learning web application that allows users to upload one or multiple notes. The app uses Google\'s Gemini API to analyze these notes and automatically generate an adaptive learning curriculum tailored to the user\'s needs.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Key Features</h3>
                    <ul className="space-y-2 text-gray-300">
                      {project.title.includes('KKNotes') ? (
                        <>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Semester-wise Notes: Access organized study materials for all semesters</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Video Tutorials: Watch curated video content for each subject</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Global Chat: Connect with other students and share resources</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>PWA Support: Install as a standalone app on your device</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Dark/Light Mode: Choose your preferred theme</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Upload Multiple Notes (text input or file)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Gemini AI-Powered Note Analysis</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Auto-Generated Courses and Topics</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>Personalized Adaptive Learning Paths</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <i className="ri-check-line text-secondary-500 mt-1"></i>
                            <span>AI-Generated Summaries, Flashcards, and Quizzes</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Development Process</h3>
                    <p className="text-gray-300">
                      {project.title.includes('KKNotes')
                        ? 'The development of KKNotes involved extensive research on the needs of computer science students, followed by a user-centered design approach. The platform was built using modern web technologies to ensure a responsive and intuitive user experience.'
                        : 'MaestraMind was developed with a focus on creating a seamless learning experience powered by AI. The integration with Google\'s Gemini API required extensive testing to ensure the generated learning materials were accurate and pedagogically sound.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Challenges & Solutions</h3>
                    <p className="text-gray-300">
                      {project.title.includes('KKNotes')
                        ? 'One of the main challenges was organizing a vast amount of study materials in an accessible way. This was addressed by implementing a well-structured navigation system and search functionality to help students quickly find relevant resources.'
                        : 'A significant challenge was creating an algorithm that could effectively parse and understand various note formats. This was solved by implementing a flexible pre-processing system before feeding the data to the Gemini API.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Project Info</h2>
                  <Separator className="mb-4 bg-gray-700" />
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Project Type</h3>
                      <p className="font-semibold">
                        {project.title.includes('KKNotes') ? 'Educational Platform' : 'AI Learning Tool'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Date</h3>
                      <p className="font-semibold">
                        {project.title.includes('KKNotes') ? 'September 2023' : 'February 2024'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">Role</h3>
                      <p className="font-semibold">Full Stack Developer</p>
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    <div className="pt-2">
                      <h3 className="text-lg font-medium mb-3">Related Projects</h3>
                      <div className="space-y-3">
                        {allProjects
                          .filter(p => p.id !== project.id) // Exclude current project
                          .slice(0, 2) // Show only 2 related projects
                          .map(relatedProject => (
                            <Link 
                              key={relatedProject.id} 
                              href={`/project/${relatedProject.id}`}
                              className="block p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                            >
                              <h4 className="font-medium">{relatedProject.title}</h4>
                              <p className="text-sm text-gray-300">{relatedProject.description}</p>
                            </Link>
                          ))}
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    <div className="pt-2">
                      <h3 className="text-lg font-medium mb-3">Share Project</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="bg-gray-700 hover:bg-blue-600 rounded-full h-10 w-10">
                          <i className="ri-twitter-x-line"></i>
                        </Button>
                        <Button variant="outline" size="icon" className="bg-gray-700 hover:bg-blue-700 rounded-full h-10 w-10">
                          <i className="ri-linkedin-fill"></i>
                        </Button>
                        <Button variant="outline" size="icon" className="bg-gray-700 hover:bg-gray-600 rounded-full h-10 w-10">
                          <i className="ri-link"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProjectPage;
