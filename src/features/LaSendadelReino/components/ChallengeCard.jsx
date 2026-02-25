import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ChallengeCard = ({ challenge, onAnswer, disabled }) => {
    const [selected, setSelected] = useState(null);

    const handleSelect = (optionId) => {
        if (disabled) return;
        setSelected(optionId);
        onAnswer(optionId);
    };

    const diffColors = {
        facil: 'text-green-400 bg-green-500/10 border-green-500/20',
        medio: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        dificil: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        experto: 'text-red-400 bg-red-500/10 border-red-500/20'
    };

    return (
        <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-2xl mx-auto bg-[#1c1c1e]/60 backdrop-blur-3xl rounded-[48px] border border-white/5 p-10 shadow-[0_32px_64px_rgba(0,0,0,0.4)]"
        >
            {/* Indicador de Dificultad iOS Style */}
            <div className="flex justify-center mb-8">
                <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${diffColors[challenge.level] || diffColors.facil}`}>
                    Nivel {challenge.level}
                </span>
            </div>

            {/* Pregunta con tipografía refinada */}
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-12 leading-tight tracking-tight">
                {challenge.question}
            </h2>

            {/* Opciones con interacción premium */}
            <div className="grid grid-cols-1 gap-4">
                {challenge.options.map((option, index) => (
                    <motion.button
                        key={option.id}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(option.id)}
                        disabled={disabled}
                        className={`group relative p-6 rounded-3xl text-left transition-all border ${selected === option.id
                            ? 'bg-white text-black border-transparent shadow-[0_12px_24px_rgba(255,255,255,0.1)]'
                            : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:border-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-6">
                            <span className={`w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-black transition-colors ${selected === option.id ? 'bg-black text-white' : 'bg-white/10 text-white/60 group-hover:bg-white/20'
                                }`}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="font-bold text-lg tracking-tight">{option.text}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

ChallengeCard.propTypes = {
    challenge: PropTypes.shape({
        id: PropTypes.string,
        question: PropTypes.string,
        level: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            text: PropTypes.string,
        })),
    }).isRequired,
    onAnswer: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default ChallengeCard;
