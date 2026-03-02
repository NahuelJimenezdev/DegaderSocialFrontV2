import React, { useState } from 'react';
import { ArenaMatchmaking } from './ArenaMatchmaking';
import { ArenaTugOfWar } from './ArenaTugOfWar';
import { useArenaStore } from '../../stores/useArenaStore';

export const ArenaPvpContainer = ({ onExit }) => {
    const [matchData, setMatchData] = useState(null);
    const setIsGaming = useArenaStore(state => state.setIsGaming);

    const handleMatchFound = (data) => {
        setMatchData(data);
        setIsGaming(true);
    };

    const handleExitGame = () => {
        setMatchData(null);
        setIsGaming(false);
        if (onExit) onExit();
    };

    return (
        <div className="arena-pvp-wrapper w-full h-full min-h-[500px] flex items-center justify-center relative">
            {!matchData ? (
                <ArenaMatchmaking onMatchFound={handleMatchFound} />
            ) : (
                <div className="fixed inset-0 z-[9999]">
                    <ArenaTugOfWar matchData={matchData} onExit={handleExitGame} />
                </div>
            )}
        </div>
    );
};
