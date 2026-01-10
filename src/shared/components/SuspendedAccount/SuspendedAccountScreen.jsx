import { useState } from 'react';
import { Ban, FileText, MessageSquare } from 'lucide-react';
import AppealForm from '../../../features/tickets/components/AppealForm';
import TicketViewer from '../../../features/tickets/components/TicketViewer';

/**
 * SuspendedAccountScreen - Pantalla para cuentas suspendidas
 * Muestra información de suspensión con diseño según referencia de Twitter/X
 */
export default function SuspendedAccountScreen({ suspensionInfo }) {
    const [showAppealForm, setShowAppealForm] = useState(false);
    const [showTickets, setShowTickets] = useState(false);

    if (!suspensionInfo) {
        return null;
    }

    const { diasRestantes, isPermanente } = suspensionInfo;

    return (
        <div className="min-h-screen bg-white dark:bg-black p-6">
            <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
                {/* Avatar oscurecido con ícono Ban */}
                <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gray-300 dark:bg-gray-800 rounded-full opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Ban className="w-12 h-12 text-red-500" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Texto principal */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Cuenta suspendida
                </h1>

                {/* Información de suspensión */}
                <div className="text-center max-w-md mb-8">
                    {isPermanente ? (
                        <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                            Degader Social suspendió las cuentas que incumplen las{' '}
                            <a
                                href="https://help.x.com/es/rules-and-policies/x-rules"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Reglas de "Degader Social"
                            </a>
                        </p>
                    ) : (
                        <>
                            <p className="text-gray-600 dark:text-gray-400 text-base mb-4 leading-relaxed">
                                Tu cuenta ha sido suspendida temporalmente por incumplir las{' '}
                                <a
                                    href="https://help.x.com/es/rules-and-policies/x-rules"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Reglas de "Degader Social"
                                </a>
                            </p>

                            {/* Días restantes destacados */}
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Tiempo restante de suspensión:
                                </p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                                    {diasRestantes} {diasRestantes === 1 ? 'día' : 'días'}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md">
                    <button
                        onClick={() => {
                            setShowAppealForm(!showAppealForm);
                            setShowTickets(false);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                                 text-white font-medium rounded-lg transition-colors flex-1"
                    >
                        <FileText className="w-5 h-5" />
                        {showAppealForm ? 'Ocultar Formulario' : 'Apelar Suspensión'}
                    </button>

                    <button
                        onClick={() => {
                            setShowTickets(!showTickets);
                            setShowAppealForm(false);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 
                                 text-white font-medium rounded-lg transition-colors flex-1"
                    >
                        <MessageSquare className="w-5 h-5" />
                        {showTickets ? 'Ocultar Tickets' : 'Ver Mis Tickets'}
                    </button>
                </div>

                {/* Formulario de apelación */}
                {showAppealForm && (
                    <div className="w-full max-w-2xl mb-8">
                        <AppealForm
                            suspensionInfo={suspensionInfo}
                            onSuccess={() => {
                                setShowAppealForm(false);
                                setShowTickets(true);
                            }}
                        />
                    </div>
                )}

                {/* Visor de tickets */}
                {showTickets && (
                    <div className="w-full max-w-2xl mb-8">
                        <TicketViewer />
                    </div>
                )}

                {/* Nota informativa */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Puedes ver las notificaciones del sistema para más información
                    </p>
                </div>
            </div>
        </div>
    );
}
