import React from 'react';

const RotationAnnouncement = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-[#0a0b1e]/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
      <div className="relative mb-8">
        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Estilos para la animación */}
          <style>
            {`
              .phone {
                transform-origin: center;
                animation: rotatePhone 2s ease-in-out infinite;
              }
              
              .arrows {
                transform-origin: center;
                animation: pulseArrows 2s ease-in-out infinite;
              }

              @keyframes rotatePhone {
                0%, 10% { transform: rotate(0deg); }
                40%, 60% { transform: rotate(90deg); }
                90%, 100% { transform: rotate(0deg); }
              }

              @keyframes pulseArrows {
                0%, 100% { opacity: 0.3; transform: scale(0.9); }
                50% { opacity: 1; transform: scale(1.1); }
              }
            `}
          </style>

          {/* Flechas de fondo (efecto de giro) */}
          <g className="arrows" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round">
            <path d="M 20 50 A 30 30 0 0 1 50 20" />
            <path d="M 80 50 A 30 30 0 0 1 50 80" />
            <polyline points="42,20 50,20 50,28" />
            <polyline points="58,80 50,80 50,72" />
          </g>

          {/* El Celular */}
          <g className="phone">
            {/* Cuerpo */}
            <rect x="35" y="20" width="30" height="60" rx="5" fill="none" stroke="white" stroke-width="3"/>
            {/* Pantalla interna (opcional) */}
            <rect x="38" y="25" width="24" height="45" rx="2" fill="white" opacity="0.1"/>
            {/* Botón o indicador de notch */}
            <line x1="46" y1="74" x2="54" y2="74" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </g>
        </svg>
      </div>
      
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 italic italic">
        ¡PREPÁRATE PARA LA BATALLA!
      </h2>
      <p className="text-blue-400 font-bold text-lg uppercase tracking-widest animate-pulse max-w-md">
        Gira tu dispositivo a modo horizontal para una mejor experiencia táctica
      </p>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default RotationAnnouncement;
