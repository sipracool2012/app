import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { getAuthHeaders } from '../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const statusConfig = {
  draft:     { label: 'Draft',          color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  pending:   { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  submitted: { label: 'Submitted',      color: 'bg-blue-100 text-blue-800',   icon: AlertCircle },
  paid:      { label: 'Paid',           color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle },
  processed: { label: 'Processed',      color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
  approved:  { label: 'Approved',       color: 'bg-green-100 text-green-800',  icon: CheckCircle },
  rejected:  { label: 'Rejected',       color: 'bg-red-100 text-red-800',     icon: XCircle },
};

// Ordered workflow steps shown in the stepper.
// 'rejected' is handled separately as a terminal branch.
const WORKFLOW_STEPS = [
  { key: 'pending',   label: 'Pending' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'paid',      label: 'Paid' },
  { key: 'processed', label: 'Processed' },
  { key: 'approved',  label: 'Approved' },
];

const stepIndex = Object.fromEntries(WORKFLOW_STEPS.map((s, i) => [s.key, i]));

/**
 * Horizontal stepper that visualises where an application sits in the
 * Pending → Submitted → Paid → Processed → Approved workflow.
 * Rejected applications show a red terminal indicator instead.
 */
const StatusStepper = ({ status }) => {
  if (status === 'draft') return null;

  const isRejected = status === 'rejected';
  const currentIdx  = isRejected ? -1 : (stepIndex[status] ?? 0);

  return (
    <div className="mt-4 px-1">
      {isRejected ? (
        <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
          <XCircle className="w-4 h-4" />
          Application Rejected
        </div>
      ) : (
        <div className="flex items-center w-full">
          {WORKFLOW_STEPS.map((step, idx) => {
            const done    = idx < currentIdx;
            const active  = idx === currentIdx;
            const future  = idx > currentIdx;

            return (
              <React.Fragment key={step.key}>
                {/* Step node */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                      ${ done   ? 'bg-blue-600 border-blue-600 text-white'
                       : active ? 'bg-white border-blue-600 text-blue-600'
                       :          'bg-white border-gray-300 text-gray-400'}`}
                  >
                    {done ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`mt-1 text-xs whitespace-nowrap
                      ${ done   ? 'text-blue-600 font-medium'
                       : active ? 'text-blue-700 font-semibold'
                       :          'text-gray-400'}`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line between steps */}
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 mb-4 transition-colors
                      ${done ? 'bg-blue-600' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MyApplications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/my-applications`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      toast({ title: t('common.error'), description: 'Failed to load applications.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (id) => {
    if (!window.confirm(t('myApps.deleteDraft'))) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/draft/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app.id !== id));
        toast({ title: t('myApps.deleted'), description: t('myApps.deletedDesc') });
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      toast({ title: t('common.error'), description: 'Failed to delete draft.', variant: 'destructive' });
    }
  };

  const handleContinueDraft = (app) => {
    if (!app.visaId) {
      toast({ title: 'Cannot resume', description: 'Visa info missing. Please start a new application.', variant: 'destructive' });
      return;
    }
    navigate(`/apply/${app.visaId}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-testid="my-applications-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="my-applications-title">{t('myApps.title')}</h1>
            <p className="text-gray-600 mt-1">{t('myApps.subtitle')}</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="new-application-btn"
          >
            {t('myApps.newApplication')}
          </Button>
        </div>

        {applications.length === 0 ? (
          <Card data-testid="no-applications-card">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('myApps.noApps')}</h3>
              <p className="text-gray-500 mb-6">{t('myApps.noAppsDesc')}</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('myApps.startApplication')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4" data-testid="applications-list">
            {applications.map((app) => {
              const status = statusConfig[app.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow" data-testid={`application-card-${app.id}`}>
                  <CardContent className="p-6">
                    {/* Status progress stepper — hidden for drafts */}
                    {app.status !== 'draft' && <StatusStepper status={app.status} />}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`} data-testid={`status-badge-${app.id}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                          <span className="text-sm font-mono text-gray-500" data-testid={`app-id-${app.id}`}>
                            #{app.applicationId || `DRAFT-${app.id.slice(-6).toUpperCase()}`}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          {(app.visaOptionName || app.visaService) && (
                            <p className="font-medium">
                              {app.visaOptionName
                                ? `India ${app.visaOptionName}${app.passportName ? ` for ${app.passportName}` : ''}`
                                : app.visaService
                              }
                            </p>
                          )}
                          {(app.givenNames || app.surname) && (
                            <p className="text-gray-500">
                              {app.givenNames} {app.surname}
                            </p>
                          )}
                          {app.status === 'draft' && (
                            <p className="text-gray-400 text-xs mt-1">
                              {t('myApps.progress', { step: app.currentStep || 1, total: steps.length })}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {app.status === 'draft' ? t('myApps.lastSaved') : t('myApps.submitted')}: {formatDate(app.status === 'draft' ? app.updatedAt : app.submittedDate)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {app.status === 'draft' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleContinueDraft(app)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              data-testid={`continue-draft-${app.id}`}
                            >
                              Continue <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDraft(app.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              data-testid={`delete-draft-${app.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Re-use step count from the steps definition
const steps = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
  { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }
];

export default MyApplications;
