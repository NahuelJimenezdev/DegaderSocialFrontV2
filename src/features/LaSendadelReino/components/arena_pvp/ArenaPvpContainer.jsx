import React, { useState } from 'react';
import { ArenaMatchmaking } from './ArenaMatchmaking';
import { ArenaTugOfWar } from './ArenaTugOfWar';

export const ArenaPvpContainer = ({ onExit }) => {
    const [matchData, setMatchData] = useState(null);

    const handleMatchFound = (data) => {
        setMatchData(data);
    };

    const handleExitGame = () => {
        setMatchData(null);
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
