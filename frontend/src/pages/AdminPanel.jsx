import React, { useState, useEffect } from 'react';
import { Download, Filter, Search, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';

const AdminPanel = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Load applications from localStorage
    const storedApps = JSON.parse(localStorage.getItem('applications') || '[]');
    setApplications(storedApps);
    setFilteredApps(storedApps);
  }, []);

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

  const updateStatus = (appId, newStatus) => {
    const updated = applications.map(app =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    localStorage.setItem('applications', JSON.stringify(updated));
    
    toast({
      title: 'Status Updated',
      description: `Application ${appId} marked as ${newStatus}`,
    });
  };

  const downloadCSV = (application) => {
    const csvContent = generateCSV([application]);
    downloadFile(csvContent, `${application.id}_application.csv`, 'text/csv');
  };

  const downloadAllCSV = () => {
    const csvContent = generateCSV(filteredApps);
    downloadFile(csvContent, `all_applications_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    
    toast({
      title: 'Download Started',
      description: `Downloading ${filteredApps.length} applications`,
    });
  };

  const generateCSV = (apps) => {
    if (apps.length === 0) return '';

    const headers = [
      'Application ID', 'Status', 'Submitted Date', 'Passport Type', 'Nationality',
      'Port of Arrival', 'Date of Birth', 'Email', 'Expected Arrival Date',
      'Visa Service', 'Visa Service Subtype', 'Surname', 'Given Names',
      'Gender', 'Town of Birth', 'Country of Birth', 'Religion',
      'Educational Qualification', 'Qualification From', 'Passport Number',
      'Place of Issue', 'Date of Issue', 'Date of Expiry', 'House No/Street',
      'Village/Town/City', 'Country', 'State/Province', 'Postal Code',
      'Phone No', 'Mobile No', 'Father Name', 'Father Nationality',
      'Mother Name', 'Mother Nationality', 'Marital Status', 'Spouse Name',
      'Present Occupation', 'Employer Name', 'Designation', 'Employer Address',
      'Type of Visa', 'Places to Visit', 'Duration of Visa', 'Number of Entries',
      'Port of Arrival India', 'Visited India Before', 'Countries Visited',
      'India Reference Name', 'India Reference Address', 'India Reference Phone',
      'Home Reference Name', 'Home Reference Address', 'Home Reference Phone'
    ];

    const rows = apps.map(app => [
      app.id || '',
      app.status || '',
      app.submittedDate || '',
      app.passportType || '',
      app.nationality || '',
      app.portOfArrival || '',
      app.dateOfBirth || '',
      app.email || '',
      app.expectedArrivalDate || '',
      app.visaService || '',
      app.visaServiceSubtype || '',
      app.surname || '',
      app.givenNames || '',
      app.gender || '',
      app.townOfBirth || '',
      app.countryOfBirth || '',
      app.religion || '',
      app.educationalQualification || '',
      app.qualificationFrom || '',
      app.passportNumber || '',
      app.placeOfIssue || '',
      app.dateOfIssue || '',
      app.dateOfExpiry || '',
      app.houseNoStreet || '',
      app.villageTownCity || '',
      app.country || '',
      app.stateProvince || '',
      app.postalCode || '',
      app.phoneNo || '',
      app.mobileNo || '',
      app.fatherName || '',
      app.fatherNationality || '',
      app.motherName || '',
      app.motherNationality || '',
      app.maritalStatus || '',
      app.spouseName || '',
      app.presentOccupation || '',
      app.employerName || '',
      app.designation || '',
      app.employerAddress || '',
      app.typeOfVisa || '',
      app.placesToVisit || '',
      app.durationOfVisa || '',
      app.numberOfEntries || '',
      app.portOfArrivalIndia || '',
      app.visitedIndiaBefore || '',
      app.countriesVisited || '',
      app.indiaReferenceName || '',
      app.indiaReferenceAddress || '',
      app.indiaReferencePhone || '',
      app.homeReferenceName || '',
      app.homeReferenceAddress || '',
      app.homeReferencePhone || ''
    ]);

    const csvRows = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ];

    return csvRows.join('\n');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'default',
      approved: 'default',
      rejected: 'destructive'
    };
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
          <p className="text-gray-600 mt-2">Manage visa applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <Card className="mb-6">
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
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
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
                              onValueChange={(value) => updateStatus(app.id, value)}
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
      </div>
    </div>
  );
};

export default AdminPanel;
