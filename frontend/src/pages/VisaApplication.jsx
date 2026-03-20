import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';

// Import step components
import Step1BasicInfo from '../components/application-steps/Step1BasicInfo';
import Step2ApplicantDetails from '../components/application-steps/Step2ApplicantDetails';
import Step3AddressDetails from '../components/application-steps/Step3AddressDetails';
import Step4FamilyDetails from '../components/application-steps/Step4FamilyDetails';
import Step5ProfessionalDetails from '../components/application-steps/Step5ProfessionalDetails';
import Step6VisaDetails from '../components/application-steps/Step6VisaDetails';
import Step7References from '../components/application-steps/Step7References';
import Step8AdditionalQuestions from '../components/application-steps/Step8AdditionalQuestions';
import Step9DocumentUpload from '../components/application-steps/Step9DocumentUpload';
import Step10Payment from '../components/application-steps/Step10Payment';

const steps = [
  { id: 1, name: 'Basic Info', component: Step1BasicInfo },
  { id: 2, name: 'Applicant Details', component: Step2ApplicantDetails },
  { id: 3, name: 'Address Details', component: Step3AddressDetails },
  { id: 4, name: 'Family Details', component: Step4FamilyDetails },
  { id: 5, name: 'Professional Details', component: Step5ProfessionalDetails },
  { id: 6, name: 'Visa Details', component: Step6VisaDetails },
  { id: 7, name: 'References', component: Step7References },
  { id: 8, name: 'Additional Questions', component: Step8AdditionalQuestions },
  { id: 9, name: 'Documents', component: Step9DocumentUpload },
  { id: 10, name: 'Payment', component: Step10Payment }
];

const VisaApplication = () => {
  const { visaId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ visaId }); // Pass visaId in initial state

  const CurrentStepComponent = steps.find(s => s.id === currentStep)?.component;
  const progress = (currentStep / steps.length) * 100;

  const handleNext = async (stepData) => {
    setFormData({ ...formData, ...stepData });
    
    if (currentStep === steps.length) {
      // Submit application to backend
      try {
        const applicationData = { ...formData, ...stepData };
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/applications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(applicationData)
        });

        if (!response.ok) {
          throw new Error('Failed to submit application');
        }

        const result = await response.json();
        const applicationId = result.id;

        toast({
          title: 'Success!',
          description: `Your application ${applicationId} has been submitted successfully.`,
        });

        navigate('/application-success', { state: { applicationId } });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to submit application. Please try again.',
          variant: 'destructive'
        });
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
              </h2>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />

            {/* Steps indicator */}
            <div className="mt-6 hidden md:flex justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : step.id === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 hidden lg:block">{step.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
                isFirstStep={currentStep === 1}
                isLastStep={currentStep === steps.length}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisaApplication;
