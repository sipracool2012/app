import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Users, Shield, UserCog, UserPlus } from 'lucide-react';
import { getAuthHeaders } from '../../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserManagement = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);

  // Promote-by-email form state
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteRole, setPromoteRole] = useState('admin');
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/users`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: t('common.error'),
        description: t('admin.failedToLoadUsers'),
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    setUpdatingUser(userId);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      toast({
        title: t('common.success'),
        description: t('admin.roleUpdatedDesc')
      });

      fetchUsers();
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast({
        title: t('common.error'),
        description: t('admin.roleUpdateError'),
        variant: 'destructive'
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const promoteUserByEmail = async (e) => {
    e.preventDefault();
    if (!promoteEmail.trim()) return;
    setPromoting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/users/promote`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ email: promoteEmail.trim(), role: promoteRole })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to update role');
      }

      toast({
        title: t('common.success'),
        description: `${promoteEmail} has been set as ${promoteRole === 'super_admin' ? 'Super Admin' : 'Admin'}.`
      });

      setPromoteEmail('');
      setPromoteRole('admin');
      fetchUsers();
    } catch (error) {
      console.error('Failed to promote user:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('admin.roleUpdateError'),
        variant: 'destructive'
      });
    } finally {
      setPromoting(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      super_admin: { color: 'bg-purple-100 text-purple-800', icon: Shield },
      admin: { color: 'bg-blue-100 text-blue-800', icon: UserCog },
      user: { color: 'bg-gray-100 text-gray-800', icon: Users }
    };

    const config = roleConfig[role] || roleConfig.user;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {role === 'super_admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const getRolePermissions = (role) => {
    const permissions = {
      super_admin: ['All Permissions', 'User Management', 'Payment Gateway Config', 'Country Config'],
      admin: ['Country Configuration', 'View Applications', 'Export Data'],
      user: ['Submit Applications', 'View Own Applications']
    };

    return permissions[role] || permissions.user;
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('admin.loadingUsers')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('admin.userManagement')}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage admin and super admin roles</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          {users.length} {users.length === 1 ? 'Admin' : 'Admins'}
        </Badge>
      </div>

      {/* Promote User by Email */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-purple-900 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Assign Admin Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={promoteUserByEmail} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">User Email</label>
              <input
                type="email"
                value={promoteEmail}
                onChange={(e) => setPromoteEmail(e.target.value)}
                placeholder="Enter user email address"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="w-48">
              <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
              <Select value={promoteRole} onValueChange={setPromoteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-4 h-4" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="super_admin">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Super Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={promoting || !promoteEmail.trim()}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              {promoting ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Admin / Super Admin list */}
      <div className="grid gap-4">
        {users.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No admins found.</p>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{user.email}</p>

                    <div className="flex flex-wrap gap-2">
                      {getRolePermissions(user.role).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="ml-6 w-64">
                    <label className="text-sm font-medium block mb-2">{t('admin.changeRole')}</label>
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                      disabled={updatingUser === user.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            User
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <UserCog className="w-4 h-4" />
                            Admin
                          </div>
                        </SelectItem>
                        <SelectItem value="super_admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Super Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingUser === user.id && (
                      <p className="text-xs text-gray-500 mt-1">Updating...</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Role Descriptions:</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li><strong>Super Admin:</strong> Full system access including user management and payment gateway configuration</li>
            <li><strong>Admin:</strong> Can manage country configurations and view all applications</li>
            <li><strong>User:</strong> Can only submit and view their own visa applications</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
