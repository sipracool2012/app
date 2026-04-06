import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Check, Save, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
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
  const location = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  // Seed passportName from navigation state (passed from VisaDetail) or fall back to stored draft value
  const [formData, setFormData] = useState({ visaId, passportName: location.state?.passportName || '' });
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [conflictDrafts, setConflictDrafts] = useState([]);
  const [showConflict, setShowConflict] = useState(false);
  const saveTimeoutRef = useRef(null);

  const fetchVisaOption = async (vId) => {
    const code = vId.split('-')[0].toUpperCase();
    try {
      const res = await fetch(`${BACKEND_URL}/api/countries/${code}/visa-options`);
      if (!res.ok) return null;
      const data = await res.json();
      return (data.options || []).find(o => o.id === vId) || null;
    } catch { return null; }
  };

  // Get logged-in user's email from localStorage
  const getUserEmail = () => {
    const user = getCurrentUser();
    return user?.email || '';
  };

  // Load draft on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/applications/drafts`, {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          const allDrafts = data.drafts || [];

          // Draft for the exact visa the user is currently applying for
          const currentDraft = allDrafts.find(d => d.visaId === visaId);
          // Drafts for other visa options
          const otherDrafts = allDrafts
            .filter(d => d.visaId !== visaId)
            .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

          if (currentDraft) {
            // Load this draft — if coming via "Yes, continue" from conflict popup, start from step 1
            const draft = { ...currentDraft };
            const forceStep1 = location.state?.startFromStep1;
            const savedStep = forceStep1 ? 1 : (draft.currentStep || 1);
            delete draft.userId;
            delete draft.status;
            delete draft.createdAt;
            delete draft.updatedAt;
            delete draft.currentStep;

            let selectedVisaOption = draft.selectedVisaOption || null;
            if (!selectedVisaOption) {
              selectedVisaOption = await fetchVisaOption(visaId);
            }

            // Prefer passportName from nav state; fall back to draft value or country_name on visa option
            const passportName = location.state?.passportName
              || draft.passportName
              || selectedVisaOption?.country_name
              || '';

            setFormData(prev => ({ ...prev, ...draft, visaId, selectedVisaOption, passportName }));
            setCurrentStep(savedStep);
            toast({
              title: t('application.draftLoaded'),
              description: t('application.draftLoadedDesc', { step: savedStep }),
            });
          } else if (otherDrafts.length > 0) {
            // User has draft(s) for different visa(s) — show conflict modal
            setConflictDrafts(otherDrafts);
            setShowConflict(true);
            // Prepare fresh form for the new visa in the background
            const selectedVisaOption = await fetchVisaOption(visaId);
            const passportName = location.state?.passportName || selectedVisaOption?.country_name || '';
            setFormData(prev => ({ ...prev, visaId, selectedVisaOption, passportName }));
          } else {
            // No drafts at all — fresh start
            const selectedVisaOption = await fetchVisaOption(visaId);
            const passportName = location.state?.passportName || selectedVisaOption?.country_name || '';
            setFormData(prev => ({ ...prev, visaId, selectedVisaOption, passportName }));
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

      // When moving to the Document Upload step (step 9), generate an application ID
      // Also replace any TEMP ID with a real APP ID
      if (nextStep === 9 && (!updatedData.applicationId || updatedData.applicationId.startsWith('TEMP'))) {
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
          <p className="text-gray-600">{t('application.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Conflict Modal — existing drafts for different visa options */}
      {showConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  You have existing draft {conflictDrafts.length === 1 ? 'application' : 'applications'}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Would you like to continue one of them, or start a new application?
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {conflictDrafts.map((draft, idx) => (
                <button
                  key={idx}
                  className="w-full text-left border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg p-3 transition-colors"
                  onClick={() => {
                    setShowConflict(false);
                    navigate(`/apply/${draft.visaId}`, { state: { startFromStep1: true } });
                  }}
                >
                  <div className="font-medium text-blue-800 text-sm">
                    {draft.selectedVisaOption?.name || draft.visaId}
                  </div>
                  <div className="text-xs text-blue-500 mt-0.5">
                    Step {draft.currentStep || 1} of {steps.length} saved — click to continue from Step 1
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowConflict(false)}
            >
              No, Start New Application
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Stepper */}
        <Card className="mb-6" data-testid="progress-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('application.step', { current: currentStep, total: steps.length })}: {t(steps[currentStep - 1].nameKey)}
                </h2>
                {formData.selectedVisaOption && (
                  <p className="text-sm text-blue-600 mt-0.5">
                    India {formData.selectedVisaOption.name}{formData.passportName ? ` for ${formData.passportName}` : ''}
                  </p>
                )}
              </div>
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

            {/* Stepper */}
            <div className="relative mt-2">
              {/* Full background line */}
              <div
                className="absolute h-0.5 bg-gray-200"
                style={{ top: '14px', left: '14px', right: '14px' }}
              />
              {/* Green progress line */}
              <div
                className="absolute h-0.5 bg-green-500 transition-all duration-300"
                style={{
                  top: '14px',
                  left: '14px',
                  width: `calc((100% - 28px) * ${(currentStep - 1) / (steps.length - 1)})`
                }}
              />
              {/* Dots + labels */}
              <div className="flex justify-between relative">
                {steps.map((step) => {
                  const isCompleted = step.id < currentStep;
                  const isActive = step.id === currentStep;
                  const isVisited = step.id <= currentStep;
                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center ${isVisited && !isActive ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={() => {
                        if (isVisited && !isActive) {
                          setCurrentStep(step.id);
                          triggerAutoSave(formData, step.id);
                        }
                      }}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold relative z-10 transition-colors ${
                          isCompleted
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                      </div>
                      <span
                        className={`text-xs mt-1 text-center leading-tight hidden sm:block ${
                          isVisited ? 'text-gray-700' : 'text-gray-400'
                        }`}
                        style={{ maxWidth: '52px' }}
                      >
                        {t(step.nameKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
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
