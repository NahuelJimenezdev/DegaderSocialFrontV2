import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { useUserStore } from '../../stores/useUserStore';
import competitiveBG from '../../assets/fondo_competitivo_one.png';
import './ArenaTugOfWar.css';

// Componente Radial para las respuestas (No vertical)
const RadialAnswers = ({ options, onSelect, disabled }) => {
    // Calcula la posición en un radio
    const radius = 120;
    
    return (
        <div className="radial-answers-container">
            {options.map((opt, index) => {
                // Si son 4 opciones, dividimos 360/4 = 90 grados (en radianes)
                const angle = (index * (360 / options.length)) * (Math.PI / 180);
                const x = Math.sin(angle) * radius;
                const y = -Math.cos(angle) * radius; // negativo para que empiece arriba
                
                return (
                    <button 
                        key={index}
                        className={`radial-btn ${disabled ? 'disabled' : ''}`}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                        onClick={() => !disabled && onSelect(opt)}
                        disabled={disabled}
                    >
                        {opt.text}
                    </button>
                );
            })}
        </div>
    );
};

export const ArenaTugOfWar = ({ matchData, onExit, theme = 'dark' }) => {
    const { socket } = useSocket();
    const user = useUserStore();
    
    // Estados del Juego
    const [gameState, setGameState] = useState({
        domination: 50,
        health1: 3,
        health2: 3,
        streak1: 0,
        streak2: 0,
    });
    
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [isAnswering, setIsAnswering] = useState(false);
    const [roundResult, setRoundResult] = useState(null);
    const [matchWinner, setMatchWinner] = useState(null);
    
    // Identificar quién es P1 y P2 para la UI local
    const isPlayer1 = matchData?.player1Id === user?._id;
    console.log('👤 [ARENA_PVP] ¿Soy Player 1?:', isPlayer1, { myId: user?._id, p1Id: matchData?.player1Id });
 
    useEffect(() => {
        if (!socket) return;
        console.log('🔌 [ARENA_PVP] Socket listo en TugOfWar, esperando roundStart...');

        // Escuchar inicio de ronda
        socket.on('arena:roundStart', (data) => {
            console.log('⚔️ [ARENA_PVP] ¡Nueva ronda recibida!: ', data);
            
            // Mock de pregunta. En la versión real, la buscas del JSON local usando data.questionId
            setCurrentQuestion({
                id: data.questionId,
                category: "Historia",
                difficulty: "Normal",
                text: "¿En qué año cayó el Imperio Romano de Occidente?",
                options: [
                    { id: 'a', text: "476 d.C", isCorrect: true },
                    { id: 'b', text: "395 d.C", isCorrect: false },
                    { id: 'c', text: "1453 d.C", isCorrect: false },
                    { id: 'd', text: "410 d.C", isCorrect: false }
                ]
            });
            
            setIsAnswering(false);
            setRoundResult(null);
            setTimeLeft(10); // 10 Segundos por pregunta
        });

        // Escuchar actualización de estado (Alguien respondió)
        socket.on('arena:gameStateUpdate', (state) => {
            setGameState({
                domination: state.domination,
                health1: state.health1,
                health2: state.health2,
                streak1: state.streak1,
                streak2: state.streak2
            });
            // Mostrar animación de impacto
        });

        // Escuchar Fin del Juego
        socket.on('arena:matchEnded', (data) => {
            console.log('🏆 Fin de Partida', data);
            setMatchWinner(data.winnerId);
            setIsAnswering(true); // Bloquear
        });

        return () => {
            socket.off('arena:roundStart');
            socket.off('arena:gameStateUpdate');
            socket.off('arena:matchEnded');
        };
    }, [socket]);

    // Timer visual circular
    useEffect(() => {
        if (!currentQuestion || isAnswering || timeLeft <= 0) return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    clearInterval(timer);
                    handleTimeout(); // Se acaba el tiempo
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [currentQuestion, isAnswering, timeLeft]);

    const handleTimeout = () => {
        handleSelectAnswer({ id: 'timeout', isCorrect: false });
    };

    const handleSelectAnswer = (option) => {
        setIsAnswering(true);
        setRoundResult(option.isCorrect ? 'correct' : 'incorrect');

        const timeMs = (10 - timeLeft) * 1000;
        
        socket.emit('arena:submitAnswer', {
            matchId: matchData.matchId,
            questionId: currentQuestion.id,
            correct: option.isCorrect,
            timeMs: timeMs
        });
    };

    if (matchWinner) {
        const iWon = matchWinner === user._id;
        return (
            <div className={`tug-match-ended ${iWon ? 'victory' : 'defeat'} animate-fade-in`}>
                <h1>{iWon ? '¡VICTORIA ÉPICA!' : 'DERROTA'}</h1>
                <p>{iWon ? '+30 PG Acumulados' : '-10 PG Restados'}</p>
                <div className="rewards-chest"></div>
                <button className="btn-return" onClick={onExit}>VOLVER A LA ARENA</button>
            </div>
        );
    }

    // Calcula porcentajes de la barra. Player 1 (Azul) empuja a la derecha (Domination sube a 100)
    // Player 2 (Rojo) empuja a la izquierda (Domination baja a 0).
    const blueWidth = `${gameState.domination}%`;
    const redWidth = `${100 - gameState.domination}%`;

    return (
        <div className={`tug-arena-container ${theme}`}>
            {/* Header (Stats y Barra) */}
            <header className="tug-header">
                {/* Player 1 Stats (Izquierda) */}
                <div className="tug-player-stats left-player">
                    <img src={user?.social?.fotoPerfil || '/assets/default-avatar.png'} alt="P1" className="miniavatar p1-color"/>
                    <div className="health-hearts">
                        {Array(3).fill(0).map((_, i) => (
                            <span key={i} className={`heart ${i < gameState.health1 ? 'full' : 'empty'}`}>❤️</span>
                        ))}
                    </div>
                    {gameState.streak1 >= 3 && <span className="streak-fire animate-pulse-fast">🔥 x{gameState.streak1}</span>}
                </div>

                {/* Tug of war bar */}
                <div className="dominance-bar-container">
                    <div className="dominance-blue" style={{ width: blueWidth }}></div>
                    <div className="dominance-swords" style={{ left: blueWidth }}>⚔️</div>
                    <div className="dominance-red" style={{ width: redWidth }}></div>
                </div>

                {/* Player 2 Stats (Derecha) */}
                <div className="tug-player-stats right-player">
                    <img src={matchData.opponent?.social?.fotoPerfil || '/assets/default-avatar.png'} alt="P2" className="miniavatar p2-color"/>
                    <div className="health-hearts">
                        {Array(3).fill(0).map((_, i) => (
                            <span key={i} className={`heart ${i < gameState.health2 ? 'full' : 'empty'}`}>❤️</span>
                        ))}
                    </div>
                    {gameState.streak2 >= 3 && <span className="streak-fire animate-pulse-fast">🔥 x{gameState.streak2}</span>}
                </div>
            </header>

            {/* Escenario Central */}
            <main className="tug-main-stage">
                {/* Avatares en Círculos (Fondo background_1vs1.png) */}
                <div className="stage-avatars-container">
                    <div className="player-avatar-wrapper p1-wrapper animate-slide-in-left">
                        <img 
                            src={user?.social?.fotoPerfil || '/assets/default-avatar.png'} 
                            alt="Mí" 
                            className="stage-avatar p1-avatar"
                        />
                    </div>
                    <div className="player-avatar-wrapper p2-wrapper animate-slide-in-right">
                        <img 
                            src={matchData.opponent?.social?.fotoPerfil || '/assets/default-avatar.png'} 
                            alt="Rival" 
                            className="stage-avatar p2-avatar"
                        />
                    </div>
                </div>

                {!currentQuestion ? (
                    <h2 className="animate-pulse">Preparando ronda...</h2>
                ) : (
                    <div className={`question-stage ${isAnswering ? `answered-${roundResult}` : ''}`}>
                        
                        {/* Temporizador Circular */}
                        <div className="circular-timer-wrapper">
                            <svg className="circular-timer" viewBox="0 0 100 100">
                                <circle className="timer-bg" cx="50" cy="50" r="45" />
                                <circle 
                                    className="timer-progress" 
                                    cx="50" cy="50" r="45" 
                                    strokeDasharray={283}
                                    strokeDashoffset={283 - (timeLeft / 10) * 283}
                                    stroke={timeLeft < 3 ? '#ff3333' : '#00f2fe'}
                                />
                            </svg>
                            <span className="timer-text">{Math.ceil(timeLeft)}</span>
                        </div>

                        {/* Pregunta en el centro */}
                        <div className="question-content">
                            <span className="question-category">{currentQuestion.category}</span>
                            <h3 className="question-text">{currentQuestion.text}</h3>
                        </div>

                        {/* Botones Radiales Ocultos si respondio */}
                        <div className={`radial-wrapper ${isAnswering ? 'hide' : 'slide-up'}`}>
                            <RadialAnswers 
                                options={currentQuestion.options} 
                                onSelect={handleSelectAnswer}
                                disabled={isAnswering}
                            />
                        </div>
                        
                        {/* Feedback tras responder (Esperando al rival) */}
                        {isAnswering && !matchWinner && (
                            <div className="waiting-opponent animate-pulse">
                                {roundResult === 'correct' ? <span className="text-green">¡Respuesta Correcta! Empujando...</span> : <span className="text-red">Incorrecto. Escudos abajo.</span>}
                                <p>Esperando la resolución de la ronda...</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
