import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const ResultModal = ({ result, onNext, onExit }) => {
    if (!result) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            {/* Result Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#282832]/80 backdrop-blur-2xl w-full max-w-sm rounded-[2.5rem] p-8 relative shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 overflow-hidden text-center"
            >
                {/* Decorative top flare */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent ${result.correct ? 'via-[#f9c61f]' : 'via-red-500'} to-transparent opacity-70`}></div>

                <motion.div
                    initial={{ scale: 0.5, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="text-7xl mb-6 drop-shadow-lg"
                >
                    {result.correct ? '✨' : '📖'}
                </motion.div>

                <h2 className={`text-3xl font-black uppercase tracking-tighter italic mb-3 ${result.correct ? 'text-[#f9c61f]' : 'text-red-400'}`}>
                    {result.correct ? '¡Victoria!' : 'Sigue Fiel'}
                </h2>

                <p className="text-gray-100/60 text-sm font-bold uppercase tracking-widest leading-relaxed mb-8">
                    {result.correct
                        ? 'Has discernido la verdad con sabiduría.'
                        : 'El conocimiento se adquiere con perseverancia.'}
                </p>

                {result.correct && (
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-black/40 px-6 py-3 rounded-2xl border border-white/5 inline-flex items-center gap-2 mb-8 shadow-inner"
                    >
                        <span className="text-[#f9c61f] font-black text-2xl tracking-tighter">+{result.gainedXP}</span>
                        <span className="text-[#f9c61f]/40 text-[10px] font-black uppercase tracking-widest">XP</span>
                    </motion.div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={onNext}
                        className={`w-full py-4 rounded-xl font-black text-lg uppercase transition-all transform active:scale-95 shadow-neon flex items-center justify-center gap-2 ${
                            result.correct
                            ? 'bg-gradient-to-r from-[#f9c61f] to-yellow-300 text-black'
                            : 'bg-white text-black'
                        }`}
                    >
                        <span>Siguiente</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    
                    <button
                        onClick={onExit}
                        className="w-full py-3 rounded-xl bg-transparent text-white/30 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors"
                    >
                        Finalizar por ahora
                    </button>
                </div>
            </motion.div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

ResultModal.propTypes = {
    result: PropTypes.shape({
        correct: PropTypes.bool,
        gainedXP: PropTypes.number,
    }),
    onNext: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
};

export default ResultModal;
