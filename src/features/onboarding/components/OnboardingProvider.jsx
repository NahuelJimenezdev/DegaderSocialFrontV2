import React, { createContext, useContext, useEffect, useState } from 'react';
import Joyride from 'react-joyride';
import { useOnboarding } from '../hooks/useOnboarding';
import { desktopSteps } from '../config/desktopSteps';
import { mobileSteps } from '../config/mobileSteps';
import OnboardingModal from './OnboardingModal';
import OnboardingTooltip from './OnboardingTooltip';

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
        <OnboardingContext.Provider value={{ restartTour, isMobile }}>
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
                tooltipComponent={OnboardingTooltip}
                styles={{
                    options: {
                        zIndex: 10000,
                        arrowColor: '#fff', // Match with tooltip bg
                        overlayColor: 'rgba(0, 0, 0, 0.5)',
                    }
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
