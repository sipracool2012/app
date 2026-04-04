import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useToast } from '../../hooks/use-toast';
import { Save, Wrench } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UtilitySettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/utility/settings`);
        if (!response.ok) throw new Error('Failed to load');
        const data = await response.json();
        setShowFeeBreakdown(data.show_fee_breakdown ?? true);
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
        body: JSON.stringify({ show_fee_breakdown: showFeeBreakdown }),
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
