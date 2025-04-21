import { useState, useEffect } from 'react';

interface OrbitingSkillsProps {
  skills: Array<{
    icon: string;
    position: 'top' | 'right' | 'bottom' | 'left';
    color: string;
  }>;
}

const OrbitingSkills = ({ skills }: OrbitingSkillsProps) => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAngle(prev => (prev + 0.01) % (Math.PI * 2));
    }, 50);
    
    return () => clearInterval(intervalId);
  }, []);

  const getPosition = (position: string, angle: number) => {
    const baseAngle = {
      'left': 0,
      'top': Math.PI / 2,
      'right': Math.PI,
      'bottom': 3 * Math.PI / 2
    }[position] || 0;
    
    const currentAngle = baseAngle + angle;
    const x = Math.cos(currentAngle) * 5;
    const y = Math.sin(currentAngle) * 5;
    
    return {
      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
    };
  };

  return (
    <div className="absolute inset-0">
      {skills.map((skill, index) => (
        <div 
          key={index}
          className={`absolute bg-gray-800 p-2 rounded-full border-2 border-primary-500`}
          style={{
            ...getPosition(skill.position, angle),
            [skill.position]: '0',
            [skill.position === 'left' || skill.position === 'right' ? 'top' : 'left']: '50%'
          }}
        >
          <i className={`${skill.icon} text-2xl`} style={{ color: skill.color }}></i>
        </div>
      ))}
    </div>
  );
};

export default OrbitingSkills;
