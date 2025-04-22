// Environment variable validation
export function validateEnv() {
  const requiredVars = [
    'DATABASE_URL',
    'NODE_ENV'
  ];
  
  let missingVars: string[] = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  // Log all environment variables (redacted values for security)
  const envVars = Object.keys(process.env).reduce((acc, key) => {
    const value = process.env[key];
    // If the value looks like a connection string, URL, or token, redact it
    const redactedValue = value && (
      value.includes('://') || 
      value.includes('token') || 
      value.includes('password') || 
      value.includes('secret') || 
      value.includes('key')
    ) ? '[REDACTED]' : value;
    
    return { ...acc, [key]: redactedValue };
  }, {});
  
  console.log('[ENV] Environment variables:', envVars);
  console.log('[ENV] DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('[ENV] NODE_ENV:', process.env.NODE_ENV);
  console.log('[ENV] Runtime environment:', process.env.VERCEL ? 'Vercel' : 'Local');
  
  if (missingVars.length > 0) {
    console.error(`[ENV] Missing required environment variables: ${missingVars.join(', ')}`);
    
    // If DATABASE_URL is missing but we have it in vercel.json, use that as fallback
    if (missingVars.includes('DATABASE_URL')) {
      console.log('[ENV] Setting fallback DATABASE_URL from hardcoded value');
      process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_IUcurO9YfXP1@ep-broad-star-a49b8m9i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';
      console.log('[ENV] DATABASE_URL now exists:', !!process.env.DATABASE_URL);
      missingVars = missingVars.filter(v => v !== 'DATABASE_URL');
    }
    
    // Continue checking after applying fallbacks
    if (missingVars.length > 0) {
      return false;
    }
  }
  
  // Validate DATABASE_URL format (simple check)
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    if (!url.startsWith('postgresql://')) {
      console.error('[ENV] DATABASE_URL does not appear to be a valid PostgreSQL connection string');
      return false;
    }
  }
  
  console.log('[ENV] All required environment variables are set');
  return true;
} 