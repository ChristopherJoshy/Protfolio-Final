import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, projects, certificates, messages } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as bcrypt from 'bcryptjs';

async function main() {
  // Use environment variable or fallback to hardcoded connection string
  const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IUcurO9YfXP1@ep-broad-star-a49b8m9i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

  try {
    console.log('🔧 Connecting to database...');
    const client = neon(connectionString);
    const db = drizzle(client);
    
    console.log('🔧 Creating tables if they don\'t exist...');
    
    // Define your schema creation queries
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT false
      );
    `;
    
    const createProjectsTable = `
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tech_stack TEXT NOT NULL,
        image_url TEXT,
        demo_link TEXT,
        github_link TEXT,
        featured BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `;
    
    const createCertificatesTable = `
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        date TEXT NOT NULL,
        credential_url TEXT,
        image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `;
    
    const createMessagesTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        read BOOLEAN NOT NULL DEFAULT false
      );
    `;
    
    // Execute the queries
    await client`${createUsersTable}`;
    await client`${createProjectsTable}`;
    await client`${createCertificatesTable}`;
    await client`${createMessagesTable}`;
    
    console.log('✅ Tables created successfully');
    
    // Check if admin user exists
    const adminUser = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
    
    // Create admin user if it doesn't exist
    if (adminUser.length === 0) {
      console.log('🔧 Creating admin user...');
      const hashedPassword = await bcrypt.hash('password', 10);
      
      await db.insert(users).values({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
      
      console.log('✅ Admin user created successfully');
      console.log('   Username: admin');
      console.log('   Password: password');
      console.log('   ⚠️  Please change the password after first login in production');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Add sample data if requested
    if (process.argv.includes('--with-samples')) {
      await addSampleData(db);
    }
    
    console.log('✅ Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function addSampleData(db: any) {
  console.log('🔧 Adding sample data...');
  
  // Check if we already have projects
  const existingProjects = await db.select().from(projects);
  if (existingProjects.length === 0) {
    console.log('🔧 Adding sample projects...');
    
    await db.insert(projects).values([
      {
        title: "KKNotesV2",
        description: "A premium resource hub for KTU Computer Science Engineering study materials featuring high-quality notes and curated video tutorials.",
        techStack: "JavaScript, HTML, CSS",
        imageUrl: null,
        demoLink: "https://kknotes.vercel.app",
        githubLink: "https://github.com/ChristopherJoshy/KKNotes",
        featured: true,
        createdAt: new Date()
      },
      {
        title: "MaestraMind",
        description: "An AI-powered adaptive learning web application that transforms study notes into personalized learning experiences using Google's Gemini API.",
        techStack: "JavaScript, HTML/CSS, Firebase, Gemini API",
        imageUrl: null,
        demoLink: "https://maestramind.vercel.app",
        githubLink: "https://github.com/ChristopherJoshy/MaestraMind",
        featured: true,
        createdAt: new Date()
      }
    ]);
    
    console.log('✅ Sample projects added');
  } else {
    console.log('✅ Projects already exist, skipping sample projects');
  }
  
  // Check if we already have certificates
  const existingCertificates = await db.select().from(certificates);
  if (existingCertificates.length === 0) {
    console.log('🔧 Adding sample certificates...');
    
    await db.insert(certificates).values([
      {
        title: "AWS Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "June 2023",
        credentialUrl: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        imageUrl: null,
        createdAt: new Date()
      },
      {
        title: "React.js Developer",
        issuer: "Meta",
        date: "September 2023",
        credentialUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        imageUrl: null,
        createdAt: new Date()
      }
    ]);
    
    console.log('✅ Sample certificates added');
  } else {
    console.log('✅ Certificates already exist, skipping sample certificates');
  }
}

main(); 