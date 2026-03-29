import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { getAuthHeaders, getCurrentUser } from '../utils/auth';

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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
  const [formData, setFormData] = useState({ visaId });
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Get logged-in user's email from localStorage
  const getUserEmail = () => {
    const user = getCurrentUser();
    return user?.email || '';
  };

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/applications/draft`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.draft) {
            const draft = data.draft;
            const savedStep = draft.currentStep || 1;
            // Remove internal fields before setting form data
            delete draft.userId;
            delete draft.status;
            delete draft.createdAt;
            delete draft.updatedAt;
            delete draft.currentStep;

            setFormData(prev => ({ ...prev, ...draft, visaId }));
            setCurrentStep(savedStep);
            toast({
              title: 'Draft Loaded',
              description: `Resuming your application from Step ${savedStep}.`,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load draft:', err);
      } finally {
        setDraftLoaded(true);
      }
    };
    loadDraft();
  }, []);

  // Auto-populate email from logged-in user
  useEffect(() => {
    if (draftLoaded) {
      const userEmail = getUserEmail();
      if (userEmail && !formData.email) {
        setFormData(prev => ({ ...prev, email: userEmail }));
      }
    }
  }, [draftLoaded]);

  // Save draft to backend
  const saveDraft = useCallback(async (data, step) => {
    try {
      setSaving(true);
      const userEmail = getUserEmail();
      const payload = {
        ...data,
        currentStep: step,
        email: data.email || userEmail
      };
      // Remove undefined/null values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === null) {
          delete payload[key];
        }
      });

      const res = await fetch(`${BACKEND_URL}/api/applications/draft`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  // Debounced auto-save when step changes
  const triggerAutoSave = useCallback((data, step) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(data, step);
    }, 800);
  }, [saveDraft]);

  const CurrentStepComponent = steps.find(s => s.id === currentStep)?.component;
  const progress = (currentStep / steps.length) * 100;

  const handleNext = async (stepData) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === steps.length) {
      // Final submit
      try {
        const userEmail = getUserEmail();
        const applicationData = { ...updatedData, email: updatedData.email || userEmail };
        const response = await fetch(`${BACKEND_URL}/api/applications`, {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(applicationData)
        });

        if (!response.ok) throw new Error('Failed to submit application');

        const result = await response.json();
        toast({
          title: 'Success!',
          description: `Your application ${result.id} has been submitted successfully.`,
        });
        navigate('/application-success', { state: { applicationId: result.id } });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to submit application. Please try again.',
          variant: 'destructive'
        });
      }
    } else {
      const nextStep = currentStep + 1;

      // When moving to the Document Upload step (step 9), generate an application ID
      if (nextStep === 9 && !updatedData.applicationId) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/applications/assign-id`, {
            method: 'POST',
            headers: getAuthHeaders()
          });
          if (res.ok) {
            const { applicationId } = await res.json();
            const dataWithId = { ...updatedData, applicationId };
            setFormData(dataWithId);
            setCurrentStep(nextStep);
            triggerAutoSave(dataWithId, nextStep);
            return;
          }
        } catch (err) {
          console.error('Failed to assign application ID:', err);
        }
      }

      setCurrentStep(nextStep);
      // Auto-save draft on step change
      triggerAutoSave(updatedData, nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      triggerAutoSave(formData, prevStep);
    }
  };

  if (!draftLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <Card className="mb-6" data-testid="progress-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
              </h2>
              <div className="flex items-center gap-3">
                {saving && (
                  <span className="text-xs text-blue-600 flex items-center gap-1" data-testid="saving-indicator">
                    <Save className="w-3 h-3 animate-pulse" /> Saving...
                  </span>
                )}
                {lastSaved && !saving && (
                  <span className="text-xs text-green-600" data-testid="saved-indicator">
                    Auto-saved
                  </span>
                )}
                <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
              </div>
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
        <Card data-testid="step-content-card">
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
