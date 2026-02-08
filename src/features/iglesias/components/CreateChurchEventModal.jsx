import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Ticket, Clock, Check } from 'lucide-react';

const CreateChurchEventModal = ({ isOpen, onClose, onCreate, initialData }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dates: [''], // Array of date strings
        time: '',
        provincia: '',
        ciudad: '',
        localidad: '',
        direccion: '',
        guest: '',
        audience: 'General'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                dates: initialData.dates && initialData.dates.length > 0 ? initialData.dates.map(d => d.split('T')[0]) : [''],
                time: initialData.time || '',
                provincia: initialData.location?.provincia || '',
                ciudad: initialData.location?.ciudad || '',
                localidad: initialData.location?.localidad || '',
                direccion: initialData.location?.direccion || '',
                guest: initialData.guest || '',
                audience: initialData.audience || 'General'
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (index, value) => {
        const newDates = [...formData.dates];
        newDates[index] = value;
        setFormData(prev => ({ ...prev, dates: newDates }));
    };

    const addDate = () => {
        setFormData(prev => ({ ...prev, dates: [...prev.dates, ''] }));
    };

    const removeDate = (index) => {
        if (formData.dates.length === 1) return;
        const newDates = formData.dates.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, dates: newDates }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                dates: formData.dates.filter(d => d), // Remove empty
                time: formData.time,
                location: {
                    provincia: formData.provincia,
                    ciudad: formData.ciudad,
                    localidad: formData.localidad,
                    direccion: formData.direccion
                },
                guest: formData.guest,
                audience: formData.audience
            };

            const result = await onCreate(payload);
            if (result.success) {
                onClose();
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al guardar el evento');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Ticket className="colorMarcaDegader" />
                        {initialData ? 'Editar Evento' : 'Crear Evento de Iglesia'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Evento</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ej: Conferencia de Jóvenes 2026"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            placeholder="¿De qué trata el evento?"
                        />
                    </div>

                    {/* Dates & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fechas</label>
                            <div className="space-y-2">
                                {formData.dates.map((date, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => handleDateChange(index, e.target.value)}
                                            required
                                            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                        />
                                        {formData.dates.length > 1 && (
                                            <button type="button" onClick={() => removeDate(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addDate} className="text-sm colorMarcaDegader font-medium hover:underline flex items-center gap-1">
                                    + Agregar otra fecha
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horarios</label>
                            <input
                                type="text"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                placeholder="Ej: 18:00 HS - Apertura"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-500" />
                            Ubicación
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="provincia"
                                value={formData.provincia}
                                onChange={handleChange}
                                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                placeholder="Provincia"
                            />
                            <input
                                type="text"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                placeholder="Ciudad"
                            />
                            <input
                                type="text"
                                name="localidad"
                                value={formData.localidad}
                                onChange={handleChange}
                                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                placeholder="Localidad"
                            />
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                                className="p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                placeholder="Dirección / Calle y Altura"
                            />
                        </div>
                    </div>

                    {/* Guest & Audience */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invitado/a Especial</label>
                            <input
                                type="text"
                                name="guest"
                                value={formData.guest}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                placeholder="Opcional"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Público Dirigido</label>
                            <select
                                name="audience"
                                value={formData.audience}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            >
                                <option value="General">General</option>
                                <option value="Jóvenes">Jóvenes</option>
                                <option value="Matrimonios">Matrimonios</option>
                                <option value="Hombres">Hombres</option>
                                <option value="Mujeres">Mujeres</option>
                                <option value="Líderes">Líderes</option>
                                <option value="Niños">Niños</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Check size={20} />
                        )}
                        {initialData ? 'Guardar Cambios' : 'Crear Evento'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreateChurchEventModal;
