import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Check, Save, FileText, Clock, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { getAuthHeaders, getCurrentUser } from '../utils/auth';

// Import step components
import Step1BasicInfo from '../components/application-steps/Step1BasicInfo';

/**
 * Live IST clock banner — ticks every second.
 */
const ISTClock = () => {
  const getTime = () => new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const getDate = () => new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const [time, setTime] = useState(getTime);
  const [date, setDate] = useState(getDate);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTime(getTime());
      setDate(getDate());
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 flex items-center gap-2.5 text-sm mb-4">
      <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
      <span className="text-blue-700">
        <span className="font-semibold">Time in India (UTC+05:30)</span>
        {' — '}
        <span className="font-mono">{time}</span>
        {' · '}
        <span>{date}</span>
      </span>
    </div>
  );
};
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
  { id: 1, nameKey: 'steps.basicInfo', fullName: 'Basic Information', component: Step1BasicInfo },
  { id: 2, nameKey: 'steps.applicantDetails', fullName: 'Applicant Details', component: Step2ApplicantDetails },
  { id: 3, nameKey: 'steps.addressDetails', fullName: 'Address Details', component: Step3AddressDetails },
  { id: 4, nameKey: 'steps.familyDetails', fullName: 'Family Details', component: Step4FamilyDetails },
  { id: 5, nameKey: 'steps.professionalDetails', fullName: 'Professional Details', component: Step5ProfessionalDetails },
  { id: 6, nameKey: 'steps.visaDetails', fullName: 'Visa Details', component: Step6VisaDetails },
  { id: 7, nameKey: 'steps.references', fullName: 'References', component: Step7References },
  { id: 8, nameKey: 'steps.additionalQuestions', fullName: 'Additional Questions', component: Step8AdditionalQuestions },
  { id: 9, nameKey: 'steps.documents', fullName: 'Document Upload', component: Step9DocumentUpload },
  { id: 10, nameKey: 'steps.payment', fullName: 'Payment', component: Step10Payment }
];

const VisaApplication = () => {
  const { visaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  // Seed passportName and passportDemonym from navigation state (passed from VisaDetail) or fall back to stored draft value
  const [formData, setFormData] = useState({ visaId, passportName: location.state?.passportName || '', passportDemonym: location.state?.passportDemonym || '' });
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [sameVisaDrafts, setSameVisaDrafts] = useState([]);
  const [showSameVisaModal, setShowSameVisaModal] = useState(false);
  // Track furthest step ever reached (enables forward navigation after going back)
  const [maxVisitedStep, setMaxVisitedStep] = useState(1);
  const saveTimeoutRef = useRef(null);
  const draftIdRef = useRef(null);
  // Holds the live unsaved data from the currently-rendered step component
  const currentStepDataRef = useRef({});
  // Ref mirror of maxVisitedStep so saveDraft (stable useCallback) can always read the current value
  const maxVisitedStepRef = useRef(1);

  // Update both state and ref together
  const updateMaxVisitedStep = useCallback((n) => {
    setMaxVisitedStep(n);
    maxVisitedStepRef.current = n;
  }, []);

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
          const specificDraftId = location.state?.draftId;

          if (specificDraftId) {
            // Coming from My Applications "Continue" — load the exact draft by its ID
            const targetDraft = allDrafts.find(d => d.id === specificDraftId);
            if (targetDraft) {
              const draft = { ...targetDraft };
              const savedStep = draft.currentStep || 1;
              const savedMaxStep = draft._maxVisitedStep || savedStep;
              draftIdRef.current = draft.id;
              delete draft.id;
              delete draft.userId;
              delete draft.status;
              delete draft.createdAt;
              delete draft.updatedAt;
              delete draft.currentStep;
              delete draft._maxVisitedStep;
              let selectedVisaOption = draft.selectedVisaOption || null;
              if (!selectedVisaOption) selectedVisaOption = await fetchVisaOption(visaId);
              const passportName = location.state?.passportName || draft.passportName || selectedVisaOption?.country_name || '';
              const passportDemonym = location.state?.passportDemonym || draft.passportDemonym || '';
              setFormData(prev => ({ ...prev, ...draft, visaId, selectedVisaOption, passportName, passportDemonym }));
              setCurrentStep(savedStep);
              updateMaxVisitedStep(savedMaxStep);
              toast({ title: t('application.draftLoaded'), description: t('application.draftLoadedDesc', { step: savedStep }) });
            } else {
              // Target draft not found (expired/deleted) — fresh start
              const selectedVisaOption = await fetchVisaOption(visaId);
              const passportName = location.state?.passportName || selectedVisaOption?.country_name || '';
              setFormData(prev => ({ ...prev, visaId, selectedVisaOption, passportName, applicationId: undefined }));
            }
          } else {
            // Find all drafts for the current visa
            const sameDrafts = allDrafts.filter(d => d.visaId === visaId);
            if (sameDrafts.length > 0) {
              // Prepare fresh form state and show the "continue or start new" popup
              const selectedVisaOption = await fetchVisaOption(visaId);
              const passportName = location.state?.passportName || selectedVisaOption?.country_name || '';
              setFormData(prev => ({ ...prev, visaId, selectedVisaOption, passportName, applicationId: undefined }));
              setSameVisaDrafts(sameDrafts);
              setShowSameVisaModal(true);
            } else {
              // No drafts for this visa — fresh start (other-visa drafts are ignored)
              const selectedVisaOption = await fetchVisaOption(visaId);
              const passportName = location.state?.passportName || selectedVisaOption?.country_name || '';
              setFormData(prev => ({ ...prev, visaId, selectedVisaOption, passportName, applicationId: undefined }));
            }
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
        _maxVisitedStep: maxVisitedStepRef.current,
        email: data.email || userEmail
      };
      // Attach the draft reference so backend updates the correct document
      if (draftIdRef.current) {
        payload.__draftId = draftIdRef.current;
      }
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
        const result = await res.json();
        // Capture the draftId returned by the server (set on first new-draft creation)
        if (!draftIdRef.current && result.draftId) {
          draftIdRef.current = result.draftId;
        }
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setSaving(false);
    }
  }, []);

  // Called by the active step on every field change so we always have the latest data
  const handleDataChange = useCallback((stepData) => {
    currentStepDataRef.current = stepData;
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
    // stepData already contains the latest values; clear the live ref
    currentStepDataRef.current = {};
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
            headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ visaId: updatedData.visaId || visaId, draftId: draftIdRef.current })
          });
          if (res.ok) {
            const { applicationId } = await res.json();
            const dataWithId = { ...updatedData, applicationId };
            setFormData(dataWithId);
            setCurrentStep(nextStep);
            if (nextStep > maxVisitedStep) updateMaxVisitedStep(nextStep);
            triggerAutoSave(dataWithId, nextStep);
            return;
          }
        } catch (err) {
          console.error('Failed to assign application ID:', err);
        }
      }

      setCurrentStep(nextStep);
      if (nextStep > maxVisitedStep) updateMaxVisitedStep(nextStep);
      // Auto-save draft on step change
      triggerAutoSave(updatedData, nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Merge any unsaved changes from the current step before navigating away
      const latestData = { ...formData, ...currentStepDataRef.current };
      currentStepDataRef.current = {};
      setFormData(latestData);
      // Save at currentStep (not prevStep) so _maxVisitedStep is preserved in the draft
      triggerAutoSave(latestData, currentStep);
      setCurrentStep(currentStep - 1);
    }
  };

  // Navigate to any step that has already been reached.
  // Merges the live unsaved data from the current step before switching.
  const jumpToStep = (stepId) => {
    if (stepId !== currentStep && stepId <= maxVisitedStep) {
      const latestData = { ...formData, ...currentStepDataRef.current };
      currentStepDataRef.current = {};
      setFormData(latestData);
      triggerAutoSave(latestData, stepId);
      setCurrentStep(stepId);
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
      {/* Same-visa drafts modal */}
      {showSameVisaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Continue existing application?</h3>
                <p className="text-gray-500 text-sm mt-1">
                  You have {sameVisaDrafts.length} saved draft{sameVisaDrafts.length !== 1 ? 's' : ''} for this visa.
                  Continue one or start fresh for another applicant.
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto">
              {sameVisaDrafts.map((draft) => {
                const name = [draft.givenNames, draft.surname].filter(Boolean).join(' ') || 'Unnamed applicant';
                const step = draft.currentStep || 1;
                const savedDate = draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : '';
                return (
                  <button
                    key={draft.id}
                    className="w-full text-left border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg p-3 transition-colors"
                    onClick={async () => {
                      setShowSameVisaModal(false);
                      const d = { ...draft };
                      draftIdRef.current = d.id || null;
                      const savedMaxStep = d._maxVisitedStep || step;
                      delete d.id; delete d.userId; delete d.status;
                      delete d.createdAt; delete d.updatedAt; delete d.currentStep;
                      delete d._maxVisitedStep;
                      let selectedVisaOption = d.selectedVisaOption || null;
                      if (!selectedVisaOption) selectedVisaOption = await fetchVisaOption(visaId);
                      const passportName = location.state?.passportName || d.passportName || selectedVisaOption?.country_name || '';
                      const passportDemonym = location.state?.passportDemonym || d.passportDemonym || '';
                      setFormData(prev => ({ ...prev, ...d, visaId, selectedVisaOption, passportName, passportDemonym }));
                      setCurrentStep(step);
                      updateMaxVisitedStep(savedMaxStep);
                      toast({ title: t('application.draftLoaded'), description: t('application.draftLoadedDesc', { step }) });
                    }}
                  >
                    <div className="font-medium text-blue-800 text-sm">{name}</div>
                    <div className="text-xs text-blue-500 mt-0.5">
                      Step {step} of {steps.length} · Last saved {savedDate}
                    </div>
                  </button>
                );
              })}
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => { setShowSameVisaModal(false); draftIdRef.current = null; }}
            >
              + Start New Application
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
                    {formData.selectedVisaOption.name}{(formData.passportDemonym || formData.passportName) ? ` for ${formData.passportDemonym || formData.passportName} Citizens` : ''}
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
                className="absolute h-1 bg-gray-200 rounded-full"
                style={{ top: '14px', left: '16px', right: '16px' }}
              />
              {/* Green progress line — extends to furthest visited step */}
              <div
                className="absolute h-1 bg-green-500 rounded-full transition-all duration-300"
                style={{
                  top: '14px',
                  left: '16px',
                  width: `calc((100% - 32px) * ${(maxVisitedStep - 1) / (steps.length - 1)})`
                }}
              />
              {/* Dots + labels */}
              <div className="flex justify-between relative">
                {steps.map((step) => {
                  const isCompleted = step.id < currentStep;
                  const isActive = step.id === currentStep;
                  const isVisitedAhead = step.id > currentStep && step.id <= maxVisitedStep;
                  const isClickable = (isCompleted || isVisitedAhead) && !isActive;
                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center ${
                        isClickable ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      onClick={() => isClickable && jumpToStep(step.id)}
                      title={isClickable ? `Go to ${step.fullName}` : undefined}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors ring-2 ring-white ${
                          isCompleted
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : isActive
                            ? 'bg-green-500 text-white'
                            : isVisitedAhead
                            ? 'bg-white border-2 border-green-500 text-green-600 hover:bg-green-50'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : isActive ? (
                          <MoreHorizontal className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{step.id}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs mt-1 text-center leading-tight hidden sm:block ${
                          isActive
                            ? 'text-green-700 font-semibold'
                            : isCompleted
                            ? 'text-gray-700'
                            : isVisitedAhead
                            ? 'text-green-600'
                            : 'text-gray-400'
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

        {/* IST Clock Banner */}
        <ISTClock />

        {/* Step Content */}
        <Card data-testid="step-content-card">
          <CardContent className="p-6">
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
                onDataChange={handleDataChange}
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
