import { useEffect, useRef, useState } from 'react';
import { BackgroundAnimation } from '@/lib/three/background';

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
        
        // If component has been out of view for a while and we have an animation
        if (!entry.isIntersecting && animationRef.current) {
          // If it's Firefox, completely unload the animation after 5 seconds
          // This helps prevent memory issues when the user scrolls away
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
            // For other browsers, just pause the animation
            animationRef.current.pause();
          }
        } else if (entry.isIntersecting) {
          // When coming back into view
          if (animationRef.current) {
            animationRef.current.resume();
          } else if (unloaded) {
            // If we previously unloaded, we need to reload
            setUnloaded(false);
            // Reloading will happen in the main effect below
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
    // Detect Firefox
    const isFF = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    setIsFirefox(isFF);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
    
    // If already unloaded or no container, don't initialize
    if (unloaded || !containerRef.current || (isFF && localStorage.getItem('enable-particles') !== 'true')) {
      return;
    }
    
    // Use a lower particle count for Firefox
    const options = {
      particleCount: isFF ? 400 : 800,
      frameRate: isFF ? 20 : 30, // Lower framerate for Firefox
      disableMouseTracking: isFF
    };
    
    try {
      // Destroy any existing animation
      if (animationRef.current) {
        animationRef.current.cleanup();
      }
      
      // Create new animation
      animationRef.current = new BackgroundAnimation(containerRef.current, options);
      
      // Force garbage collection occasionally on Firefox (helps prevent memory buildup)
      let gcInterval: number | null = null;
      if (isFF) {
        gcInterval = window.setInterval(() => {
          if (animationRef.current) {
            // Temporarily pause animation
            animationRef.current.pause();
            // Resume after a short delay to allow GC to happen
            setTimeout(() => {
              if (animationRef.current) {
                animationRef.current.resume();
              }
            }, 50);
          }
        }, 30000); // Every 30 seconds
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

  // For Firefox, offer a static background instead of particles to avoid crashes
  if (isFirefox && localStorage.getItem('enable-particles') !== 'true') {
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>
        </div>
        {/* Optional toggle button to enable particles */}
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

  // For users with reduced motion preference
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
