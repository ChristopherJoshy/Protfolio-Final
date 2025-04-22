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

  // Setup IntersectionObserver to detect when component is out of view
  useEffect(() => {
    if (!containerRef.current) return;
    
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
            }, 5000);
            
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
  }, [isFirefox, unloaded]);

  // Main effect to initialize the animation
  useEffect(() => {
    const isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    setIsFirefox(isFF);
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
    
    if (unloaded || !containerRef.current || (isFF && localStorage.getItem('enable-particles') !== 'true')) {
      return;
    }
    
    const options = {
      particleCount: isFF ? 400 : 800,
      frameRate: isFF ? 20 : 30,
      disableMouseTracking: isFF
    };
    
    try {
      if (animationRef.current) {
        animationRef.current.cleanup();
      }
      
      animationRef.current = new BackgroundAnimation(containerRef.current, options);
      
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
        }, 30000);
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
      return undefined;
    }
  }, [unloaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.cleanup();
        animationRef.current = null;
      }
    };
  }, []);

  if (isFirefox && localStorage.getItem('enable-particles') !== 'true') {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>
        </div>
        <button 
          onClick={() => {
            localStorage.setItem('enable-particles', 'true');
            window.location.reload();
          }}
          className="absolute bottom-4 right-4 text-xs opacity-30 hover:opacity-100 bg-gray-800 text-white px-2 py-1 rounded"
        >
          Enable 3D (may affect performance)
        </button>
      </div>
    );
  }

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
