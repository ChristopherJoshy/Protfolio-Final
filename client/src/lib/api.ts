// API helper with debugging
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // empty for relative URLs in production
  : 'http://localhost:5000';

// Log all API requests and responses for debugging
const logRequest = (method: string, url: string, data?: any) => {
  console.log(`🚀 [API Request] ${method} ${url}`, data || '');
};

const logResponse = (method: string, url: string, response: Response, data?: any) => {
  console.log(`✅ [API Response] ${method} ${url} ${response.status}`, data || '');
};

const logError = (method: string, url: string, error: any) => {
  console.error(`❌ [API Error] ${method} ${url}`, error);
};

// Base API fetch with improved error handling and debugging
export async function apiFetch<T = any>(
  endpoint: string, 
  options: RequestInit = {},
  needsAuth = false
): Promise<T> {
  const url = `${API_URL}/api/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  const method = options.method || 'GET';
  
  // Log the request
  logRequest(method, url, options.body);
  
  try {
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    
    // Parse the response
    const responseData = await response.json().catch(() => ({}));
    
    // Log the response
    logResponse(method, url, response, responseData);
    
    // Handle errors
    if (!response.ok) {
      throw {
        status: response.status,
        message: responseData.error || response.statusText,
        details: responseData.details || '',
        data: responseData
      };
    }
    
    return responseData as T;
  } catch (error) {
    logError(method, url, error);
    throw error;
  }
}

// Helper methods for common operations
export const apiClient = {
  get: <T = any>(endpoint: string, options: RequestInit = {}) => 
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = any>(endpoint: string, data: any, options: RequestInit = {}) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    
  put: <T = any>(endpoint: string, data: any, options: RequestInit = {}) => 
    apiFetch<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
    
  delete: <T = any>(endpoint: string, options: RequestInit = {}) => 
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
    
  // Debug methods
  checkStatus: async () => {
    try {
      const result = await apiFetch('debug');
      console.log('API Status Check:', result);
      return result;
    } catch (error) {
      console.error('API Status Check Failed:', error);
      return { error, status: 'error' };
    }
  }
}; 