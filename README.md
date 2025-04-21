# Christopher Joshy's Portfolio Website

A modern 3D portfolio website built with React and Three.js showcasing programming skills, projects, and GitHub integration with an admin panel for easy customization.

## Features

- **3D Animations**: Interactive background particles and floating elements using Three.js
- **Project Showcase**: Display your best work with detailed project descriptions
- **GitHub Integration**: Automatically pulls and displays your repositories
- **Admin Panel**: Manage your projects, certificates, and messages
- **Responsive Design**: Looks great on all devices
- **Persistent Storage**: Uses NeonDB for PostgreSQL database in production

## Tech Stack

- React with TypeScript
- Three.js for 3D elements
- Express.js backend
- TanStack React Query for data fetching
- Tailwind CSS & shadcn/ui for styling
- Wouter for routing
- DrizzleORM with NeonDB (PostgreSQL) for database

## Database Setup

This project uses [Neon](https://neon.tech) for PostgreSQL database in production, with a fallback to in-memory storage for development.

### Setting up the database:

1. Create an account on [Neon](https://neon.tech) (they offer a free tier)
2. Create a new project in Neon dashboard
3. Copy the connection string which looks like: `postgresql://username:password@endpoint.region.aws.neon.tech/dbname?sslmode=require`
4. Create a `.env` file in the project root (copy from `.env.example`)
5. Set the `DATABASE_URL` variable with your connection string
6. Run the database push command to set up tables:
   ```
   npm run db:push
   ```

### For Vercel deployment:

1. Go to your Vercel project settings
2. Add the `DATABASE_URL` environment variable with your Neon connection string
3. Redeploy your project

The app will automatically use the database in production mode and fall back to in-memory storage during development.

## Deploying to Vercel

This project is configured for easy deployment to Vercel. Follow these steps:

1. Create a Vercel account if you don't have one: [https://vercel.com/signup](https://vercel.com/signup)

2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Log in to Vercel:
   ```
   vercel login
   ```

4. Navigate to your project directory and run:
   ```
   vercel
   ```

5. Answer the prompts and Vercel will handle the rest!

### Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `NODE_ENV`: Set to "production" for production deployments
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `GITHUB_TOKEN` (optional): GitHub personal access token for real API data

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:5000 in your browser

## Admin Login

- Username: admin
- Password: password

*Note: In a production environment, you should change these credentials and implement proper authentication.*

## License

MIT