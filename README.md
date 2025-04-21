# Christopher Joshy's Portfolio Website

A modern 3D portfolio website built with React and Three.js showcasing programming skills, projects, and GitHub integration with an admin panel for easy customization.

## Features

- **3D Animations**: Interactive background particles and floating elements using Three.js
- **Project Showcase**: Display your best work with detailed project descriptions
- **GitHub Integration**: Automatically pulls and displays your repositories
- **Admin Panel**: Manage your projects, certificates, and messages
- **Responsive Design**: Looks great on all devices

## Tech Stack

- React with TypeScript
- Three.js for 3D elements
- Express.js backend
- TanStack React Query for data fetching
- Tailwind CSS & shadcn/ui for styling
- Wouter for routing

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