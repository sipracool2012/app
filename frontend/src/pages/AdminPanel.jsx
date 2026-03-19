import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, Eye, Settings, Globe, Save, ChevronDown, ChevronUp } from 'lucide-react';
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('applications');
  
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

  useEffect(() => {
    // Load applications from API
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/applications`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setApplications(data.applications || []);
        setFilteredApps(data.applications || []);
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
  }, [toast]);

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
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
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
          tourist_30d_govt_fee: parseFloat(country.tourist_30d_govt_fee) || 0,
          tourist_1yr_enabled: country.tourist_1yr_enabled,
          tourist_1yr_govt_fee: parseFloat(country.tourist_1yr_govt_fee) || 0,
          tourist_5yr_enabled: country.tourist_5yr_enabled,
          tourist_5yr_govt_fee: parseFloat(country.tourist_5yr_govt_fee) || 0,
          business_enabled: country.business_enabled,
          business_govt_fee: parseFloat(country.business_govt_fee) || 0,
          medical_enabled: country.medical_enabled,
          medical_govt_fee: parseFloat(country.medical_govt_fee) || 0,
          transit_enabled: country.transit_enabled,
          transit_govt_fee: parseFloat(country.transit_govt_fee) || 0,
          payment_fee: parseFloat(country.payment_fee) || 0,
          processing_fee: parseFloat(country.processing_fee) || 0,
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

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={colors[status] || ''}>
        {status?.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage visa applications and country configurations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="countries" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Country Config
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-600">
                    {applications.filter(a => a.status === 'pending').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {applications.filter(a => a.status === 'approved').length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-600">
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
                      <SelectItem value="pending">Pending</SelectItem>
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
                            <TableCell className="font-medium">{app.applicationId}</TableCell>
                            <TableCell>{app.surname} {app.givenNames}</TableCell>
                            <TableCell>{app.email}</TableCell>
                            <TableCell>{app.nationality}</TableCell>
                            <TableCell>{app.visaService}</TableCell>
                            <TableCell>{getStatusBadge(app.status)}</TableCell>
                            <TableCell>
                              {new Date(app.submittedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Select
                                  value={app.status}
                                  onValueChange={(value) => updateStatus(app.applicationId, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadCSV(app)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
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

          {/* Country Configuration Tab */}
          <TabsContent value="countries" className="space-y-6">
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
                          <span className="text-2xl">{country.flag_emoji}</span>
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
                          {/* Common Fees */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Payment Fee (USD)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={country.payment_fee || ''}
                                onChange={(e) => updateCountryConfig(country.country_code, 'payment_fee', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Processing Fee (USD)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={country.processing_fee || ''}
                                onChange={(e) => updateCountryConfig(country.country_code, 'processing_fee', e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>

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
                                    <Label className="text-sm">30 Days</Label>
                                  </div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    value={country.tourist_30d_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_30d_govt_fee', e.target.value)}
                                    disabled={!country.tourist_30d_enabled}
                                  />
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
                                    <Label className="text-sm">1 Year</Label>
                                  </div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    value={country.tourist_1yr_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_1yr_govt_fee', e.target.value)}
                                    disabled={!country.tourist_1yr_enabled}
                                  />
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
                                    <Label className="text-sm">5 Years</Label>
                                  </div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    value={country.tourist_5yr_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'tourist_5yr_govt_fee', e.target.value)}
                                    disabled={!country.tourist_5yr_enabled}
                                  />
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
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    className="w-32"
                                    value={country.business_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'business_govt_fee', e.target.value)}
                                  />
                                )}
                              </div>
                            </div>
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
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    className="w-32"
                                    value={country.medical_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'medical_govt_fee', e.target.value)}
                                  />
                                )}
                              </div>
                            </div>
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
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Govt Fee"
                                    className="w-32"
                                    value={country.transit_govt_fee || ''}
                                    onChange={(e) => updateCountryConfig(country.country_code, 'transit_govt_fee', e.target.value)}
                                  />
                                )}
                              </div>
                            </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
