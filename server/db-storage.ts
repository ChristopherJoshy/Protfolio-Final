import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  certificates, type Certificate, type InsertCertificate,
  messages, type Message, type InsertMessage
} from "@shared/schema";
import { IStorage } from './storage';

export class DbStorage implements IStorage {
  private db;
  
  constructor() {
    // Create a neon client with the connection string
    const connectionString = 'postgresql://neondb_owner:npg_IUcurO9YfXP1@ep-broad-star-a49b8m9i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
    const client = neon(connectionString);
    
    // Pass the client to drizzle correctly using the HTTP adapter
    this.db = drizzle(client);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await this.db.select().from(projects).orderBy(projects.createdAt);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await this.db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await this.db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await this.db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return await this.db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.createdAt);
  }

  // Certificate operations
  async getCertificates(): Promise<Certificate[]> {
    return await this.db.select().from(certificates).orderBy(certificates.createdAt);
  }

  async getCertificate(id: number): Promise<Certificate | undefined> {
    const result = await this.db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const result = await this.db.insert(certificates).values(certificate).returning();
    return result[0];
  }

  async updateCertificate(id: number, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const result = await this.db.update(certificates).set(certificate).where(eq(certificates.id, id)).returning();
    return result.length > 0 ? result[0] : undefined;
  }

  async deleteCertificate(id: number): Promise<boolean> {
    const result = await this.db.delete(certificates).where(eq(certificates.id, id)).returning();
    return result.length > 0;
  }

  // Message operations
  async getMessages(): Promise<Message[]> {
    return await this.db.select().from(messages).orderBy(messages.createdAt);
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const result = await this.db.select().from(messages).where(eq(messages.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await this.db.insert(messages).values(message).returning();
    return result[0];
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const result = await this.db.update(messages).set({ read: true }).where(eq(messages.id, id)).returning();
    return result.length > 0;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const result = await this.db.delete(messages).where(eq(messages.id, id)).returning();
    return result.length > 0;
  }
} 