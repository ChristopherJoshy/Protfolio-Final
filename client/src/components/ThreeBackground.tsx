import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { BackgroundAnimation } from '@/lib/three/background';

export const ThreeBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<BackgroundAnimation | null>(null);
  const { theme } = useTheme();

  // Initialize animation
  useEffect(() => {
    let isMounted = true;

    const initAnimation = () => {
      if (!containerRef.current || !isMounted) return;

      // Cleanup existing animation if it exists
      if (animationRef.current) {
        animationRef.current.cleanup();
        animationRef.current = null;
      }

      // Create new animation
      try {
        animationRef.current = new BackgroundAnimation(containerRef.current, {
          quality: window.innerWidth < 768 ? 'low' : 'medium',
          particleCount: window.innerWidth < 768 ? 300 : 500,
          frameRate: window.innerWidth < 768 ? 30 : 60,
          theme: theme as 'light' | 'dark'
        });
      } catch (error) {
        console.error('Failed to initialize background animation:', error);
      }
    };

    // Initialize with a slight delay to ensure proper mounting
    const timeoutId = setTimeout(initAnimation, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      
      if (animationRef.current) {
        animationRef.current.cleanup();
        animationRef.current = null;
      }
    };
  }, []); // Empty dependency array as we handle theme updates separately

  // Handle theme changes
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.updateTheme(theme as 'light' | 'dark');
    }
  }, [theme]);

  // Handle resize and visibility
  useEffect(() => {
    if (!containerRef.current || !animationRef.current) return;

    const handleResize = () => {
      if (animationRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        animationRef.current.resize(width, height);
      }
    };

    const handleVisibilityChange = () => {
      if (!animationRef.current) return;
      
      if (document.hidden) {
        animationRef.current.pause();
      } else {
        animationRef.current.resume();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900"
      aria-hidden="true"
    />
  );
};
