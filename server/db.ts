import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, projects, certificates, messages } from '@shared/schema';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const client = neon(process.env.DATABASE_URL);
export const db = drizzle(client);

console.log('✅ Database connection initialized successfully');

// Test DB connection
(async () => {
  try {
    // Simple query to test connection
    await client`SELECT 1 as connected`;
    console.log('✅ Successfully connected to NeonDB database');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
})();

// Helper functions for common operations

// Projects
export async function getAllProjects() {
  return await db.select().from(projects).orderBy(projects.createdAt);
}

export async function getProjectById(id: number) {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedProjects() {
  return await db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.createdAt);
}

export async function createProject(project: any) {
  const result = await db.insert(projects).values(project).returning();
  return result[0];
}

export async function updateProject(id: number, data: any) {
  const result = await db.update(projects).set(data).where(eq(projects.id, id)).returning();
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteProject(id: number) {
  const result = await db.delete(projects).where(eq(projects.id, id)).returning();
  return result.length > 0;
}

// Certificates
export async function getAllCertificates() {
  return await db.select().from(certificates).orderBy(certificates.createdAt);
}

export async function getCertificateById(id: number) {
  const result = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCertificate(certificate: any) {
  const result = await db.insert(certificates).values(certificate).returning();
  return result[0];
}

export async function updateCertificate(id: number, data: any) {
  const result = await db.update(certificates).set(data).where(eq(certificates.id, id)).returning();
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteCertificate(id: number) {
  const result = await db.delete(certificates).where(eq(certificates.id, id)).returning();
  return result.length > 0;
}

// Messages
export async function getAllMessages() {
  return await db.select().from(messages).orderBy(messages.createdAt);
}

export async function getMessageById(id: number) {
  const result = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createMessage(message: any) {
  const result = await db.insert(messages).values(message).returning();
  return result[0];
}

export async function markMessageAsRead(id: number) {
  const result = await db.update(messages).set({ read: true }).where(eq(messages.id, id)).returning();
  return result.length > 0;
}

export async function deleteMessage(id: number) {
  const result = await db.delete(messages).where(eq(messages.id, id)).returning();
  return result.length > 0;
}

// Users
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(user: any) {
  const result = await db.insert(users).values(user).returning();
  return result[0];
} 