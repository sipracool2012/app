import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Settings, Globe, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import CountryConfiguration from '../components/admin/CountryConfiguration';
import PaymentGatewaySettings from '../components/admin/PaymentGatewaySettings';
import ApplicationsManagement from '../components/admin/ApplicationsManagement';
import UserManagement from '../components/admin/UserManagement';
import { getToken, getAuthHeaders } from '../utils/auth';
import { useAuth } from '../context/AuthProvider';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleLogout: contextLogout } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate('/signin');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUser(data);

      // Check if user is admin or super_admin
      if (data.role !== 'admin' && data.role !== 'super_admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin panel',
          variant: 'destructive'
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      navigate('/signin');
    }
  };

  const handleLogout = () => {
    contextLogout();
    navigate('/signin');
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">
                Logged in as {user.fullName} ({user.role})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Globe className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="countries">Country Configuration</TabsTrigger>
            {user.role === 'super_admin' && (
              <TabsTrigger value="payment-gateways">Payment Gateways</TabsTrigger>
            )}
            {user.role === 'super_admin' && (
              <TabsTrigger value="users">User Management</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="applications">
            <ApplicationsManagement />
          </TabsContent>

          <TabsContent value="countries">
            <CountryConfiguration />
          </TabsContent>

          {user.role === 'super_admin' && (
            <TabsContent value="payment-gateways">
              <PaymentGatewaySettings />
            </TabsContent>
          )}

          {user.role === 'super_admin' && (
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
