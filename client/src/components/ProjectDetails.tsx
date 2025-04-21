import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Project } from "@shared/schema";

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  const { title, description, techStack, githubLink, demoLink, featured } = project;
  
  // Split techStack string into array
  const technologies = techStack.split(',').map(tech => tech.trim());
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl md:text-4xl font-bold font-space">{title}</h1>
        {featured && (
          <Badge className="bg-secondary-500 hover:bg-secondary-600">Featured Project</Badge>
        )}
      </div>
      
      <p className="text-gray-300 text-lg">{description}</p>
      
      <div>
        <h2 className="text-xl font-semibold mb-3">Technologies Used</h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 py-1 px-3">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {demoLink && (
          <Button asChild className="bg-primary-600 hover:bg-primary-700">
            <a href={demoLink} target="_blank" rel="noopener noreferrer">
              <i className="ri-global-line mr-2"></i>
              Live Demo
            </a>
          </Button>
        )}
        {githubLink && (
          <Button asChild variant="outline" className="bg-gray-700 hover:bg-gray-600">
            <a href={githubLink} target="_blank" rel="noopener noreferrer">
              <i className="ri-github-line mr-2"></i>
              View Code
            </a>
          </Button>
        )}
        <Link href="/#projects">
          <Button variant="ghost">
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Projects
          </Button>
        </Link>
      </div>
      
      <div className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
        <p className="text-gray-300">
          {title.includes('KKNotes') 
            ? 'KKNotes is a comprehensive web application designed to provide KTU Computer Science Engineering students with easy access to high-quality study materials, including notes and video tutorials. The platform features a modern, responsive design that works seamlessly on both desktop and mobile devices.'
            : 'MaestraMind is a solo-developer-friendly adaptive learning web application that allows users to upload one or multiple notes. The app uses Google\'s Gemini API to analyze these notes and automatically generate an adaptive learning curriculum tailored to the user\'s needs.'}
        </p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        <ul className="space-y-2 text-gray-300">
          {title.includes('KKNotes') ? (
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
    </div>
  );
};

export default ProjectDetails;
