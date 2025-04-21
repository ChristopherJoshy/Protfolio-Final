import { useEffect, useRef } from 'react';
import { SkillVisualization as ThreeSkillVisualization } from '@/lib/three/skillVisualization';

interface SkillVisualizationProps {
  className?: string;
  skills?: { name: string; level: number; color: string }[];
}

const SkillVisualization = ({ 
  className = '',
  skills 
}: SkillVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualizationRef = useRef<ThreeSkillVisualization | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    visualizationRef.current = new ThreeSkillVisualization(containerRef.current, skills);
    
    return () => {
      if (visualizationRef.current) {
        visualizationRef.current.cleanup();
      }
    };
  }, [skills]);

  return (
    <div 
      ref={containerRef} 
      className={`relative h-full w-full rounded-lg overflow-hidden ${className}`}
    />
  );
};

export default SkillVisualization;
