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
            className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-[#1c1c1e]/60 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] border border-gray-200 dark:border-white/5 p-6 md:p-10 shadow-2xl dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)]"
        >
            {/* Indicador de Dificultad iOS Style */}
            <div className="flex justify-center mb-8">
                <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${diffColors[challenge.level] || diffColors.facil}`}>
                    Nivel {challenge.level}
                </span>
            </div>

            {/* Pregunta con tipografía refinada */}
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white text-center mb-12 leading-tight tracking-tight">
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
                            ? 'bg-blue-600 text-white border-transparent shadow-xl shadow-blue-500/20'
                            : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-700 dark:text-white/80 hover:bg-white hover:border-blue-300 dark:hover:bg-white/10 dark:hover:border-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-6">
                            <span className={`w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-black transition-colors ${selected === option.id ? 'bg-white text-blue-600' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/60 group-hover:bg-gray-300 dark:group-hover:bg-white/20'
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
