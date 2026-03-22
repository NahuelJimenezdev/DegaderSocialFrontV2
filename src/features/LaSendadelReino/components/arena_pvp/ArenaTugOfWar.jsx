import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../../../../hooks/useSocket';
import { useUserStore } from '../../stores/useUserStore';
import { useAuth } from '../../../../context/AuthContext';
import competitiveBG from '../../assets/fondo_competitivo_one.png';
import './ArenaTugOfWar.css';

// Componente Grid 2x2 para las respuestas
const GridAnswers = ({ options, onSelect, disabled }) => {
    return (
        <div className="grid-answers-container">
            {options?.map((opt, index) => (
                <button 
                    key={opt._id || index}
                    className={`grid-answer-btn ${disabled ? 'disabled' : ''}`}
                    onClick={() => !disabled && onSelect(opt)}
                    disabled={disabled}
                >
                    {opt.text}
                </button>
            ))}
        </div>
    );
};

export const ArenaTugOfWar = ({ matchData, onExit, theme = 'dark' }) => {
    const { socket } = useSocket();
    const { user: authUser } = useAuth(); // Identidad Global del Creyente
    const arenaStore = useUserStore();
    
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
    const isPlayer1 = matchData?.player1Id === authUser?._id;
    console.log('👤 [ARENA_PVP] ¿Soy Player 1?:', isPlayer1, { myId: authUser?._id, p1Id: matchData?.player1Id });
 
    useEffect(() => {
        if (!socket) return;
        console.log('🔌 [ARENA_PVP] Socket listo en TugOfWar, esperando roundStart...');

        // Escuchar inicio de ronda
        socket.on('arena:roundStart', (data) => {
            console.log('⚔️ [ARENA_PVP] ¡Nueva ronda recibida!: ', data);
            
            // Inyectar pregunta Real proveniente de MongoDB
            if (data.question) {
                setCurrentQuestion({
                    id: data.question._id,
                    category: data.question.category || "Desafío Arena",
                    difficulty: data.question.difficulty || "Normal",
                    text: data.question.question,
                    options: data.question.options // Ya viene [{id, text}]
                });
            }
            
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
        // Desacoplado: el frontend asume que tocar responde pero no sabe el resultado real. 
        // El servidor evaluará. Para la UI inmediata podemos mostrar solo que se pulsó.
        setRoundResult('selected'); 

        const timeMs = (10 - timeLeft) * 1000;
        
        socket.emit('arena:submitAnswer', {
            matchId: matchData.matchId,
            questionId: currentQuestion.id,
            selectedOptionId: option.id,
            timeMs: timeMs
        });
    };

    if (matchWinner) {
        const iWon = matchWinner === authUser._id;
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
                    <img src={authUser?.social?.fotoPerfil || '/assets/default-avatar.png'} alt="P1" className="miniavatar p1-color"/>
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
                            src={authUser?.social?.fotoPerfil || '/assets/default-avatar.png'} 
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

                        {/* Grid de Botones 2x2 */}
                        <div className={`grid-wrapper ${isAnswering ? 'hide' : 'slide-up'}`}>
                            <GridAnswers 
                                options={currentQuestion.options} 
                                onSelect={handleSelectAnswer}
                                disabled={isAnswering}
                            />
                        </div>
                        
                        {/* Feedback tras responder (Esperando al rival) */}
                        {isAnswering && !matchWinner && (
                            <div className="waiting-opponent animate-pulse">
                                <span className="text-yellow">¡Respuesta Confirmada!</span>
                                <p>Esperando resultado oficial del servidor...</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
