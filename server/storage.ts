import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  certificates, type Certificate, type InsertCertificate,
  messages, type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  getFeaturedProjects(): Promise<Project[]>;
  
  // Certificate operations
  getCertificates(): Promise<Certificate[]>;
  getCertificate(id: number): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: number, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined>;
  deleteCertificate(id: number): Promise<boolean>;
  
  // Message operations
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  deleteMessage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private certificates: Map<number, Certificate>;
  private messages: Map<number, Message>;
  private userId: number;
  private projectId: number;
  private certificateId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.certificates = new Map();
    this.messages = new Map();
    this.userId = 1;
    this.projectId = 1;
    this.certificateId = 1;
    this.messageId = 1;
    
    // Initialize with sample projects for development
    this.initSampleData();
  }

  private initSampleData() {
    const now = new Date();
    
    // Add sample projects
    this.createProject({
      title: "KKNotesV2",
      description: "A premium resource hub for KTU Computer Science Engineering study materials featuring high-quality notes and curated video tutorials.",
      techStack: "JavaScript, HTML, CSS",
      imageUrl: "",
      demoLink: "https://kknotes.vercel.app",
      githubLink: "https://github.com/ChristopherJoshy/KKNotes",
      featured: true,
    });
    
    this.createProject({
      title: "MaestraMind",
      description: "An AI-powered adaptive learning web application that transforms study notes into personalized learning experiences using Google's Gemini API.",
      techStack: "JavaScript, HTML/CSS, Firebase, Gemini API",
      imageUrl: "",
      demoLink: "https://maestramind.vercel.app",
      githubLink: "https://github.com/ChristopherJoshy/MaestraMind",
      featured: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      createdAt: new Date() 
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectUpdate: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectUpdate };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.featured);
  }

  // Certificate operations
  async getCertificates(): Promise<Certificate[]> {
    return Array.from(this.certificates.values());
  }

  async getCertificate(id: number): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = this.certificateId++;
    const certificate: Certificate = { 
      ...insertCertificate, 
      id, 
      createdAt: new Date() 
    };
    this.certificates.set(id, certificate);
    return certificate;
  }

  async updateCertificate(id: number, certificateUpdate: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const certificate = this.certificates.get(id);
    if (!certificate) return undefined;
    
    const updatedCertificate = { ...certificate, ...certificateUpdate };
    this.certificates.set(id, updatedCertificate);
    return updatedCertificate;
  }

  async deleteCertificate(id: number): Promise<boolean> {
    return this.certificates.delete(id);
  }

  // Message operations
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      createdAt: new Date(),
      read: false 
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.messages.get(id);
    if (!message) return false;
    
    message.read = true;
    this.messages.set(id, message);
    return true;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }
}

export const storage = new MemStorage();
