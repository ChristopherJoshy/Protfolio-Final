// Environment variable validation
export function validateEnv() {
  const requiredVars = [
    'DATABASE_URL',
    'NODE_ENV'
  ];
  
  const missingVars: string[] = [];
  
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
  
  if (missingVars.length > 0) {
    console.error(`[ENV] Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  console.log('[ENV] All required environment variables are set');
  return true;
} 