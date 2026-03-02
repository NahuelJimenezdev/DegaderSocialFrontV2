import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { useUserStore } from '../../stores/useUserStore';
import RotationAnnouncement from './RotationAnnouncement';
import { useArenaStore } from '../../stores/useArenaStore';
import './ArenaMatchmaking.css';

export const ArenaMatchmaking = ({ onMatchFound, theme = 'dark' }) => {
  const { socket } = useSocket();
  const user = useUserStore();
  const [isSearching, setIsSearching] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [showRotationPrompt, setShowRotationPrompt] = useState(false);
  const setIsRotationRequired = useArenaStore(state => state.setIsRotationRequired);

  useEffect(() => {
    if (!socket) return;

    const handleMatchFound = (data) => {
      console.log('⚔️ [ARENA] ¡Partida Encontrada!', data);
      setIsSearching(false);
      setShowRotationPrompt(true);
      setIsRotationRequired(true);
      
      // Mostrar el anuncio de giro por 4 segundos
      setTimeout(() => {
        setShowRotationPrompt(false);
        setMatchData(data);
        
        // Esperar 3 segundos para mostrar la pantalla de VS antes de iniciar el juego
        setTimeout(() => {
          if (onMatchFound) onMatchFound(data);
        }, 3000);
      }, 4000);
    };

    socket.on('arena:matchFound', handleMatchFound);

    return () => {
      socket.off('arena:matchFound', handleMatchFound);
      if (isSearching) {
        socket.emit('arena:cancelSearch');
      }
    };
  }, [socket, isSearching, onMatchFound]);

  const handleStartSearch = () => {
    setIsSearching(true);
    socket.emit('arena:findMatch', { mode: 'arena', rating: user?.arena?.rankPoints || 0 });
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    socket.emit('arena:cancelSearch');
  };

  // Anuncio de Rotación
  if (showRotationPrompt) {
    return <RotationAnnouncement />;
  }

  // Pantalla de VS (Match Encontrado)
  if (matchData) {
    const opponent = matchData.opponent;
    const opponentName = `${opponent.nombres?.primero} ${opponent.apellidos?.primero}`;
    
    return (
      <div className={`arena-matchmaking-container ${theme}`}>
        <div className="vs-screen">
          {/* Jugador Izquierda (Tú) */}
          <div className="vs-player-container vs-p1 animate-slide-in-left">
            <div className="vs-avatar-wrapper">
              <img 
                src={user?.social?.fotoPerfil || '/assets/default-avatar.png'} 
                alt="Yo" 
                className="vs-avatar"
              />
            </div>
            <div className="vs-player-badge">
              <span className="vs-label">TÚ</span>
              <span className="vs-sublabel">LIGA {user?.arena?.league?.toUpperCase() || 'DISCÍPULO'}</span>
            </div>
          </div>

          <div className="vs-center-decoration animate-pulse-fast">
            <div className="vs-text-glow">VS</div>
          </div>

          {/* Jugador Derecha (Rival) */}
          <div className="vs-player-container vs-p2 animate-slide-in-right">
            <div className="vs-avatar-wrapper">
              <img 
                src={opponent.social?.fotoPerfil || '/assets/default-avatar.png'} 
                alt="Rival" 
                className="vs-avatar"
              />
            </div>
            <div className="vs-player-badge">
              <span className="vs-label">{opponentName}</span>
              <span className="vs-sublabel">LIGA {opponent.arena?.league?.toUpperCase() || 'DISCÍPULO'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de Búsqueda
  return (
    <div className={`arena-matchmaking-container ${theme}`}>
      {!isSearching ? (
        <div className="matchmaking-idle">
          <div className="arena-competitive-card">
            <div className="card-main-content">
              <p className="matchmaking-hint">Encuentra un oponente digno y domina el campo de batalla.</p>
              <button className="btn-search-rival pulse-button" onClick={handleStartSearch}>
                BUSCAR RIVAL
              </button>
            </div>
            <div className="card-vertical-title">
              <h2>ARENA COMPETITIVA</h2>
            </div>
          </div>
        </div>
      ) : (
        <div className="matchmaking-searching">
          <div className="radar-spinner"></div>
          <h2>Buscando rival...</h2>
          <p className="fade-text">Analizando Ligas cercanas</p>
          
          {/* Componente estilo Parchis: Caras rotando rápido */}
          <div className="roulette-container">
             <div className="roulette-blur"></div>
             {/* Acá irían avatares pasando rápidamente */}
             <div className="roulette-item shadow-avatar"></div>
          </div>

          <button className="btn-cancel-search" onClick={handleCancelSearch}>
            CANCELAR
          </button>
        </div>
      )}
    </div>
  );
};
