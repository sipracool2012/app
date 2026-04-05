/**
 * EmailProviderSettings Component
 * ================================
 * Super-admin-only panel for managing email delivery providers:
 *   - Mandrill (Mailchimp Transactional) via API key
 *   - SendPulse via SMTP credentials
 *   - Postmark via Server Token
 *
 * Providers have fallback logic: Mandrill → SendPulse → Postmark.
 * Disabled or unconfigured providers are skipped automatically.
 *
 * // CHANGELOG REMINDER: Update CHANGELOG.md when modifying this component.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';
import { Save, Eye, EyeOff, Mail, ShieldCheck } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EmailProviderSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    mandrill: false,
    sendpulse: false,
    postmark: false,
  });

  const [config, setConfig] = useState({
    otp_login_enabled: true,
    otp_signup_enabled: false,
    mandrill_enabled: true,
    mandrill_api_key: '',
    sendpulse_enabled: false,
    sendpulse_smtp_host: 'smtp.sendpulse.com',
    sendpulse_smtp_port: 465,
    sendpulse_smtp_user: '',
    sendpulse_smtp_password: '',
    postmark_enabled: false,
    postmark_server_token: '',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/email-providers/config/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch config');
      const data = await response.json();
      setConfig((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to fetch email provider config:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email provider settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      // Only send fields that the backend accepts; skip masked values (they contain '*')
      const payload = { ...config };
      // Avoid accidentally overwriting credentials with masked display values
      ['mandrill_api_key', 'sendpulse_smtp_password', 'postmark_server_token'].forEach((key) => {
        if (typeof payload[key] === 'string' && payload[key].includes('*')) {
          delete payload[key];
        }
      });

      const response = await fetch(`${BACKEND_URL}/api/email-providers/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update config');

      toast({ title: 'Success', description: 'Email provider settings saved.' });
      // Re-fetch to get freshly masked values
      await fetchConfig();
    } catch (error) {
      console.error('Failed to save email provider config:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email provider settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSecret = (provider) =>
    setShowSecrets((prev) => ({ ...prev, [provider]: !prev[provider] }));

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Email Providers</h2>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Providers are tried in order: <strong>Mandrill → SendPulse → Postmark</strong>. If a
        provider is disabled or delivery fails, the next enabled provider is used.
      </p>

      {/* ── OTP Verification Settings ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <CardTitle>OTP Verification</CardTitle>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Control whether a one-time password is required after credentials are accepted.
            Disabling OTP allows direct login/signup without an email verification step.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Require OTP on Login</p>
              <p className="text-sm text-gray-500">
                When enabled, users must enter a 6-digit code sent to their email after entering their password.
              </p>
            </div>
            <Switch
              id="otp-login-enabled"
              checked={config.otp_login_enabled}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, otp_login_enabled: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Require OTP on Sign Up</p>
              <p className="text-sm text-gray-500">
                When enabled, new accounts are only created after the user verifies their email address with a code.
              </p>
            </div>
            <Switch
              id="otp-signup-enabled"
              checked={config.otp_signup_enabled}
              onCheckedChange={(checked) =>
                setConfig((prev) => ({ ...prev, otp_signup_enabled: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Mandrill ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mandrill (Mailchimp Transactional)</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="mandrill-enabled">Enable</Label>
              <Switch
                id="mandrill-enabled"
                checked={config.mandrill_enabled}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, mandrill_enabled: checked }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mandrill-api-key">API Key</Label>
            <div className="relative">
              <Input
                id="mandrill-api-key"
                type={showSecrets.mandrill ? 'text' : 'password'}
                value={config.mandrill_api_key}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, mandrill_api_key: e.target.value }))
                }
                placeholder="md-xxxxxxxxxxxxxxxxxxxx"
              />
              <button
                type="button"
                onClick={() => toggleSecret('mandrill')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                {showSecrets.mandrill ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Obtain your API key from the Mailchimp Transactional (Mandrill) dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── SendPulse ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SendPulse (SMTP)</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="sendpulse-enabled">Enable</Label>
              <Switch
                id="sendpulse-enabled"
                checked={config.sendpulse_enabled}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, sendpulse_enabled: checked }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sendpulse-smtp-host">SMTP Host</Label>
              <Input
                id="sendpulse-smtp-host"
                value={config.sendpulse_smtp_host}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, sendpulse_smtp_host: e.target.value }))
                }
                placeholder="smtp.sendpulse.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sendpulse-smtp-port">SMTP Port</Label>
              <Input
                id="sendpulse-smtp-port"
                type="number"
                value={config.sendpulse_smtp_port}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    sendpulse_smtp_port: parseInt(e.target.value, 10),
                  }))
                }
                placeholder="465"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sendpulse-smtp-user">SMTP Username</Label>
            <Input
              id="sendpulse-smtp-user"
              value={config.sendpulse_smtp_user}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, sendpulse_smtp_user: e.target.value }))
              }
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sendpulse-smtp-password">SMTP Password</Label>
            <div className="relative">
              <Input
                id="sendpulse-smtp-password"
                type={showSecrets.sendpulse ? 'text' : 'password'}
                value={config.sendpulse_smtp_password}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, sendpulse_smtp_password: e.target.value }))
                }
                placeholder="Enter SMTP password"
              />
              <button
                type="button"
                onClick={() => toggleSecret('sendpulse')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                {showSecrets.sendpulse ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Use port 465 for SSL or 587 for STARTTLS. Credentials are from your SendPulse SMTP settings.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Postmark ── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Postmark</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="postmark-enabled">Enable</Label>
              <Switch
                id="postmark-enabled"
                checked={config.postmark_enabled}
                onCheckedChange={(checked) =>
                  setConfig((prev) => ({ ...prev, postmark_enabled: checked }))
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postmark-server-token">Server Token</Label>
            <div className="relative">
              <Input
                id="postmark-server-token"
                type={showSecrets.postmark ? 'text' : 'password'}
                value={config.postmark_server_token}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, postmark_server_token: e.target.value }))
                }
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
              <button
                type="button"
                onClick={() => toggleSecret('postmark')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                {showSecrets.postmark ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Obtain your Server Token from the Postmark dashboard under Server &rarr; API Tokens.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailProviderSettings;
