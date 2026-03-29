import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Check, Save } from 'lucide-react';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const steps = [
  { id: 1, nameKey: 'steps.basicInfo', component: Step1BasicInfo },
  { id: 2, nameKey: 'steps.applicantDetails', component: Step2ApplicantDetails },
  { id: 3, nameKey: 'steps.addressDetails', component: Step3AddressDetails },
  { id: 4, nameKey: 'steps.familyDetails', component: Step4FamilyDetails },
  { id: 5, nameKey: 'steps.professionalDetails', component: Step5ProfessionalDetails },
  { id: 6, nameKey: 'steps.visaDetails', component: Step6VisaDetails },
  { id: 7, nameKey: 'steps.references', component: Step7References },
  { id: 8, nameKey: 'steps.additionalQuestions', component: Step8AdditionalQuestions },
  { id: 9, nameKey: 'steps.documents', component: Step9DocumentUpload },
  { id: 10, nameKey: 'steps.payment', component: Step10Payment }
];

const VisaApplication = () => {
  const { visaId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ visaId });
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Get logged-in user's email from localStorage
  const getUserEmail = () => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return user.email || '';
    } catch {
      return '';
    }
  };

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}/api/applications/draft`, {
          headers: { 'Authorization': `Bearer ${token}` }
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
              title: t('application.draftLoaded'),
              description: t('application.draftLoadedDesc', { step: savedStep }),
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
      const token = localStorage.getItem('token');
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(applicationData)
        });

        if (!response.ok) throw new Error('Failed to submit application');

        const result = await response.json();
        toast({
          title: t('common.success'),
          description: t('application.submitSuccess', { id: result.id }),
        });
        navigate('/application-success', { state: { applicationId: result.id } });
      } catch (error) {
        toast({
          title: t('common.error'),
          description: t('application.submitError'),
          variant: 'destructive'
        });
      }
    } else {
      const nextStep = currentStep + 1;
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
          <p className="text-gray-600">{t('application.loading')}</p>
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
                {t('application.step', { current: currentStep, total: steps.length })}: {t(steps[currentStep - 1].nameKey)}
              </h2>
              <div className="flex items-center gap-3">
                {saving && (
                  <span className="text-xs text-blue-600 flex items-center gap-1" data-testid="saving-indicator">
                    <Save className="w-3 h-3 animate-pulse" /> {t('application.saving')}
                  </span>
                )}
                {lastSaved && !saving && (
                  <span className="text-xs text-green-600" data-testid="saved-indicator">
                    {t('application.autoSaved')}
                  </span>
                )}
                <span className="text-sm text-gray-600">{t('application.complete', { percent: Math.round(progress) })}</span>
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
                  <span className="text-xs mt-1 text-gray-600 hidden lg:block">{t(step.nameKey)}</span>
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
