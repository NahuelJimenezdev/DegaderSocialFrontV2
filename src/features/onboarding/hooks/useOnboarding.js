import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getOnboardingStatus, updateOnboardingProgress, completeOnboarding } from './useOnboardingAPI';

export const useOnboarding = () => {
    const { user } = useAuth();
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [showInitialModal, setShowInitialModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            checkOnboardingStatus();
        }
    }, [user]);

    const checkOnboardingStatus = async () => {
        try {
            setLoading(true);
            const status = await getOnboardingStatus();

            if (!status.hasCompleted) {
                if (status.currentStep !== null && status.currentStep > 0) {
                    // Retomar tour interrumpido
                    setStepIndex(status.currentStep);
                    setRun(true);
                } else {
                    // Primera vez - mostrar modal
                    setShowInitialModal(true);
                }
            }
        } catch (error) {
            console.error('Error checking onboarding status:', error);
        } finally {
            setLoading(false);
        }
    };

    const startTour = () => {
        console.log('🚀 [ONBOARDING] Iniciando tour...');
        setShowInitialModal(false);
        setRun(true);
        setStepIndex(0);
    };

    const skipTour = async () => {
        console.log('⏭️ [ONBOARDING] Saltando tour...');
        try {
            setShowInitialModal(false);
            setRun(false);
            await completeOnboarding();
        } catch (error) {
            console.error('Error skipping tour:', error);
        }
    };

    const handleJoyrideCallback = async (data) => {
        const { action, index, status, type, lifecycle } = data;

        // 🐛 DEBUG: Log completo de cada evento
        console.log('🎯 [ONBOARDING] Joyride Event:', {
            action,
            index,
            status,
            type,
            lifecycle,
            currentStep: index + 1,
            fullData: data
        });

        // Cuando se completa un paso y se hace click en "next"
        if (type === 'step:after' && action === 'next') {
            console.log('➡️ [ONBOARDING] Avanzando al siguiente paso...', { from: index, to: index + 1 });

            // Guardar progreso
            try {
                await updateOnboardingProgress({ currentStep: index + 1 });
                console.log('✅ [ONBOARDING] Progreso guardado');
            } catch (error) {
                console.error('❌ Error saving progress:', error);
            }

            // Avanzar manualmente al siguiente paso
            setStepIndex(index + 1);
        }

        // Tour completado
        if (status === 'finished') {
            console.log('🎉 [ONBOARDING] Tour completado!');
            setRun(false);
            try {
                await completeOnboarding();
            } catch (error) {
                console.error('Error completing tour:', error);
            }
        }

        // Tour saltado o cerrado
        if (status === 'skipped' || action === 'close' || action === 'skip') {
            console.log('❌ [ONBOARDING] Tour cerrado/saltado');
            setRun(false);
            try {
                await completeOnboarding();
            } catch (error) {
                console.error('Error completing tour:', error);
            }
        }
    };

    const restartTour = () => {
        console.log('🔄 [ONBOARDING] Reiniciando tour manualmente...');
        setStepIndex(0);
        setRun(true);
    };

    return {
        run,
        stepIndex,
        showInitialModal,
        loading,
        startTour,
        skipTour,
        handleJoyrideCallback,
        restartTour
    };
};
