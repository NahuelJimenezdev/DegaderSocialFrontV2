import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { useAuth } from '../../../../hooks/useAuth';
import './ArenaMatchmaking.css';

export const ArenaMatchmaking = ({ onMatchFound, theme = 'dark' }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleMatchFound = (data) => {
      console.log('⚔️ [ARENA] ¡Partida Encontrada!', data);
      setMatchData(data);
      setIsSearching(false);
      
      // Esperar 3 segundos para mostrar la pantalla de VS antes de iniciar el juego
      setTimeout(() => {
        if (onMatchFound) onMatchFound(data);
      }, 3000);
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

  // Pantalla de VS (Match Encontrado)
  if (matchData) {
    const opponent = matchData.opponent;
    const opponentName = `${opponent.nombres?.primero} ${opponent.apellidos?.primero}`;
    
    return (
      <div className={`arena-matchmaking-container ${theme}`}>
        <div className="vs-screen">
          <div className="vs-player vs-player-left animate-slide-in-left">
            <img 
              src={user?.social?.fotoPerfil || '/assets/default-avatar.png'} 
              alt="You" 
              className="vs-avatar"
            />
            <h2 className="vs-name">Tú</h2>
            <div className="vs-league">LIGA {user?.arena?.league?.toUpperCase() || 'DISCÍPULO'}</div>
          </div>
          
          <div className="vs-center animate-pulse-fast">
            <h1 className="vs-text glitch" data-text="VS">VS</h1>
          </div>

          <div className="vs-player vs-player-right animate-slide-in-right">
            <img 
              src={opponent.social?.fotoPerfil || '/assets/default-avatar.png'} 
              alt="Opponent" 
              className="vs-avatar"
            />
            <h2 className="vs-name">{opponentName}</h2>
            <div className="vs-league">LIGA {opponent.arena?.league?.toUpperCase() || 'DISCÍPULO'}</div>
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
          <h2>ARENA COMPETITIVA</h2>
          <p>Encuentra un oponente digno y domina el campo de batalla.</p>
          <button className="btn-search-match pulse-button" onClick={handleStartSearch}>
            BUSCAR RIVAL
          </button>
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
