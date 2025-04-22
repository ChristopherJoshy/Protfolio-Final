import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

// Define database connection string
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_IUcurO9YfXP1@ep-broad-star-a49b8m9i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function main() {
  try {
    console.log('🔧 Connecting to database...');
    
    console.log('🔧 Creating tables if they don\'t exist...');
    
    // Define your schema creation queries
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_admin BOOLEAN NOT NULL DEFAULT false
      );
    `;
    console.log('✅ Users table created');
    
    await sql`
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
    console.log('✅ Projects table created');
    
    await sql`
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
    console.log('✅ Certificates table created');
    
    await sql`
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
    console.log('✅ Messages table created');
    
    // Add sample data
    console.log('🔧 Adding sample data...');
    
    // Add admin user
    const adminUserExists = await sql`SELECT id FROM users WHERE username = 'admin' LIMIT 1`;
    if (adminUserExists.length === 0) {
      // Simple hash of 'password' - in a real app, use proper hashing like bcrypt
      const passwordHash = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa';
      await sql`INSERT INTO users (username, password, is_admin) VALUES ('admin', ${passwordHash}, true)`;
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Add sample projects
    const projectsExist = await sql`SELECT id FROM projects LIMIT 1`;
    if (projectsExist.length === 0) {
      // Add first project
      await sql`
        INSERT INTO projects (title, description, tech_stack, demo_link, github_link, featured) 
        VALUES ('KKNotesV2', 'A premium resource hub for KTU Computer Science Engineering study materials featuring high-quality notes and curated video tutorials.', 'JavaScript, HTML, CSS', 'https://kknotes.vercel.app', 'https://github.com/ChristopherJoshy/KKNotes', true)
      `;
      
      // Add second project
      await sql`
        INSERT INTO projects (title, description, tech_stack, demo_link, github_link, featured) 
        VALUES ('MaestraMind', 'An AI-powered adaptive learning web application that transforms study notes into personalized learning experiences using Google''s Gemini API.', 'JavaScript, HTML/CSS, Firebase, Gemini API', 'https://maestramind.vercel.app', 'https://github.com/ChristopherJoshy/MaestraMind', true)
      `;
      console.log('✅ Sample projects added');
    } else {
      console.log('✅ Projects already exist');
    }
    
    // Add sample certificates
    const certificatesExist = await sql`SELECT id FROM certificates LIMIT 1`;
    if (certificatesExist.length === 0) {
      // Add first certificate
      await sql`
        INSERT INTO certificates (title, issuer, date, credential_url) 
        VALUES ('AWS Cloud Practitioner', 'Amazon Web Services', 'June 2023', 'https://aws.amazon.com/certification/certified-cloud-practitioner/')
      `;
      
      // Add second certificate
      await sql`
        INSERT INTO certificates (title, issuer, date, credential_url) 
        VALUES ('React.js Developer', 'Meta', 'September 2023', 'https://www.coursera.org/professional-certificates/meta-front-end-developer')
      `;
      console.log('✅ Sample certificates added');
    } else {
      console.log('✅ Certificates already exist');
    }
    
    console.log('✅ Database initialization complete');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

main(); 