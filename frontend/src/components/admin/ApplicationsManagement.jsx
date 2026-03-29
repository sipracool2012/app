import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Eye, Download, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { getAuthHeaders } from '../../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ApplicationsManagement = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/applications`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800'
    };

    return (
      <Badge className={statusConfig[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredApplications = applications.filter(app =>
    app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.givenNames?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visa Applications</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all visa applications</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search by Application ID, Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.applicationId}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {app.givenNames} {app.surname}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Application ID:</span>
                        <p className="font-medium">{app.applicationId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Visa Type:</span>
                        <p className="font-medium">{app.visaService || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Submitted:</span>
                        <p className="font-medium">
                          {new Date(app.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Payment:</span>
                        <p className="font-medium">{app.paymentStatus || 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsManagement;
