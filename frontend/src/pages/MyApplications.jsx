import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { getAuthHeaders } from '../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  pending: { label: 'Pending Review', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const MyApplications = () => {
  const navigate = useNavigate();
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
      toast({ title: 'Error', description: 'Failed to load applications.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (id) => {
    if (!window.confirm('Are you sure you want to delete this draft?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/applications/draft/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setApplications(prev => prev.filter(app => app.id !== id));
        toast({ title: 'Deleted', description: 'Draft deleted successfully.' });
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete draft.', variant: 'destructive' });
    }
  };

  const handleContinueDraft = (app) => {
    // Navigate to application form - it will pick up the draft automatically
    const visaId = app.visaService ? 'draft' : 'new';
    navigate(`/apply/${visaId}`);
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
            <h1 className="text-2xl font-bold text-gray-900" data-testid="my-applications-title">My Applications</h1>
            <p className="text-gray-600 mt-1">Track and manage your visa applications</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="new-application-btn"
          >
            New Application
          </Button>
        </div>

        {applications.length === 0 ? (
          <Card data-testid="no-applications-card">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Applications Yet</h3>
              <p className="text-gray-500 mb-6">Start your visa application to see it here.</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Application
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                          {app.visaService && (
                            <p className="font-medium">{app.visaService}</p>
                          )}
                          {(app.givenNames || app.surname) && (
                            <p className="text-gray-500">
                              {app.givenNames} {app.surname}
                            </p>
                          )}
                          {app.status === 'draft' && (
                            <p className="text-gray-400 text-xs mt-1">
                              Progress: Step {app.currentStep || 1} of {steps.length}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {app.status === 'draft' ? 'Last saved' : 'Submitted'}: {formatDate(app.status === 'draft' ? app.updatedAt : app.submittedDate)}
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
