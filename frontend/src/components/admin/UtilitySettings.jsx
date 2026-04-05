import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';
import { Save, Wrench, Clock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UtilitySettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(true);
  const [expiryDays, setExpiryDays] = useState(7);
  const [expiryHours, setExpiryHours] = useState(0);
  const [expiryMinutes, setExpiryMinutes] = useState(0);
  const [expirySeconds, setExpirySeconds] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/utility/settings`);
        if (!response.ok) throw new Error('Failed to load');
        const data = await response.json();
        setShowFeeBreakdown(data.show_fee_breakdown ?? true);
        setExpiryDays(data.draft_expiry_days ?? 7);
        setExpiryHours(data.draft_expiry_hours ?? 0);
        setExpiryMinutes(data.draft_expiry_minutes ?? 0);
        setExpirySeconds(data.draft_expiry_seconds ?? 0);
      } catch (err) {
        console.error('Failed to fetch utility settings:', err);
        toast({
          title: 'Error',
          description: 'Failed to load utility settings.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/utility/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          show_fee_breakdown: showFeeBreakdown,
          draft_expiry_days: Number(expiryDays),
          draft_expiry_hours: Number(expiryHours),
          draft_expiry_minutes: Number(expiryMinutes),
          draft_expiry_seconds: Number(expirySeconds),
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast({ title: 'Saved', description: 'Utility settings updated successfully.' });
    } catch (err) {
      console.error('Failed to save utility settings:', err);
      toast({
        title: 'Error',
        description: 'Failed to save utility settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8 text-gray-500">Loading utility settings…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="w-6 h-6 text-gray-700" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Utility Settings</h2>
          <p className="text-sm text-gray-500">Control customer-facing display options.</p>
        </div>
      </div>

      {/* Pricing / Fee Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-fee-breakdown" className="text-sm font-medium">
                Show Fee Breakdown to Customers
              </Label>
              <p className="text-xs text-gray-500 mt-0.5">
                When enabled, customers see the itemised Government Fee, Processing Fee, and Our Fee
                on the payment step. When disabled, only the Total Amount is displayed.
              </p>
            </div>
            <Switch
              id="show-fee-breakdown"
              checked={showFeeBreakdown}
              onCheckedChange={setShowFeeBreakdown}
            />
          </div>
        </CardContent>
      </Card>

      {/* Draft Application Expiry */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <CardTitle className="text-base">Draft Application Expiry</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-gray-500">
            Draft applications will be automatically deleted after this duration. Each time a
            user saves progress or revisits their draft, the timer resets. Applications are
            assigned a <span className="font-mono font-medium">TEMP…</span> ID until submitted.
          </p>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label htmlFor="expiry-days" className="text-sm font-medium">Days</Label>
              <Input
                id="expiry-days"
                type="number"
                min={0}
                value={expiryDays}
                onChange={(e) => setExpiryDays(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="expiry-hours" className="text-sm font-medium">Hours</Label>
              <Input
                id="expiry-hours"
                type="number"
                min={0}
                max={23}
                value={expiryHours}
                onChange={(e) => setExpiryHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="expiry-minutes" className="text-sm font-medium">Minutes</Label>
              <Input
                id="expiry-minutes"
                type="number"
                min={0}
                max={59}
                value={expiryMinutes}
                onChange={(e) => setExpiryMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="expiry-seconds" className="text-sm font-medium">Seconds</Label>
              <Input
                id="expiry-seconds"
                type="number"
                min={0}
                max={59}
                value={expirySeconds}
                onChange={(e) => setExpirySeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Total:{' '}
            {[
              expiryDays > 0 && `${expiryDays}d`,
              expiryHours > 0 && `${expiryHours}h`,
              expiryMinutes > 0 && `${expiryMinutes}m`,
              expirySeconds > 0 && `${expirySeconds}s`,
            ]
              .filter(Boolean)
              .join(' ') || '0s (defaults to 7 days)'}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default UtilitySettings;
