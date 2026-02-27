import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const ChallengeCard = ({ challenge, onAnswer, disabled }) => {
    const [selected, setSelected] = useState(null);
    
    // Reset selected state when challenge changes
    useEffect(() => {
        setSelected(null);
    }, [challenge._id]);

    const handleSelect = (optionId) => {
        if (disabled || selected) return;
        setSelected(optionId);
        onAnswer(optionId);
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            {/* Modal Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#282832]/40 backdrop-blur-2xl w-full max-w-md rounded-[2.5rem] p-6 relative shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 overflow-hidden"
            >
                {/* Decorative top flare */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-[#f9c61f] to-transparent opacity-70"></div>

                {/* Header */}
                <div className="text-center mt-2 mb-6">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#f9c61f]/20 border border-[#f9c61f]/30 mb-3">
                        <span className="text-[#f9c61f] text-[10px] font-black tracking-[0.2em] uppercase">Misión Arena</span>
                    </div>
                    <h2 className="text-3xl font-black leading-tight text-white drop-shadow-md uppercase italic tracking-tighter">
                        ¿Lo Sabes?
                    </h2>
                </div>

                {/* Question Content */}
                <div className="bg-black/20 rounded-2xl p-6 mb-6 text-center border border-white/5 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f9c61f]/5 rounded-full blur-2xl"></div>
                    <p className="text-lg md:text-xl font-bold text-gray-100 relative z-10 leading-snug">
                        {challenge.question}
                    </p>
                </div>

                {/* Answers / Actions */}
                <div className="space-y-3">
                    {challenge.options.map((option, index) => {
                        const isSelected = selected === option.id;
                        const label = String.fromCharCode(65 + index);
                        
                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                disabled={disabled}
                                className={`w-full group relative overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.02] active:scale-95 ${
                                    isSelected ? 'scale-[1.02] shadow-[0_0_20px_rgba(249,198,31,0.2)]' : ''
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#f9c61f] to-[#ff9100]"></div>
                                )}
                                {!isSelected && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                )}
                                
                                <div className={`relative backdrop-blur-md rounded-xl p-4 flex items-center border transition-all ${
                                    isSelected 
                                    ? 'bg-[#231e0f]/80 border-transparent' 
                                    : 'bg-[#231e0f]/50 border-white/10 group-hover:border-white/30'
                                }`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-black transition-colors ${
                                        isSelected ? 'bg-[#f9c61f] text-black' : 'bg-white/10 text-white/70'
                                    }`}>
                                        {isSelected ? <span className="material-symbols-outlined text-sm">check</span> : label}
                                    </div>
                                    <span className={`font-bold flex-1 text-left ${isSelected ? 'text-[#f9c61f]' : 'text-white'}`}>
                                        {option.text}
                                    </span>
                                    {isSelected && (
                                        <span className="bg-[#f9c61f]/20 text-[#f9c61f] text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-widest">
                                            Seleccionado
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Info Footer */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                        La Senda del Reino • {challenge.level}
                    </p>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

ChallengeCard.propTypes = {
    challenge: PropTypes.shape({
        _id: PropTypes.string,
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
