import { 
  type User, type InsertUser,
  type Project, type InsertProject,
  type Certificate, type InsertCertificate,
  type Message, type InsertMessage,
  type PageView, type InsertPageView
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
  getMessage(id: number): Promise<Message | null>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
  deleteMessage(id: number): Promise<boolean>;

  // Page views operations
  trackPageView(view: InsertPageView): Promise<PageView>;
  getPageViews(): Promise<PageView[]>;
  getPageViewsByPath(path: string): Promise<PageView[]>;
  getPageViewsCount(): Promise<number>;
  getPageViewsCountByPath(path: string): Promise<number>;
  getPageViewsByTimeRange(startDate: Date, endDate: Date): Promise<PageView[]>;
} 