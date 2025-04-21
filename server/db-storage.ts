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
    console.log('🔌 DbStorage: Database connection established');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('❌ DbStorage: Error getting user:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('❌ DbStorage: Error getting user by username:', error);
      throw error;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await this.db.insert(users).values(user).returning();
      console.log('✅ DbStorage: User created successfully');
      return result[0];
    } catch (error) {
      console.error('❌ DbStorage: Error creating user:', error);
      throw error;
    }
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    try {
      const projectsList = await this.db.select().from(projects).orderBy(projects.createdAt);
      console.log(`✅ DbStorage: Retrieved ${projectsList.length} projects from database`);
      return projectsList;
    } catch (error) {
      console.error('❌ DbStorage: Error getting projects:', error);
      throw error;
    }
  }

  async getProject(id: number): Promise<Project | undefined> {
    try {
      const result = await this.db.select().from(projects).where(eq(projects.id, id)).limit(1);
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('❌ DbStorage: Error getting project:', error);
      throw error;
    }
  }

  async createProject(project: InsertProject): Promise<Project> {
    try {
      const result = await this.db.insert(projects).values(project).returning();
      console.log('✅ DbStorage: Project created successfully', result[0].title);
      return result[0];
    } catch (error) {
      console.error('❌ DbStorage: Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      const result = await this.db.update(projects).set(project).where(eq(projects.id, id)).returning();
      if (result.length > 0) {
        console.log('✅ DbStorage: Project updated successfully', result[0].title);
      }
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('❌ DbStorage: Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<boolean> {
    try {
      const result = await this.db.delete(projects).where(eq(projects.id, id)).returning();
      if (result.length > 0) {
        console.log('✅ DbStorage: Project deleted successfully', id);
      }
      return result.length > 0;
    } catch (error) {
      console.error('❌ DbStorage: Error deleting project:', error);
      throw error;
    }
  }

  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const featuredProjects = await this.db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.createdAt);
      console.log(`✅ DbStorage: Retrieved ${featuredProjects.length} featured projects`);
      return featuredProjects;
    } catch (error) {
      console.error('❌ DbStorage: Error getting featured projects:', error);
      throw error;
    }
  }

  // Certificate operations
  async getCertificates(): Promise<Certificate[]> {
    try {
      const certificatesList = await this.db.select().from(certificates).orderBy(certificates.createdAt);
      console.log(`✅ DbStorage: Retrieved ${certificatesList.length} certificates from database`);
      return certificatesList;
    } catch (error) {
      console.error('❌ DbStorage: Error getting certificates:', error);
      throw error;
    }
  }

  async getCertificate(id: number): Promise<Certificate | undefined> {
    try {
      const result = await this.db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('❌ DbStorage: Error getting certificate:', error);
      throw error;
    }
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    try {
      const result = await this.db.insert(certificates).values(certificate).returning();
      console.log('✅ DbStorage: Certificate created successfully', result[0].title);
      return result[0];
    } catch (error) {
      console.error('❌ DbStorage: Error creating certificate:', error);
      throw error;
    }
  }

  async updateCertificate(id: number, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    try {
      const result = await this.db.update(certificates).set(certificate).where(eq(certificates.id, id)).returning();
      if (result.length > 0) {
        console.log('✅ DbStorage: Certificate updated successfully', result[0].title);
      }
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('❌ DbStorage: Error updating certificate:', error);
      throw error;
    }
  }

  async deleteCertificate(id: number): Promise<boolean> {
    try {
      const result = await this.db.delete(certificates).where(eq(certificates.id, id)).returning();
      if (result.length > 0) {
        console.log('✅ DbStorage: Certificate deleted successfully', id);
      }
      return result.length > 0;
    } catch (error) {
      console.error('❌ DbStorage: Error deleting certificate:', error);
      throw error;
    }
  }

  // Message operations
  async getMessages(): Promise<Message[]> {
    try {
      const messagesList = await this.db.select().from(messages).orderBy(messages.createdAt);
      console.log(`✅ DbStorage: Retrieved ${messagesList.length} messages from database`);
      return messagesList;
    } catch (error) {
      console.error('❌ DbStorage: Error getting messages:', error);
      throw error;
    }
  }

  async getMessage(id: number): Promise<Message | undefined> {
    try {
      const result = await this.db.select().from(messages).where(eq(messages.id, id)).limit(1);
      return result.length > 0 ? result[0] : undefined;
    } catch (error) {
      console.error('❌ DbStorage: Error getting message:', error);
      throw error;
    }
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    try {
      const result = await this.db.insert(messages).values(message).returning();
      console.log('✅ DbStorage: Message created successfully from', result[0].email);
      return result[0];
    } catch (error) {
      console.error('❌ DbStorage: Error creating message:', error);
      throw error;
    }
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    try {
      const result = await this.db.update(messages).set({ read: true }).where(eq(messages.id, id)).returning();
      if (result.length > 0) {
        console.log('✅ DbStorage: Message marked as read', id);
      }
      return result.length > 0;
    } catch (error) {
      console.error('❌ DbStorage: Error marking message as read:', error);
      throw error;
    }
  }

  async deleteMessage(id: number): Promise<boolean> {
    try {
      const result = await this.db.delete(messages).where(eq(messages.id, id)).returning();
      if (result.length > 0) {
        console.log('✅ DbStorage: Message deleted successfully', id);
      }
      return result.length > 0;
    } catch (error) {
      console.error('❌ DbStorage: Error deleting message:', error);
      throw error;
    }
  }
} 