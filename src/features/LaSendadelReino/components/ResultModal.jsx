import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ResultModal = ({ result, onNext, onExit }) => {
    if (!result) return null;

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-sm bg-[#1c1c1e] border border-white/5 rounded-[48px] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
            >
                <div className={`p-10 text-center ${result.correct ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                    <motion.div
                        initial={{ scale: 0.5, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="text-7xl mb-6"
                    >
                        {result.correct ? '✨' : '📖'}
                    </motion.div>

                    <h2 className={`text-3xl font-black uppercase tracking-tight mb-3 ${result.correct ? 'text-green-400' : 'text-red-400'}`}>
                        {result.correct ? '¡Victoria!' : 'Sigue Fiel'}
                    </h2>

                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed mb-8">
                        {result.correct
                            ? 'Has discernido la verdad con sabiduría.'
                            : 'El conocimiento se adquiere con perseverancia.'}
                    </p>

                    {result.correct && (
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 inline-flex items-center gap-2"
                        >
                            <span className="text-blue-400 font-mono text-2xl font-black tracking-tighter">+{result.gainedXP}</span>
                            <span className="text-blue-400/40 text-[10px] font-black uppercase tracking-widest">XP</span>
                        </motion.div>
                    )}
                </div>

                <div className="p-8 space-y-3">
                    <button
                        onClick={onNext}
                        className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all transform active:scale-95 ${result.correct
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 hover:bg-blue-500'
                                : 'bg-white text-black hover:bg-white/90 shadow-xl shadow-white/5'
                            }`}
                    >
                        Continuar Senda
                    </button>
                    <button
                        onClick={onExit}
                        className="w-full py-4 rounded-3xl bg-transparent text-white/20 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white/40 transition-colors"
                    >
                        Pausar Caminata
                    </button>
                </div>
            </motion.div>
        </div>
    );
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
