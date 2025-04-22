import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ThreeBackground from '@/components/ThreeBackground';
import SkillVisualization from '@/components/SkillVisualization';
import ProjectCard from '@/components/ProjectCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { apiRequest } from '@/lib/queryClient';
import { type Project, type InsertMessage, type Certificate } from '@shared/schema';
import CertificateCard from "@/components/CertificateCard";
import RepositoryList from '@/components/RepositoryList';

const Home = () => {
  const { toast } = useToast();
  
  // Refs for scroll
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const certificatesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  
  // Orbit animation state
  const [orbitAngle, setOrbitAngle] = useState(0);
  
  // Form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // Form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data: InsertMessage = {
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject,
        message: contactForm.message
      };
      
      const res = await apiRequest('POST', '/api/messages', data);
      const result = await res.json();
      
      if (result.success) {
        toast({
          title: "Message Sent",
          description: "Thank you for your message. I'll get back to you soon!",
        });
        
        // Reset form
        setContactForm({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  // Fetch projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  // Fetch GitHub repos
  const { data: repos = [], error: githubError } = useQuery<any[]>({
    queryKey: ['/api/github'],
    retry: 1, // Only retry once on failure
  });
  
  // Fetch certificates
  const { data: certificates = [] } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
  });
  
  // Orbit animation effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setOrbitAngle(prev => (prev + 0.01) % (Math.PI * 2));
    }, 50);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Skill data for visualization
  const skills = [
    { name: 'JavaScript', level: 90, color: '#f0db4f' },
    { name: 'React', level: 85, color: '#61dbfb' },
    { name: 'Node.js', level: 80, color: '#3c873a' },
    { name: 'Python', level: 75, color: '#306998' },
    { name: 'Java', level: 70, color: '#f89820' },
    { name: 'C++', level: 65, color: '#9c033a' },
    { name: 'Three.js', level: 60, color: '#049EF4' },
  ];
  
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <ThreeBackground />
          <div className="container mx-auto px-6 py-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h1 className="text-4xl md:text-6xl font-bold font-space mb-4">
                  <span className="block">Hi, I'm</span>
                  <span className="text-primary-500 block">Christopher Joshy</span>
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-400 font-medium mb-6">Full Stack Developer & Computer Science Student</h2>
                <p className="text-gray-300 mb-8 text-lg max-w-lg">
                  Passionate about full stack development, game programming, and AI. 
                  Looking to contribute to innovative tech projects and grow professionally.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <i className="ri-code-box-line mr-2"></i>
                    View Projects
                  </Button>
                  <Button 
                    onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
                    variant="outline"
                    className="bg-gray-800 hover:bg-gray-700"
                  >
                    <i className="ri-mail-line mr-2"></i>
                    Contact Me
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="bg-gray-800 hover:bg-gray-700"
                  >
                    <a href="https://github.com/ChristopherJoshy" target="_blank" rel="noopener noreferrer">
                      <i className="ri-github-line mr-2"></i>
                      GitHub
                    </a>
                  </Button>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 border-4 border-primary-500 rounded-full p-2">
                  <div className="absolute inset-0 rounded-full bg-gray-800 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 opacity-80 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white animate-pulse tracking-wide">C<span className="animate-bounce inline-block">J</span></span>
                    </div>
                  </div>
                  {/* Orbiting Skill Icons */}
                  <div className="absolute inset-0">
                    <div 
                      className="absolute bg-gray-800 p-2 rounded-full border-2 border-primary-500"
                      style={{ 
                        transform: `translate(${Math.cos(orbitAngle) * 5}px, ${Math.sin(orbitAngle) * 5}px) translate(-50%, -50%)`,
                        left: '0',
                        top: '50%'
                      }}
                    >
                      <i className="ri-reactjs-line text-2xl text-blue-400"></i>
                    </div>
                    <div 
                      className="absolute bg-gray-800 p-2 rounded-full border-2 border-primary-500"
                      style={{ 
                        transform: `translate(${Math.cos(orbitAngle + Math.PI/2) * 5}px, ${Math.sin(orbitAngle + Math.PI/2) * 5}px) translate(-50%, -50%)`,
                        right: '0',
                        top: '50%'
                      }}
                    >
                      <i className="ri-java-line text-2xl text-orange-400"></i>
                    </div>
                    <div 
                      className="absolute bg-gray-800 p-2 rounded-full border-2 border-primary-500"
                      style={{ 
                        transform: `translate(${Math.cos(orbitAngle + Math.PI) * 5}px, ${Math.sin(orbitAngle + Math.PI) * 5}px) translate(-50%, -50%)`,
                        top: '0',
                        left: '50%'
                      }}
                    >
                      <i className="ri-python-line text-2xl text-yellow-400"></i>
                    </div>
                    <div 
                      className="absolute bg-gray-800 p-2 rounded-full border-2 border-primary-500"
                      style={{ 
                        transform: `translate(${Math.cos(orbitAngle + 3*Math.PI/2) * 5}px, ${Math.sin(orbitAngle + 3*Math.PI/2) * 5}px) translate(-50%, -50%)`,
                        bottom: '0',
                        left: '50%'
                      }}
                    >
                      <i className="ri-javascript-line text-2xl text-yellow-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button 
              onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-400 hover:text-white transition-colors duration-300"
              aria-label="Scroll to About section"
            >
              <i className="ri-arrow-down-line text-2xl"></i>
            </button>
          </div>
        </section>
      
        {/* About Section */}
        <section ref={aboutRef} id="about" className="py-20 bg-gray-800 dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">About Me</h2>
              <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 font-space text-primary-400">My Journey</h3>
                <p className="text-gray-300 mb-6">
                  I started my coding journey in 2020, exploring the vast world of programming and development. In 2023, I joined St. Joseph's College of Engineering and Technology, Palai to pursue B.Tech in Computer Science Engineering.
                </p>
                <p className="text-gray-300 mb-6">
                  My core focus includes Data Structures, Algorithms, Web Development, Cloud Computing, and Artificial Intelligence. I'm passionate about building innovative solutions that solve real-world problems.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-white">Location</h4>
                    <p className="text-gray-300 flex items-center gap-2">
                      <i className="ri-map-pin-line text-primary-400"></i>
                      Alappuzha, Kerala, India
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-white">Education</h4>
                    <p className="text-gray-300 flex items-center gap-2">
                      <i className="ri-graduation-cap-line text-primary-400"></i>
                      B.Tech Computer Science (2023-Present)
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-white">Email</h4>
                    <p className="text-gray-300 flex items-center gap-2">
                      <i className="ri-mail-line text-primary-400"></i>
                      christopherjoshy4@gmail.com
                    </p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-bold mb-2 text-white">Interests</h4>
                    <p className="text-gray-300 flex items-center gap-2">
                      <i className="ri-gamepad-line text-primary-400"></i>
                      AI, Game Dev, Open Source
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-gray-700 rounded-lg p-6 h-full">
                      <i className="ri-code-box-line text-4xl mb-4 text-primary-400"></i>
                      <h3 className="text-xl font-bold mb-2">Web Development</h3>
                      <p className="text-gray-300">Building responsive and dynamic web applications with modern frameworks.</p>
                    </div>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-gray-700 rounded-lg p-6 h-full">
                      <i className="ri-gamepad-line text-4xl mb-4 text-primary-400"></i>
                      <h3 className="text-xl font-bold mb-2">Game Development</h3>
                      <p className="text-gray-300">Creating immersive gaming experiences with C++ and Unreal Engine.</p>
                    </div>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-gray-700 rounded-lg p-6 h-full">
                      <i className="ri-brain-line text-4xl mb-4 text-primary-400"></i>
                      <h3 className="text-xl font-bold mb-2">AI Development</h3>
                      <p className="text-gray-300">Exploring machine learning and artificial intelligence with Python.</p>
                    </div>
                  </div>
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <div className="bg-gray-700 rounded-lg p-6 h-full">
                      <i className="ri-cloud-line text-4xl mb-4 text-primary-400"></i>
                      <h3 className="text-xl font-bold mb-2">Cloud Services</h3>
                      <p className="text-gray-300">Deploying applications with AWS, Firebase, and Docker.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      
        {/* Skills Section */}
        <section ref={skillsRef} id="skills" className="py-20 bg-gray-900 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">My Skills</h2>
              <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 font-space text-primary-400">Technical Proficiency</h3>
                
                {/* Programming Languages */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <i className="ri-code-line text-secondary-500"></i>
                    Programming Languages
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-javascript-line text-2xl text-yellow-400"></i>
                      <span>JavaScript</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-python-line text-2xl text-blue-400"></i>
                      <span>Python</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-java-line text-2xl text-orange-400"></i>
                      <span>Java</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-code-s-slash-line text-2xl text-blue-500"></i>
                      <span>C#</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-code-s-slash-line text-2xl text-purple-400"></i>
                      <span>C++</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-flutter-line text-2xl text-blue-300"></i>
                      <span>Dart</span>
                    </div>
                  </div>
                </div>
                
                {/* Web Development */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <i className="ri-global-line text-secondary-500"></i>
                    Web Development
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-html5-line text-2xl text-orange-500"></i>
                      <span>HTML/CSS</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-reactjs-line text-2xl text-blue-400"></i>
                      <span>React</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-nodejs-line text-2xl text-green-400"></i>
                      <span>Node.js</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-shape-line text-2xl text-green-300"></i>
                      <span>Three.js</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-computer-line text-2xl text-gray-300"></i>
                      <span>REST APIs</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {/* Cloud & Tools */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <i className="ri-cloud-line text-secondary-500"></i>
                    Cloud & Tools
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-firebase-line text-2xl text-yellow-500"></i>
                      <span>Firebase</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-github-fill text-2xl text-white"></i>
                      <span>Git/GitHub</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-amazon-line text-2xl text-yellow-400"></i>
                      <span>AWS</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-docker-line text-2xl text-blue-400"></i>
                      <span>Docker</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-database-2-line text-2xl text-green-400"></i>
                      <span>MongoDB</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-database-line text-2xl text-orange-400"></i>
                      <span>Firestore</span>
                    </div>
                  </div>
                </div>
                
                {/* AI & Data */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <i className="ri-brain-line text-secondary-500"></i>
                    AI & Data
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-brain-line text-2xl text-blue-400"></i>
                      <span>TensorFlow</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-terminal-box-line text-2xl text-green-400"></i>
                      <span>Jupyter</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-bar-chart-box-line text-2xl text-blue-300"></i>
                      <span>NumPy</span>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300">
                      <i className="ri-line-chart-line text-2xl text-yellow-400"></i>
                      <span>scikit-learn</span>
                    </div>
                  </div>
                </div>
                
                {/* 3D Skill Visualization */}
                <div className="h-40 bg-gray-800 rounded-lg overflow-hidden">
                  <SkillVisualization skills={skills} />
                </div>
              </div>
            </div>
          </div>
        </section>
      
        {/* Certificates Section */}
        <section ref={certificatesRef} id="certificates" className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">Certificates & Achievements</h2>
              <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Professional certifications and achievements from recognized organizations.
              </p>
            </div>
            
            {certificates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4">
                  <i className="ri-award-line text-2xl text-primary-400"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
                <p className="text-gray-400">Certifications will appear here once added.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            )}
          </div>
        </section>
      
        {/* Projects Section */}
        <section ref={projectsRef} id="projects" className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">Projects & Repositories</h2>
              <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                A collection of my open-source projects and contributions.
              </p>
            </div>
            
            {/* Repository List */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <i className="ri-git-repository-line text-primary-400"></i>
                Starred Repositories
              </h3>
              <RepositoryList />
            </div>
            
            {/* Existing Projects */}
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-4">
                  <i className="ri-code-box-line text-2xl text-primary-400"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-gray-400">Projects will appear here once added.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <i className="ri-code-box-line text-primary-400"></i>
                    Projects
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      
        {/* Contact Section */}
        <section ref={contactRef} id="contact" className="py-20 bg-gray-900 dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-space mb-4">Get In Touch</h2>
              <div className="w-24 h-1 bg-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-300 max-w-2xl mx-auto">Feel free to reach out if you're looking for a developer, have a question, or just want to connect.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                    <Input 
                      id="name" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:ring-primary-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Your Email</label>
                    <Input 
                      type="email" 
                      id="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:ring-primary-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                    <Input 
                      id="subject" 
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:ring-primary-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                    <Textarea 
                      id="message" 
                      rows={5} 
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 focus:ring-primary-500" 
                      required 
                    />
                  </div>
                  <div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary-600 hover:bg-primary-700"
                    >
                      <i className="ri-send-plane-line mr-2"></i>
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
              <div>
                <Card className="bg-gray-800 mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold font-space mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-700 p-3 rounded-full text-primary-400">
                          <i className="ri-mail-line text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold">Email</h4>
                          <p className="text-gray-300">christopherjoshy4@gmail.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-700 p-3 rounded-full text-primary-400">
                          <i className="ri-phone-line text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold">Phone</h4>
                          <p className="text-gray-300">+91 8075809531</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-700 p-3 rounded-full text-primary-400">
                          <i className="ri-map-pin-line text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold">Location</h4>
                          <p className="text-gray-300">Alappuzha, Kerala, India</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold font-space mb-6">Connect With Me</h3>
                    <div className="flex space-x-4">
                      <Button 
                        asChild
                        variant="outline" 
                        size="icon" 
                        className="bg-gray-700 hover:bg-gray-600 rounded-full h-12 w-12"
                      >
                        <a href="https://github.com/ChristopherJoshy" target="_blank" rel="noopener noreferrer">
                          <i className="ri-github-line text-xl"></i>
                        </a>
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        size="icon" 
                        className="bg-gray-700 hover:bg-blue-600 rounded-full h-12 w-12"
                      >
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <i className="ri-linkedin-line text-xl"></i>
                        </a>
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        size="icon" 
                        className="bg-gray-700 hover:bg-pink-600 rounded-full h-12 w-12"
                      >
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <i className="ri-instagram-line text-xl"></i>
                        </a>
                      </Button>
                      <Button 
                        asChild
                        variant="outline" 
                        size="icon" 
                        className="bg-gray-700 hover:bg-blue-400 rounded-full h-12 w-12"
                      >
                        <a href="#" target="_blank" rel="noopener noreferrer">
                          <i className="ri-twitter-line text-xl"></i>
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Home;
