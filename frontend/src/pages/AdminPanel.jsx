import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Filter, Search, Eye, Settings, Globe, Save, ChevronDown, ChevronUp, CreditCard, Users, AlertTriangle, Mail, Wrench } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import PaymentGatewaySettings from '../components/admin/PaymentGatewaySettings';
import { FlagIcon } from '../components/ui/FlagIcon';
import UserManagement from '../components/admin/UserManagement';
import EmailProviderSettings from '../components/admin/EmailProviderSettings';
import UtilitySettings from '../components/admin/UtilitySettings';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('applications');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Applications state
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Country config state
  const [countries, setCountries] = useState([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [expandedCountry, setExpandedCountry] = useState(null);
  const [savingCountry, setSavingCountry] = useState(null);

  // Bulk tourist fee defaults state
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkFees, setBulkFees] = useState({
    tourist_30d_govt_fee_apr_jun: '',
    tourist_30d_govt_fee_jul_mar: '',
    tourist_30d_our_fee: '',
    tourist_1yr_govt_fee: '',
    tourist_1yr_our_fee: '',
    tourist_5yr_govt_fee: '',
    tourist_5yr_our_fee: '',
  });

  const handleBulkSave = async () => {
    const payload = {};
    Object.entries(bulkFees).forEach(([k, v]) => {
      const num = parseFloat(v);
      if (!isNaN(num) && v !== '') payload[k] = num;
    });
    if (Object.keys(payload).length === 0) {
      toast({ title: 'Nothing to save', description: 'Enter at least one fee value.', variant: 'destructive' });
      return;
    }
    setBulkSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/countries/bulk-tourist-fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      toast({
        title: 'Bulk update complete',
        description: `Updated ${data.updated} countries, created ${data.created} new entries.`,
      });
      // Refresh countries list so changes reflect immediately
      const refreshed = await fetch(`${BACKEND_URL}/api/countries/all`);
      if (refreshed.ok) setCountries(await refreshed.json());
    } catch (e) {
      toast({ title: 'Error', description: 'Bulk update failed.', variant: 'destructive' });
    } finally {
      setBulkSaving(false);
    }
  };

  useEffect(() => {
    // Fetch current user info
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          navigate('/signin');
          return;
        }

        const data = await response.json();
        
        // Check if user has admin or super_admin role
        if (data.role !== 'admin' && data.role !== 'super_admin') {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access the Admin Panel. Only administrators can access this area.',
            variant: 'destructive'
          });
          navigate('/');
          return;
        }

        setCurrentUser(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        navigate('/signin');
      }
    };

    fetchCurrentUser();

    // Load applications from API (including drafts for full stat counts)
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/applications?include_drafts=true`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast({
          title: 'Error',
          description: 'Failed to load applications',
          variant: 'destructive'
        });
      }
    };
    
    fetchApplications();
  }, [toast, navigate]);

  // Fetch countries when tab changes
  useEffect(() => {
    if (activeTab === 'countries') {
      fetchCountries();
    }
  }, [activeTab]);

  const fetchCountries = async () => {
    try {
      // First try to seed sample data
      await fetch(`${BACKEND_URL}/api/countries/seed`, { method: 'POST' });
      
      const response = await fetch(`${BACKEND_URL}/api/countries/all`);
      const data = await response.json();
      setCountries(data);
      setFilteredCountries(data);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load country configurations',
        variant: 'destructive'
      });
    }
  };

  // Filter countries by search
  useEffect(() => {
    if (countrySearch) {
      const filtered = countries.filter(c => 
        c.country_name?.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.country_code?.toLowerCase().includes(countrySearch.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [countrySearch, countries]);

  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter === 'all') {
      // "All" excludes drafts — admins must explicitly select "Draft" to see them
      filtered = filtered.filter(app => app.status !== 'draft');
    } else {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.givenNames?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApps(filtered);
  }, [searchTerm, statusFilter, applications]);

  const updateStatus = async (appId, newStatus) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updated = applications.map(app =>
        app.applicationId === appId ? { ...app, status: newStatus } : app
      );
      setApplications(updated);
      
      toast({
        title: 'Status Updated',
        description: `Application ${appId} marked as ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const downloadCSV = async (application) => {
    try {
      const url = `${BACKEND_URL}/api/applications/export?ids=${application.applicationId}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${application.applicationId}_application.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download application',
        variant: 'destructive'
      });
    }
  };

  const downloadAllCSV = async () => {
    try {
      const ids = filteredApps.map(app => app.applicationId).join(',');
      const url = `${BACKEND_URL}/api/applications/export${ids ? `?ids=${ids}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: 'Download Started',
        description: `Downloading ${filteredApps.length} applications`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download applications',
        variant: 'destructive'
      });
    }
  };

  const updateCountryConfig = (countryCode, field, value) => {
    setCountries(prev => prev.map(c => 
      c.country_code === countryCode 
        ? { ...c, [field]: value }
        : c
    ));
  };

  const saveCountryConfig = async (country) => {
    setSavingCountry(country.country_code);
    try {
      const response = await fetch(`${BACKEND_URL}/api/countries/${country.country_code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country_enabled: country.country_enabled,
          tourist_enabled: country.tourist_enabled,
          tourist_30d_enabled: country.tourist_30d_enabled,
          tourist_30d_govt_fee_apr_jun: parseFloat(country.tourist_30d_govt_fee_apr_jun) || 0,
          tourist_30d_govt_fee_jul_mar: parseFloat(country.tourist_30d_govt_fee_jul_mar) || 0,
          tourist_30d_our_fee: parseFloat(country.tourist_30d_our_fee) || 0,
          tourist_1yr_enabled: country.tourist_1yr_enabled,
          tourist_1yr_govt_fee: parseFloat(country.tourist_1yr_govt_fee) || 0,
          tourist_1yr_our_fee: parseFloat(country.tourist_1yr_our_fee) || 0,
          tourist_5yr_enabled: country.tourist_5yr_enabled,
          tourist_5yr_govt_fee: parseFloat(country.tourist_5yr_govt_fee) || 0,
          tourist_5yr_our_fee: parseFloat(country.tourist_5yr_our_fee) || 0,
          business_enabled: country.business_enabled,
          business_govt_fee: parseFloat(country.business_govt_fee) || 0,
          business_our_fee: parseFloat(country.business_our_fee) || 0,
          conference_enabled: country.conference_enabled,
          conference_govt_fee: parseFloat(country.conference_govt_fee) || 0,
          conference_our_fee: parseFloat(country.conference_our_fee) || 0,
          medical_enabled: country.medical_enabled,
          medical_govt_fee: parseFloat(country.medical_govt_fee) || 0,
          medical_our_fee: parseFloat(country.medical_our_fee) || 0,
          medical_attendant_enabled: country.medical_attendant_enabled,
          medical_attendant_govt_fee: parseFloat(country.medical_attendant_govt_fee) || 0,
          medical_attendant_our_fee: parseFloat(country.medical_attendant_our_fee) || 0,
          transit_enabled: country.transit_enabled,
          transit_govt_fee: parseFloat(country.transit_govt_fee) || 0,
          transit_our_fee: parseFloat(country.transit_our_fee) || 0,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      toast({
        title: 'Saved',
        description: `Configuration for ${country.country_name} saved successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save configuration',
        variant: 'destructive'
      });
    } finally {
      setSavingCountry(null);
    }
  };

  // Status workflow
  // pending   → (system only, set when app is started)
  // submitted → set when user clicks Pay
  // paid      → set when payment is confirmed
  // processed → admin marks as processed
  // approved  → admin final approval
  // rejected  → admin final rejection
  const ALLOWED_TRANSITIONS = {
    pending:   ['submitted'],           // admin can manually advance if needed
    submitted: ['paid', 'rejected'],
    paid:      ['processed', 'rejected'],
    processed: ['approved', 'rejected'],
    approved:  [],                      // terminal
    rejected:  [],                      // terminal
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft:     'bg-gray-100 text-gray-600',
      pending:   'bg-yellow-100 text-yellow-800',
      submitted: 'bg-blue-100 text-blue-800',
      paid:      'bg-indigo-100 text-indigo-800',
      processed: 'bg-purple-100 text-purple-800',
      approved:  'bg-green-100 text-green-800',
      rejected:  'bg-red-100 text-red-800',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status?.toUpperCase()}
      </Badge>
    );
  };

  // Show loading state while checking user role
  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">
              Manage visa applications and country configurations
              {currentUser && (
                <span className="ml-2">
                  • Logged in as <span className="font-semibold">{currentUser.fullName}</span>
                  <Badge className={`ml-2 ${currentUser.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {currentUser.role === 'super_admin' ? 'Super Admin' : currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  </Badge>
                </span>
              )}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Super Admin sees 5 tabs; regular Admin sees 1 tab (Applications only) */}
          <TabsList className={`grid w-full ${currentUser?.role === 'super_admin' ? 'max-w-5xl grid-cols-6' : 'max-w-xs grid-cols-1'}`}>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Applications
            </TabsTrigger>
            {/* Country Config — Super Admin only */}
            {currentUser?.role === 'super_admin' && (
              <TabsTrigger value="countries" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Country Config
              </TabsTrigger>
            )}
            {/* Payment Gateways — Super Admin only */}
            {currentUser?.role === 'super_admin' && (
              <TabsTrigger value="payment-gateways" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Gateways
              </TabsTrigger>
            )}
            {/* Email Providers — Super Admin only */}
            {currentUser?.role === 'super_admin' && (
              <TabsTrigger value="email-providers" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Providers
              </TabsTrigger>
            )}
            {/* User Management — Super Admin only */}
            {currentUser?.role === 'super_admin' && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Management
              </TabsTrigger>
            )}
            {/* Utility — Super Admin only */}
            {currentUser?.role === 'super_admin' && (
              <TabsTrigger value="utility" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Utility
              </TabsTrigger>
            )}
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Draft</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-500">
                    {applications.filter(a => a.status === 'draft').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications.filter(a => a.status === 'pending').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Submitted</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {applications.filter(a => a.status === 'submitted').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Paid</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-indigo-600">
                    {applications.filter(a => a.status === 'paid').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter(a => a.status === 'approved').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-red-600">
                    {applications.filter(a => a.status === 'rejected').length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by ID, email, or name..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft / In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={downloadAllCSV}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={filteredApps.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All ({filteredApps.length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Applications Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Nationality</TableHead>
                        <TableHead>Visa Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                            No applications found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredApps.map((app) => (
                          <TableRow key={app.applicationId}>
                            <TableCell className="font-medium">
                              {app.applicationId
                                ? app.applicationId
                                : <span className="text-gray-400 italic">Not assigned</span>}
                            </TableCell>
                            <TableCell>{app.surname || app.givenNames ? `${app.surname || ''} ${app.givenNames || ''}`.trim() : <span className="text-gray-400 italic">—</span>}</TableCell>
                            <TableCell>{app.email || <span className="text-gray-400 italic">—</span>}</TableCell>
                            <TableCell>{app.nationality || <span className="text-gray-400 italic">—</span>}</TableCell>
                            <TableCell>{app.visaService || <span className="text-gray-400 italic">—</span>}</TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                            <TableCell>
                              {app.submittedDate && app.submittedDate !== 'None' && app.submittedDate !== ''
                                ? new Date(app.submittedDate).toLocaleDateString()
                                : <span className="text-gray-400 italic">Not submitted</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {/* Drafts only show a delete button — no status transitions until submitted */}
                                {app.status === 'draft' ? (
                                  <span className="text-xs text-gray-400 italic">In Progress</span>
                                ) : currentUser?.role === 'super_admin' || (ALLOWED_TRANSITIONS[app.status] || []).length > 0 ? (
                                  <Select
                                    value={app.status}
                                    onValueChange={(value) => updateStatus(app.applicationId, value)}
                                  >
                                    <SelectTrigger className="w-36">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentUser?.role === 'super_admin' ? (
                                        // Super admin sees every status
                                        ['pending', 'submitted', 'paid', 'processed', 'approved', 'rejected'].map(s => (
                                          <SelectItem key={s} value={s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                            {s === app.status ? ' (current)' : ''}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        // Regular admin: current status as disabled reference + allowed next states only
                                        <>
                                          <SelectItem value={app.status} disabled>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)} (current)
                                          </SelectItem>
                                          {(ALLOWED_TRANSITIONS[app.status] || []).map(next => (
                                            <SelectItem key={next} value={next}>
                                              {next.charAt(0).toUpperCase() + next.slice(1)}
                                            </SelectItem>
                                          ))}
                                        </>
                                      )}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  getStatusBadge(app.status)
                                )}
                                {app.status !== 'draft' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadCSV(app)}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Country Configuration Tab — Super Admin only */}
          {currentUser?.role === 'super_admin' && <TabsContent value="countries" className="space-y-6">

            {/* ── Bulk Tourist Fee Defaults ── */}
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
              <CardHeader
                className="cursor-pointer select-none"
                onClick={() => setBulkOpen(o => !o)}
              >
                <CardTitle className="flex items-center justify-between text-blue-700 text-base">
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Bulk Set Tourist Fee Defaults
                    <span className="text-xs font-normal text-blue-500 ml-1">
                      — apply fee values to all countries at once (does not enable any country)
                    </span>
                  </span>
                  {bulkOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </CardTitle>
              </CardHeader>
              {bulkOpen && (
                <CardContent className="pt-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 30 Day */}
                    <div className="space-y-2 border rounded p-3 bg-white">
                      <p className="text-sm font-semibold text-gray-700">30 Day Tourist</p>
                      <Input
                        type="number" step="0.01" placeholder="Govt Fee (Apr–Jun)"
                        value={bulkFees.tourist_30d_govt_fee_apr_jun}
                        onChange={e => setBulkFees(f => ({ ...f, tourist_30d_govt_fee_apr_jun: e.target.value }))}
                      />
                      <Input
                        type="number" step="0.01" placeholder="Govt Fee (Jul–Mar)"
                        value={bulkFees.tourist_30d_govt_fee_jul_mar}
                        onChange={e => setBulkFees(f => ({ ...f, tourist_30d_govt_fee_jul_mar: e.target.value }))}
                      />
                      <Input
                        type="number" step="0.01" placeholder="Our Fee"
                        value={bulkFees.tourist_30d_our_fee}
                        onChange={e => setBulkFees(f => ({ ...f, tourist_30d_our_fee: e.target.value }))}
                      />
                      {(bulkFees.tourist_30d_govt_fee_apr_jun || bulkFees.tourist_30d_govt_fee_jul_mar) && (
                        <div className="text-xs text-gray-500 space-y-0.5">
                          {bulkFees.tourist_30d_govt_fee_apr_jun > 0 && (
                            <div>Apr–Jun total: ${((parseFloat(bulkFees.tourist_30d_govt_fee_apr_jun)||0)+(parseFloat(bulkFees.tourist_30d_our_fee)||0)+(parseFloat(bulkFees.tourist_30d_govt_fee_apr_jun)||0)*0.025).toFixed(2)}</div>
                          )}
                          {bulkFees.tourist_30d_govt_fee_jul_mar > 0 && (
                            <div>Jul–Mar total: ${((parseFloat(bulkFees.tourist_30d_govt_fee_jul_mar)||0)+(parseFloat(bulkFees.tourist_30d_our_fee)||0)+(parseFloat(bulkFees.tourist_30d_govt_fee_jul_mar)||0)*0.025).toFixed(2)}</div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* 1 Year */}
                    <div className="space-y-2 border rounded p-3 bg-white">
                      <p className="text-sm font-semibold text-gray-700">1 Year Tourist</p>
                      <Input
                        type="number" step="0.01" placeholder="Govt Fee"
                        value={bulkFees.tourist_1yr_govt_fee}
                        onChange={e => setBulkFees(f => ({ ...f, tourist_1yr_govt_fee: e.target.value }))}
                      />
                      <Input
                        type="number" step="0.01" placeholder="Our Fee"
                        value={bulkFees.tourist_1yr_our_fee}
                        onChange={e => setBulkFees(f => ({ ...f, tourist_1yr_our_fee: e.target.value }))}
                      />
                      {bulkFees.tourist_1yr_govt_fee > 0 && (
                        <div className="text-xs text-gray-500">
                          Total: ${((parseFloat(bulkFees.tourist_1yr_govt_fee)||0)+(parseFloat(bulkFees.tourist_1yr_our_fee)||0)+(parseFloat(bulkFees.tourist_1yr_govt_fee)||0)*0.025).toFixed(2)}
                        </div>
                      )}
                    </div>
                    {/* 5 Year */}
                    <div className="space-y-2 border rounded p-3 bg-white">
                      <p className="text-sm font-semibold text-gray-700">5 Year Tourist</p>
                      <Input
                        type="number" step="0.01" placeholder="Govt Fee"
                        value={bulkFees.tourist_5yr_govt_fee}
                        onChange={e => setBulkFees(f => ({ ...f, tourist_5yr_govt_fee: e.target.value }))}
                      />
                      <Input
                        type="number" step="0.01" placeholder="Our Fee"
                        value={bulkFees.tourist_5yr_our_fee}
                        onChange={e => setBulkFees(f => ({ ...f, tourist_5yr_our_fee: e.target.value }))}
                      />
                      {bulkFees.tourist_5yr_govt_fee > 0 && (
                        <div className="text-xs text-gray-500">
                          Total: ${((parseFloat(bulkFees.tourist_5yr_govt_fee)||0)+(parseFloat(bulkFees.tourist_5yr_our_fee)||0)+(parseFloat(bulkFees.tourist_5yr_govt_fee)||0)*0.025).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleBulkSave}
                      disabled={bulkSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {bulkSaving ? 'Applying...' : 'Apply to All Countries'}
                    </Button>
                    <p className="text-xs text-gray-500">
                      Only filled fields are updated. Country and tourist toggles are never changed.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Country Visa Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search countries..."
                      className="pl-10"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Showing {filteredCountries.length} of {countries.length} countries. 
                  {countries.filter(c => c.country_enabled).length} enabled.
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <div key={country.country_code} className="border rounded-lg">
                      {/* Country Header */}
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedCountry(
                          expandedCountry === country.country_code ? null : country.country_code
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <FlagIcon code={country.country_code} width={32} height={24} />
                          <div>
                            <p className="font-medium">{country.country_name}</p>
                            <p className="text-sm text-gray-500">{country.country_code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Switch
                              checked={country.country_enabled}
                              onCheckedChange={(checked) => 
                                updateCountryConfig(country.country_code, 'country_enabled', checked)
                              }
                            />
                            <Label className={country.country_enabled ? 'text-green-600' : 'text-gray-400'}>
                              {country.country_enabled ? 'Enabled' : 'Disabled'}
                            </Label>
                          </div>
                          {expandedCountry === country.country_code ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Configuration */}
                      {expandedCountry === country.country_code && (
                        <div className="p-4 border-t bg-gray-50 space-y-6">
                          
                          {/* Tourist Visa */}
                          <div className="border rounded p-4 bg-white">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-blue-600">Tourist Visa</h4>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={country.tourist_enabled}
                                  onCheckedChange={(checked) => 
                                    updateCountryConfig(country.country_code, 'tourist_enabled', checked)
                                  }
                                />
                                <Label>Enable Tourist</Label>
                              </div>
                            </div>
                            {country.tourist_enabled && (
                              <div className="grid grid-cols-3 gap-4">
                                {/* 30 Days */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={country.tourist_30d_enabled}
                                      onCheckedChange={(checked) => 
                                        updateCountryConfig(country.country_code, 'tourist_30d_enabled', checked)
                                      }
                                    />
                                    <Label className="text-sm font-semibold">30 Days</Label>
                                  </div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee (Apr–Jun)"
                                    value={country.tourist_30d_govt_fee_apr_jun || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_30d_govt_fee_apr_jun', e.target.value)}
                                    disabled={!country.tourist_30d_enabled}
                                  />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee (Jul–Mar)"
                                    value={country.tourist_30d_govt_fee_jul_mar || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_30d_govt_fee_jul_mar', e.target.value)}
                                    disabled={!country.tourist_30d_enabled}
                                  />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Our Fee"
                                    value={country.tourist_30d_our_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_30d_our_fee', e.target.value)}
                                    disabled={!country.tourist_30d_enabled}
                                  />
                                  {country.tourist_30d_enabled && (country.tourist_30d_govt_fee_apr_jun || country.tourist_30d_govt_fee_jul_mar) && (
                                    <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                                      {country.tourist_30d_govt_fee_apr_jun > 0 && (
                                        <div>Apr–Jun total: ${((parseFloat(country.tourist_30d_govt_fee_apr_jun) || 0) + (parseFloat(country.tourist_30d_our_fee) || 0) + (parseFloat(country.tourist_30d_govt_fee_apr_jun) || 0) * 0.025).toFixed(2)}</div>
                                      )}
                                      {country.tourist_30d_govt_fee_jul_mar > 0 && (
                                        <div>Jul–Mar total: ${((parseFloat(country.tourist_30d_govt_fee_jul_mar) || 0) + (parseFloat(country.tourist_30d_our_fee) || 0) + (parseFloat(country.tourist_30d_govt_fee_jul_mar) || 0) * 0.025).toFixed(2)}</div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {/* 1 Year */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={country.tourist_1yr_enabled}
                                      onCheckedChange={(checked) => 
                                        updateCountryConfig(country.country_code, 'tourist_1yr_enabled', checked)
                                      }
                                    />
                                    <Label className="text-sm font-semibold">1 Year</Label>
                                  </div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    value={country.tourist_1yr_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_1yr_govt_fee', e.target.value)}
                                    disabled={!country.tourist_1yr_enabled}
                                  />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Our Fee"
                                    value={country.tourist_1yr_our_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_1yr_our_fee', e.target.value)}
                                    disabled={!country.tourist_1yr_enabled}
                                  />
                                  {country.tourist_1yr_enabled && country.tourist_1yr_govt_fee && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      <div>Processing: ${((country.tourist_1yr_govt_fee || 0) * 0.025).toFixed(2)}</div>
                                      <div className="font-semibold">Total: ${((parseFloat(country.tourist_1yr_govt_fee) || 0) + (parseFloat(country.tourist_1yr_our_fee) || 0) + ((country.tourist_1yr_govt_fee || 0) * 0.025)).toFixed(2)}</div>
                                    </div>
                                  )}
                                </div>
                                {/* 5 Years */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={country.tourist_5yr_enabled}
                                      onCheckedChange={(checked) => 
                                        updateCountryConfig(country.country_code, 'tourist_5yr_enabled', checked)
                                      }
                                    />
                                    <Label className="text-sm font-semibold">5 Years</Label>
                                  </div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    value={country.tourist_5yr_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_5yr_govt_fee', e.target.value)}
                                    disabled={!country.tourist_5yr_enabled}
                                  />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Our Fee"
                                    value={country.tourist_5yr_our_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_5yr_our_fee', e.target.value)}
                                    disabled={!country.tourist_5yr_enabled}
                                  />
                                  {country.tourist_5yr_enabled && country.tourist_5yr_govt_fee && (
                                    <div className="text-xs text-gray-600 mt-1">
                                      <div>Processing: ${((country.tourist_5yr_govt_fee || 0) * 0.025).toFixed(2)}</div>
                                      <div className="font-semibold">Total: ${((parseFloat(country.tourist_5yr_govt_fee) || 0) + (parseFloat(country.tourist_5yr_our_fee) || 0) + ((country.tourist_5yr_govt_fee || 0) * 0.025)).toFixed(2)}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Business Visa */}
                          <div className="border rounded p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-green-600">Business Visa</h4>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={country.business_enabled}
                                    onCheckedChange={(checked) => 
                                      updateCountryConfig(country.country_code, 'business_enabled', checked)
                                    }
                                  />
                                  <Label>Enable</Label>
                                </div>
                                {country.business_enabled && (
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Govt Fee"
                                      className="w-32"
                                      value={country.business_govt_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'business_govt_fee', e.target.value)}
                                    />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Our Fee"
                                      className="w-32"
                                      value={country.business_our_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'business_our_fee', e.target.value)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {country.business_enabled && country.business_govt_fee && (
                              <div className="text-xs text-gray-600 mt-2 text-right">
                                Processing: ${((country.business_govt_fee || 0) * 0.025).toFixed(2)} | 
                                <span className="font-semibold ml-1">Total: ${((parseFloat(country.business_govt_fee) || 0) + (parseFloat(country.business_our_fee) || 0) + ((country.business_govt_fee || 0) * 0.025)).toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          {/* Conference Visa - NEW */}
                          <div className="border rounded p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-indigo-600">Conference Visa <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2">NEW</span></h4>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={country.conference_enabled}
                                    onCheckedChange={(checked) => 
                                      updateCountryConfig(country.country_code, 'conference_enabled', checked)
                                    }
                                  />
                                  <Label>Enable</Label>
                                </div>
                                {country.conference_enabled && (
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Govt Fee"
                                      className="w-32"
                                      value={country.conference_govt_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'conference_govt_fee', e.target.value)}
                                    />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Our Fee"
                                      className="w-32"
                                      value={country.conference_our_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'conference_our_fee', e.target.value)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {country.conference_enabled && country.conference_govt_fee && (
                              <div className="text-xs text-gray-600 mt-2 text-right">
                                Processing: ${((country.conference_govt_fee || 0) * 0.025).toFixed(2)} | 
                                <span className="font-semibold ml-1">Total: ${((parseFloat(country.conference_govt_fee) || 0) + (parseFloat(country.conference_our_fee) || 0) + ((country.conference_govt_fee || 0) * 0.025)).toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          {/* Medical Visa */}
                          <div className="border rounded p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-purple-600">Medical Visa</h4>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={country.medical_enabled}
                                    onCheckedChange={(checked) => 
                                      updateCountryConfig(country.country_code, 'medical_enabled', checked)
                                    }
                                  />
                                  <Label>Enable</Label>
                                </div>
                                {country.medical_enabled && (
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Govt Fee"
                                      className="w-32"
                                      value={country.medical_govt_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'medical_govt_fee', e.target.value)}
                                    />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Our Fee"
                                      className="w-32"
                                      value={country.medical_our_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'medical_our_fee', e.target.value)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {country.medical_enabled && country.medical_govt_fee && (
                              <div className="text-xs text-gray-600 mt-2 text-right">
                                Processing: ${((country.medical_govt_fee || 0) * 0.025).toFixed(2)} | 
                                <span className="font-semibold ml-1">Total: ${((parseFloat(country.medical_govt_fee) || 0) + (parseFloat(country.medical_our_fee) || 0) + ((country.medical_govt_fee || 0) * 0.025)).toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          {/* Medical Attendant Visa - NEW */}
                          <div className="border rounded p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-pink-600">Medical Attendant Visa <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded ml-2">NEW</span></h4>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={country.medical_attendant_enabled}
                                    onCheckedChange={(checked) => 
                                      updateCountryConfig(country.country_code, 'medical_attendant_enabled', checked)
                                    }
                                  />
                                  <Label>Enable</Label>
                                </div>
                                {country.medical_attendant_enabled && (
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Govt Fee"
                                      className="w-32"
                                      value={country.medical_attendant_govt_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'medical_attendant_govt_fee', e.target.value)}
                                    />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Our Fee"
                                      className="w-32"
                                      value={country.medical_attendant_our_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'medical_attendant_our_fee', e.target.value)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {country.medical_attendant_enabled && country.medical_attendant_govt_fee && (
                              <div className="text-xs text-gray-600 mt-2 text-right">
                                Processing: ${((country.medical_attendant_govt_fee || 0) * 0.025).toFixed(2)} | 
                                <span className="font-semibold ml-1">Total: ${((parseFloat(country.medical_attendant_govt_fee) || 0) + (parseFloat(country.medical_attendant_our_fee) || 0) + ((country.medical_attendant_govt_fee || 0) * 0.025)).toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          {/* Transit Visa */}
                          <div className="border rounded p-4 bg-white">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-orange-600">Transit Visa</h4>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={country.transit_enabled}
                                    onCheckedChange={(checked) => 
                                      updateCountryConfig(country.country_code, 'transit_enabled', checked)
                                    }
                                  />
                                  <Label>Enable</Label>
                                </div>
                                {country.transit_enabled && (
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Govt Fee"
                                      className="w-32"
                                      value={country.transit_govt_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'transit_govt_fee', e.target.value)}
                                    />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Our Fee"
                                      className="w-32"
                                      value={country.transit_our_fee || ''}
                                      onChange={(e) => updateCountryConfig(country.country_code, 'transit_our_fee', e.target.value)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            {country.transit_enabled && country.transit_govt_fee && (
                              <div className="text-xs text-gray-600 mt-2 text-right">
                                Processing: ${((country.transit_govt_fee || 0) * 0.025).toFixed(2)} | 
                                <span className="font-semibold ml-1">Total: ${((parseFloat(country.transit_govt_fee) || 0) + (parseFloat(country.transit_our_fee) || 0) + ((country.transit_govt_fee || 0) * 0.025)).toFixed(2)}</span>
                              </div>
                            )}
                          </div>

                          {/* Save Button */}
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => saveCountryConfig(country)}
                            disabled={savingCountry === country.country_code}
                          >
                            {savingCountry === country.country_code ? (
                              <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Configuration
                              </span>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          }

          {/* Payment Gateway Settings Tab — Super Admin only */}
          {currentUser?.role === 'super_admin' && (
            <TabsContent value="payment-gateways" className="space-y-6">
              <PaymentGatewaySettings />
            </TabsContent>
          )}

          {/* Email Providers Tab — Super Admin only */}
          {currentUser?.role === 'super_admin' && (
            <TabsContent value="email-providers" className="space-y-6">
              <EmailProviderSettings />
            </TabsContent>
          )}

          {/* User Management Tab */}
          {currentUser?.role === 'super_admin' && (
            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
          )}

          {/* Utility Tab */}
          {currentUser?.role === 'super_admin' && (
            <TabsContent value="utility" className="space-y-6">
              <UtilitySettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
