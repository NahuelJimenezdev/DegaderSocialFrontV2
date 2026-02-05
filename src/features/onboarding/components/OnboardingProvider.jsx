import React, { createContext, useContext, useEffect, useState } from 'react';
import Joyride from 'react-joyride';
import { useOnboarding } from '../hooks/useOnboarding';
import { desktopSteps } from '../config/desktopSteps';
import { mobileSteps } from '../config/mobileSteps';
import OnboardingModal from './OnboardingModal';

const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const {
        run,
        stepIndex,
        showInitialModal,
        loading,
        startTour,
        skipTour,
        handleJoyrideCallback,
        restartTour
    } = useOnboarding();

    // Detectar cambios de tamaño de ventana
    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 768;
            // DEBUG TEMPORAL: Alert para ver en celular
            if (newIsMobile !== isMobile) {
                // alert(`Cambio tamaño: Ancho=${window.innerWidth}, Mobile=${newIsMobile}`);
            }
            setIsMobile(newIsMobile);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    const steps = isMobile ? mobileSteps : desktopSteps;

    // Log cuando cambian los pasos
    useEffect(() => {
        /* DEBUG: Descomentar si se necesita ver en celular
        alert(`Configuración:
        Ancho: ${window.innerWidth}
        Mobile: ${isMobile}
        Pasos: ${steps.length}
        Run: ${run}
        Index: ${stepIndex}`);
        */

        console.log('🎯 [ONBOARDING] Configuración actual:', {
            isMobile,
            windowWidth: window.innerWidth,
            stepsCount: steps.length,
            stepTargets: steps.map(s => s.target),
            run,
            stepIndex
        });
    }, [isMobile, steps, run, stepIndex]);

    return (
        <OnboardingContext.Provider value={{ restartTour }}>
            {children}

            {/* Modal inicial */}
            {showInitialModal && !loading && (
                <OnboardingModal
                    onStart={startTour}
                    onSkip={skipTour}
                />
            )}

            {/* Tour con Joyride */}
            <Joyride
                steps={steps}
                run={run}
                stepIndex={stepIndex}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                hideCloseButton={false}
                scrollToFirstStep={true}
                disableScrolling={false}
                disableScrollParentFix={true}
                callback={handleJoyrideCallback}
                disableOverlayClose={true}
                disableCloseOnEsc={false}
                spotlightClicks={false}
                floaterProps={{
                    disableAnimation: false,
                }}
                styles={{
                    options: {
                        primaryColor: '#3b82f6',
                        zIndex: 10000,
                        arrowColor: '#fff',
                        backgroundColor: '#fff',
                        overlayColor: 'rgba(0, 0, 0, 0.5)',
                        textColor: '#1f2937',
                        width: 380,
                    },
                    tooltip: {
                        borderRadius: '12px',
                        fontSize: '16px',
                        padding: '20px',
                    },
                    tooltipContainer: {
                        textAlign: 'left',
                    },
                    tooltipTitle: {
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '8px',
                    },
                    tooltipContent: {
                        padding: '8px 0',
                        lineHeight: '1.6',
                    },
                    buttonNext: {
                        backgroundColor: '#3b82f6',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: '600',
                    },
                    buttonBack: {
                        color: '#6b7280',
                        marginRight: '10px',
                        fontSize: '15px',
                    },
                    buttonSkip: {
                        color: '#9ca3af',
                        fontSize: '14px',
                    },
                }}
                locale={{
                    back: 'Atrás',
                    close: 'Cerrar',
                    last: 'Finalizar',
                    next: 'Siguiente',
                    skip: 'Saltar',
                }}
            />
        </OnboardingContext.Provider>
    );
};

export const useOnboardingContext = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboardingContext must be used within OnboardingProvider');
    }
    return context;
};
