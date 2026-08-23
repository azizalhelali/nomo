'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  image?: string;
  cta?: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  tourId: string;
  onComplete: () => void;
  isVisible: boolean;
}

export default function OnboardingTour({
  steps,
  tourId,
  onComplete,
  isVisible,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isVisible || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem(`tour_completed_${tourId}`, 'true');
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    localStorage.setItem(`tour_completed_${tourId}`, 'true');
    onComplete();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-sm w-full mx-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-800 dark:from-slate-800 dark:to-slate-900 px-4 py-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">{step.title}</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Image */}
            {step.image && (
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 h-24">
                <img src={step.image} alt={step.title} className="w-full h-full object-contain p-2" />
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-gray-700 dark:text-slate-300 mb-4 leading-relaxed text-right">
              {step.description}
            </p>

            {/* Step Indicator */}
            <div className="flex items-center gap-1.5 mb-3">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-black dark:bg-white w-5'
                      : index < currentStep
                      ? 'bg-black dark:bg-white w-1.5'
                      : 'bg-gray-300 dark:bg-slate-700 w-1.5'
                  }`}
                />
              ))}
            </div>

            {/* Step Count */}
            <p className="text-xs text-gray-600 dark:text-slate-400 mb-4 text-center">
              {currentStep + 1} من {steps.length}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={handlePrevious}
                disabled={isFirstStep}
                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors ${
                  isFirstStep
                    ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-slate-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'
                }`}
              >
                <ChevronRight size={16} />
                السابق
              </button>

              <Button onClick={handleNext} className="flex-1 flex items-center justify-center gap-1 text-sm py-1.5">
                {isLastStep ? 'إنهاء' : 'التالي'}
                {!isLastStep && <ChevronLeft size={16} />}
              </Button>
            </div>

            {/* Skip Option */}
            <button
              onClick={handleClose}
              className="w-full py-1.5 text-xs text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            >
              تخطي
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
