import React from 'react';

interface LogoProps {
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ size = 50 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Luna creciente */}
      <circle cx="400" cy="300" r="200" fill="#1e3a5f"/>
      <circle cx="440" cy="300" r="180" fill="#f5f5f5"/>
      
      {/* Avión */}
      <g transform="translate(250, 200)">
        {/* Fuselaje */}
        <ellipse cx="200" cy="100" rx="180" ry="35" fill="white" stroke="#1e3a5f" strokeWidth="4"/>
        
        {/* Ala superior */}
        <path d="M 100 85 L 50 50 L 350 50 L 300 85 Z" fill="white" stroke="#1e3a5f" strokeWidth="3"/>
        
        {/* Ala inferior */}
        <path d="M 100 115 L 50 150 L 350 150 L 300 115 Z" fill="white" stroke="#1e3a5f" strokeWidth="3"/>
        
        {/* Cola */}
        <path d="M 20 100 L 0 70 L 40 100 L 0 130 Z" fill="#1e3a5f"/>
        
        {/* Ventanas */}
        <circle cx="280" cy="100" r="12" fill="#1e3a5f"/>
        <circle cx="250" cy="100" r="12" fill="#1e3a5f"/>
        <circle cx="220" cy="100" r="12" fill="#1e3a5f"/>
        <circle cx="190" cy="100" r="12" fill="#1e3a5f"/>
        <circle cx="160" cy="100" r="12" fill="#1e3a5f"/>
        
        {/* Nariz */}
        <ellipse cx="350" cy="100" rx="30" ry="25" fill="#1e3a5f"/>
      </g>
    </svg>
  );
};

export default Logo;
