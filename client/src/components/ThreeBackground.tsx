import { useEffect, useRef } from 'react';
import { BackgroundAnimation } from '@/lib/three/background';

interface ThreeBackgroundProps {
  className?: string;
}

const ThreeBackground = ({ className = '' }: ThreeBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<BackgroundAnimation | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    animationRef.current = new BackgroundAnimation(containerRef.current);
    
    return () => {
      if (animationRef.current) {
        animationRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 ${className}`}
    />
  );
};

export default ThreeBackground;
