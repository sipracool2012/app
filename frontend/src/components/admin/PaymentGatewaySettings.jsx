import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Save, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PaymentGatewaySettings = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    razorpay: false,
    paypal: false,
    tazapay: false
  });

  const [config, setConfig] = useState({
    // Razorpay
    razorpay_enabled: false,
    razorpay_key_id: '',
    razorpay_key_secret: '',
    razorpay_webhook_secret: '',
    razorpay_mode: 'sandbox',
    
    // PayPal
    paypal_enabled: false,
    paypal_client_id: '',
    paypal_secret: '',
    paypal_mode: 'sandbox',
    
    // Tazapay
    tazapay_enabled: false,
    tazapay_api_key: '',
    tazapay_secret_key: '',
    tazapay_webhook_secret: '',
    tazapay_mode: 'sandbox'
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/payment-gateways/config/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch config');
      }

      const data = await response.json();
      setConfig(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch payment gateway config:', error);
      toast({
        title: t('common.error'),
        description: t('admin.failedToLoadPaymentGateway'),
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/payment-gateways/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Failed to update config');
      }

      toast({
        title: t('common.success'),
        description: t('admin.paymentGatewayUpdated')
      });
    } catch (error) {
      console.error('Failed to update payment gateway config:', error);
      toast({
        title: t('common.error'),
        description: t('admin.failedToUpdatePaymentGateway'),
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSecretVisibility = (gateway) => {
    setShowSecrets({
      ...showSecrets,
      [gateway]: !showSecrets[gateway]
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('admin.paymentGatewaySettings')}</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? t('admin.saving') : t('admin.saveChanges')}
        </Button>
      </div>

      {/* Razorpay Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Razorpay Configuration</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="razorpay-enabled">Enable</Label>
              <Switch
                id="razorpay-enabled"
                checked={config.razorpay_enabled}
                onCheckedChange={(checked) => setConfig({ ...config, razorpay_enabled: checked })}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="razorpay-mode">Mode</Label>
            <Select
              value={config.razorpay_mode}
              onValueChange={(value) => setConfig({ ...config, razorpay_mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Test Mode)</SelectItem>
                <SelectItem value="live">Live (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpay-key-id">API Key ID</Label>
            <Input
              id="razorpay-key-id"
              value={config.razorpay_key_id}
              onChange={(e) => setConfig({ ...config, razorpay_key_id: e.target.value })}
              placeholder="rzp_test_xxxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpay-key-secret">API Key Secret</Label>
            <div className="relative">
              <Input
                id="razorpay-key-secret"
                type={showSecrets.razorpay ? 'text' : 'password'}
                value={config.razorpay_key_secret}
                onChange={(e) => setConfig({ ...config, razorpay_key_secret: e.target.value })}
                placeholder="Enter secret key"
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('razorpay')}
                className="absolute right-2 top-2"
              >
                {showSecrets.razorpay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="razorpay-webhook-secret">Webhook Secret</Label>
            <Input
              id="razorpay-webhook-secret"
              type={showSecrets.razorpay ? 'text' : 'password'}
              value={config.razorpay_webhook_secret}
              onChange={(e) => setConfig({ ...config, razorpay_webhook_secret: e.target.value })}
              placeholder="Enter webhook secret"
            />
          </div>
        </CardContent>
      </Card>

      {/* PayPal Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>PayPal Configuration</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="paypal-enabled">Enable</Label>
              <Switch
                id="paypal-enabled"
                checked={config.paypal_enabled}
                onCheckedChange={(checked) => setConfig({ ...config, paypal_enabled: checked })}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paypal-mode">Mode</Label>
            <Select
              value={config.paypal_mode}
              onValueChange={(value) => setConfig({ ...config, paypal_mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Test Mode)</SelectItem>
                <SelectItem value="live">Live (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-client-id">Client ID</Label>
            <Input
              id="paypal-client-id"
              value={config.paypal_client_id}
              onChange={(e) => setConfig({ ...config, paypal_client_id: e.target.value })}
              placeholder="Enter PayPal client ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal-secret">Client Secret</Label>
            <div className="relative">
              <Input
                id="paypal-secret"
                type={showSecrets.paypal ? 'text' : 'password'}
                value={config.paypal_secret}
                onChange={(e) => setConfig({ ...config, paypal_secret: e.target.value })}
                placeholder="Enter secret"
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('paypal')}
                className="absolute right-2 top-2"
              >
                {showSecrets.paypal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tazapay Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tazapay Configuration</CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="tazapay-enabled">Enable</Label>
              <Switch
                id="tazapay-enabled"
                checked={config.tazapay_enabled}
                onCheckedChange={(checked) => setConfig({ ...config, tazapay_enabled: checked })}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tazapay-mode">Mode</Label>
            <Select
              value={config.tazapay_mode}
              onValueChange={(value) => setConfig({ ...config, tazapay_mode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">Sandbox (Test Mode)</SelectItem>
                <SelectItem value="live">Live (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tazapay-api-key">API Key</Label>
            <Input
              id="tazapay-api-key"
              value={config.tazapay_api_key}
              onChange={(e) => setConfig({ ...config, tazapay_api_key: e.target.value })}
              placeholder="Enter Tazapay API key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tazapay-secret-key">Secret Key</Label>
            <div className="relative">
              <Input
                id="tazapay-secret-key"
                type={showSecrets.tazapay ? 'text' : 'password'}
                value={config.tazapay_secret_key}
                onChange={(e) => setConfig({ ...config, tazapay_secret_key: e.target.value })}
                placeholder="Enter secret key"
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('tazapay')}
                className="absolute right-2 top-2"
              >
                {showSecrets.tazapay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tazapay-webhook-secret">Webhook Secret</Label>
            <Input
              id="tazapay-webhook-secret"
              type={showSecrets.tazapay ? 'text' : 'password'}
              value={config.tazapay_webhook_secret}
              onChange={(e) => setConfig({ ...config, tazapay_webhook_secret: e.target.value })}
              placeholder="Enter webhook secret"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {saving ? t('admin.saving') : t('admin.saveChanges')}
        </Button>
      </div>
    </div>
  );
};

export default PaymentGatewaySettings;
