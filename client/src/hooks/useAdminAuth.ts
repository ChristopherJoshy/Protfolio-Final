import { useState, useEffect } from 'react';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAdmin = localStorage.getItem('isAdmin');
    setIsAuthenticated(isAdmin === 'true');
    setLoading(false);
  }, []);

  const login = (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // In a real implementation, this would call the backend
      if (username === 'admin' && password === 'password') {
        localStorage.setItem('isAdmin', 'true');
        setIsAuthenticated(true);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const logout = () => {
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout
  };
}
