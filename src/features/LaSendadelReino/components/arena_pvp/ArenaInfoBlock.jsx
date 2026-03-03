import React from 'react';
import './ArenaInfoBlock.css';
import BattleButton from './BattleButton';

const ArenaInfoBlock = ({ onStartSearch }) => {
  return (
    <div className="arena-ui-container">
      
      {/* 1. Título principal */}
      <h2 className="arena-subtitle">
        Demuestra tu conocimiento en un duelo 1vs1.
      </h2>
      
      {/* 2. Descripción con saltos de línea exactos */}
      <p className="arena-description">
        Responde con precisión, vence<br />
        con velocidad y conquista<br />
        la gloria del Reino.
      </p>
      
      {/* 3. Lista de características */}
      <ul className="arena-features-list">
        <li className="feature-item feature-gold">
          <span className="feature-icon">🔥</span>
          <span className="feature-text">+Puntos de Gloria en juego</span>
        </li>
        <li className="feature-item">
          <span className="feature-icon">⚔️</span>
          <span className="feature-text">Rachas activas y bonus por tiempo</span>
        </li>
        <li className="feature-item">
          <span className="feature-icon">👑</span>
          <span className="feature-text">Solo uno dominará la Arena</span>
        </li>
      </ul>

      {/* 4. El Botón (Diseño Exacto Anterior) */}
      <BattleButton onClick={onStartSearch} />

    </div>
  );
};

export default ArenaInfoBlock;
