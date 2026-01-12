import React from 'react';
import { Check } from 'lucide-react';

const CampaignWizardStepper = ({ steps, currentStep }) => {
    return (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px]">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center flex-1">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-2 transition-all duration-300 ${currentStep >= step.number
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                }`}>
                                {currentStep > step.number ? <Check size={24} /> : step.icon}
                            </div>
                            <span className={`text-xs text-center transition-all ${currentStep >= step.number
                                    ? 'text-gray-900 dark:text-white font-semibold'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 mb-6 transition-all duration-300 ${currentStep > step.number
                                    ? 'bg-indigo-600'
                                    : 'bg-gray-200 dark:bg-gray-800'
                                }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CampaignWizardStepper;
