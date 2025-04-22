import { useEffect, useRef, useState } from 'react';
import { BackgroundAnimation } from '@/lib/three/background';
import { WebGLManager } from '@/lib/three/WebGLManager';

interface ThreeBackgroundProps {
  className?: string;
}

const ThreeBackground = ({ className = '' }: ThreeBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<BackgroundAnimation | null>(null);
  const [isFirefox, setIsFirefox] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [unloaded, setUnloaded] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check for WebGL support early
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch (e) {
      console.error('WebGL not supported:', e);
      setHasWebGL(false);
    }
  }, []);

  // Setup IntersectionObserver to detect when component is out of view
  useEffect(() => {
    if (!containerRef.current || !hasWebGL) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (!entry.isIntersecting && animationRef.current) {
          if (isFirefox) {
            const timeout = setTimeout(() => {
              if (animationRef.current && !unloaded) {
                console.log('Unloading Three.js background to save memory');
                animationRef.current.cleanup();
                animationRef.current = null;
                setUnloaded(true);
              }
            }, 3000); // Reduced from 5000ms to 3000ms
            
            return () => clearTimeout(timeout);
          } else {
            animationRef.current.pause();
          }
        } else if (entry.isIntersecting) {
          if (animationRef.current) {
            animationRef.current.resume();
          } else if (unloaded) {
            setUnloaded(false);
          }
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [isFirefox, unloaded, hasWebGL]);

  // Main effect to initialize the animation
  useEffect(() => {
    // Early return if no WebGL
    if (!hasWebGL) return;
    
    const isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    setIsFirefox(isFF);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
    
    // Don't initialize if user prefers reduced motion or disabled particles
    if (prefersReducedMotion || unloaded || !containerRef.current || 
        (isFF && localStorage.getItem('enable-particles') === 'false')) {
      return;
    }
    
    const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
    
    const quality = isFF ? 'low' : isMobile ? 'low' : 'medium';
    
    const options = {
      particleCount: isFF ? 300 : isMobile ? 300 : 500,
      frameRate: isFF ? 15 : isMobile ? 20 : 30,
      disableMouseTracking: isFF || isMobile,
      quality: quality as 'low' | 'medium' | 'high'
    };
    
    try {
      if (animationRef.current) {
        animationRef.current.cleanup();
      }
      
      animationRef.current = new BackgroundAnimation(containerRef.current, options);
      
      // For Firefox, periodically pause/resume to help with memory management
      let gcInterval: number | null = null;
      if (isFF) {
        gcInterval = window.setInterval(() => {
          if (animationRef.current) {
            animationRef.current.pause();
            setTimeout(() => {
              if (animationRef.current) {
                animationRef.current.resume();
              }
            }, 50);
          }
        }, 60000); // Increased from 30s to 60s to reduce overhead
      }
      
      return () => {
        if (gcInterval) {
          clearInterval(gcInterval);
        }
        if (animationRef.current) {
          animationRef.current.cleanup();
          animationRef.current = null;
        }
      };
    } catch (error) {
      console.error('Failed to initialize 3D background:', error);
      // If initialization fails, fallback to static background
      setHasWebGL(false);
      return undefined;
    }
  }, [unloaded, hasWebGL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cleanup();
        animationRef.current = null;
      }
    };
  }, []);

  // Fallback for Firefox when particles are disabled
  if ((isFirefox && localStorage.getItem('enable-particles') === 'false') || !hasWebGL) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>
        </div>
        {isFirefox && (
          <button 
            onClick={() => {
              localStorage.setItem('enable-particles', 'true');
              window.location.reload();
            }}
            className="absolute bottom-4 right-4 text-xs opacity-30 hover:opacity-100 bg-gray-800 text-white px-2 py-1 rounded"
          >
            Enable 3D (may affect performance)
          </button>
        )}
      </div>
    );
  }

  // Fallback for reduced motion preference
  if (reducedMotion) {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 ${className}`}
    />
  );
};

export default ThreeBackground;
