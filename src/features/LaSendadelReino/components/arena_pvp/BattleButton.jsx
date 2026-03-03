import React from 'react';
import './BattleButton.css';

const BattleButton = ({ onClick }) => {
  // SVG de la punta metálica (diseño exacto con gradientes dorados y sombra base)
  const MetalTip = ({ className }) => (
    <svg 
      className={`metal-tip ${className}`} 
      viewBox="0 0 50 90" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradiente dorado principal */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffeba1" />
          <stop offset="40%" stopColor="#dfb15b" />
          <stop offset="80%" stopColor="#8c500b" />
          <stop offset="100%" stopColor="#5c3202" />
        </linearGradient>
        {/* Gradiente oscuro para el borde/sombra */}
        <linearGradient id="darkEdge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a1c00" />
          <stop offset="50%" stopColor="#1a0a00" />
          <stop offset="100%" stopColor="#3a1c00" />
        </linearGradient>
      </defs>

      {/* Sombra base exterior (el borde oscuro grueso) */}
      <path 
        d="M 50 5 C 20 5 -5 40 -5 45 C -5 50 20 85 50 85 C 35 65 35 25 50 5 Z" 
        fill="url(#darkEdge)" 
      />
      {/* Relleno metálico dorado central */}
      <path 
        d="M 45 10 C 22 10 2 40 2 45 C 2 50 22 80 45 80 C 32 62 32 28 45 10 Z" 
        fill="url(#goldGradient)" 
      />
      {/* Brillo interno para dar volumen 3D */}
      <path 
        d="M 40 15 C 25 15 8 40 8 45 C 8 50 25 75 40 75 C 30 60 30 30 40 15 Z" 
        fill="transparent" 
        stroke="#ffeba1" 
        strokeWidth="1.5" 
        opacity="0.6"
      />
    </svg>
  );

  return (
    <div className="battle-button-wrapper">
      <div className="battle-button-container">
        {/* Punta Izquierda */}
        <MetalTip className="tip-left" />
        
        {/* Botón Central */}
        <button className="battle-button" onClick={onClick}>
          <span>ENFRENTAR RIVAL</span>
          <div className="button-flare"></div>
        </button>

        {/* Punta Derecha (el CSS la invierte) */}
        <MetalTip className="tip-right" />
      </div>
    </div>
  );
};

export default BattleButton;
