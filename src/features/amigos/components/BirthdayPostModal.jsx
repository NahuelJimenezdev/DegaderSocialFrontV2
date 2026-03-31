import React, { useState } from 'react';
import { X, Send, Type, AlignLeft } from 'lucide-react';
import { postService } from '../../../api';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

const BirthdayPostModal = ({ isOpen, onClose, targetUser, currentUser }) => {
    const [title, setTitle] = useState('¡Feliz Cumpleaños!');
    const [message, setMessage] = useState('');
    const [titleFont, setTitleFont] = useState('Bebas Neue, sans-serif');
    const [textFont, textFontState] = useState('Montserrat, sans-serif');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    if (!isOpen) return null;

    const fonts = [
        { name: 'Bebas Neue', value: "'Bebas Neue', sans-serif", type: 'formal' },
        { name: 'Montserrat', value: "'Montserrat', sans-serif", type: 'modern' },
        { name: 'Helvetica', value: "Helvetica, Arial, sans-serif", type: 'classic' },
        { name: 'Gotham', value: "'Gotham', sans-serif", type: 'modern' },
        { name: 'Italic Gotham', value: "'Gotham', sans-serif", style: 'italic', type: 'informal' },
        { name: 'Mono / Code', value: "'Courier New', Courier, monospace", type: 'code' },
    ];

    const handleSubmit = async () => {
        if (!message.trim()) {
            toast.error('Escribe un mensaje para el cumpleañero');
            return;
        }

        setIsSubmitting(true);
        try {
            const postData = {
                contenido: message,
                tipo: 'cumpleaños',
                privacidad: 'publico',
                metadatos: {
                    title: title,
                    titleFont: titleFont,
                    textFont: textFont,
                    targetUser: targetUser._id || targetUser.id
                }
            };

            const response = await postService.createPost(postData);
            if (response.success) {
                toast.success('¡Tarjeta de cumpleaños enviada!');
                onClose();
            } else {
                throw new Error(response.message || 'Error al enviar');
            }
        } catch (error) {
            console.error('Error sending birthday card:', error);
            toast.error('No se pudo enviar la tarjeta');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
                {/* Header Estilo iOS */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <X size={22} />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enviar Tarjeta</h2>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || !message.trim()}
                        className="p-2 -mr-2 rounded-full text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-30 transition-all"
                    >
                        {isSubmitting ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" /> : <Send size={22} />}
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* Preview Contextalizada */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[2px] text-center">Vista Previa Final</h3>
                        
                        {/* Simulación del PostCard real */}
                        <div className="birthday-card rounded-2xl border border-gray-100 dark:border-gray-800 p-6 min-h-[180px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
                            {/* Globos minificados (puramente visuales) */}
                            <div className="absolute top-[-10px] left-[-10px] w-12 h-16 rounded-full bg-blue-400/20 blur-sm"></div>
                            <div className="absolute top-[-5px] right-[-5px] w-10 h-14 rounded-full bg-yellow-400/20 blur-sm"></div>
                            
                            <div className="birthday-card-content space-y-3 text-center relative z-10 w-full">
                                <h4 
                                    style={{ 
                                        fontFamily: titleFont, 
                                        fontWeight: 'bold', 
                                        fontSize: '1.4rem',
                                        color: '#1a202c' // Forzamos oscuro en preview clara del modal
                                    }} 
                                    className="dark:text-white leading-tight"
                                >
                                    {title || '¡Feliz Cumpleaños!'}
                                </h4>
                                <p 
                                    style={{ 
                                        fontFamily: textFont,
                                        color: '#4a5568' // Forzamos gris oscuro en preview
                                    }} 
                                    className="dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed"
                                >
                                    {message || 'Escribe tu mensaje personal aquí...'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        {/* Título y su fuente */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Type size={16} /> Encabezado Festivo
                            </label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej: ¡Feliz Cumpleaños!"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white"
                            />
                            <div className="flex flex-wrap gap-2 pt-1">
                                {fonts.filter(f => f.type !== 'code').map(font => (
                                    <button
                                        key={font.name}
                                        onClick={() => setTitleFont(font.value)}
                                        className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all border ${titleFont === font.value ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-400'}`}
                                        style={{ fontFamily: font.value, fontStyle: font.style || 'normal' }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mensaje y su fuente */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <AlignLeft size={16} /> Tu Dedicatoria
                            </label>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe un saludo cordial o gracioso..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-white resize-none"
                            />
                            <div className="flex flex-wrap gap-2 pt-1 font-select">
                                {fonts.map(font => (
                                    <button
                                        key={font.name}
                                        onClick={() => textFontState(font.value)}
                                        className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all border ${textFont === font.value ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-200' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-400'}`}
                                        style={{ fontFamily: font.value, fontStyle: font.style || 'normal' }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-0">
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting || !message.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Tarjeta Festiva'}
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-4">
                        La tarjeta será visible para todos en el feed de la plataforma.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BirthdayPostModal;
