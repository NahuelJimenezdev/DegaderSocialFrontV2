import React from 'react';
import { Check } from 'lucide-react';

const CampaignWizardStepper = ({ steps, currentStep }) => {
    return (
        <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #1a1f3a',
            overflowX: 'auto'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minWidth: '600px'
            }}>
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: currentStep >= step.number ? '#6366f1' : '#1a1f3a',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                marginBottom: '0.5rem',
                                transition: 'all 0.3s'
                            }}>
                                {currentStep > step.number ? <Check size={24} /> : step.icon}
                            </div>
                            <span style={{
                                fontSize: '0.75rem',
                                color: currentStep >= step.number ? '#ffffff' : '#6b7280',
                                textAlign: 'center',
                                fontWeight: currentStep === step.number ? '600' : '400'
                            }}>
                                {step.title}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div style={{
                                flex: 1,
                                height: '2px',
                                backgroundColor: currentStep > step.number ? '#6366f1' : '#1a1f3a',
                                margin: '0 0.5rem 1.5rem',
                                transition: 'all 0.3s'
                            }} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CampaignWizardStepper;
