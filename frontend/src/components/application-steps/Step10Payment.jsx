import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ChevronLeft, CreditCard, AlertCircle } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { getAuthHeaders } from '../../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step10Payment = ({ data, onNext, onBack, isLastStep }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [enabledGateways, setEnabledGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visaOption, setVisaOption] = useState(null);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchEnabledGateways(), fetchVisaOption()]);
  };

  const fetchVisaOption = async () => {
    const visaId = data?.visaId;
    if (!visaId) return;
    // visaId format: "{countryCode}-{type}-{duration}" e.g. "gb-tourist-30d"
    const countryCode = visaId.split('-')[0].toUpperCase();
    try {
      const response = await fetch(`${BACKEND_URL}/api/countries/${countryCode}/visa-options`);
      if (!response.ok) return;
      const result = await response.json();
      const matched = (result.options || []).find(o => o.id === visaId);
      if (matched) setVisaOption(matched);
    } catch (err) {
      console.error('Failed to fetch visa option fees:', err);
    }
  };

  // Fees from DB; fall back to 0 so the user can see something is wrong rather than wrong hardcoded values
  const govtFee = visaOption?.govt_fee ?? 0;
  const ourFee = visaOption?.our_fee ?? 0;
  const govtProcessingFee = visaOption?.processing_fee ?? (govtFee * 0.025);
  const totalAmount = govtFee + ourFee + govtProcessingFee;

  const fetchEnabledGateways = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/payment-gateways/enabled-gateways`);
      const result = await response.json();
      
      setEnabledGateways(result.gateways || []);
      
      // Auto-select first gateway if only one is available
      if (result.gateways && result.gateways.length === 1) {
        setPaymentMethod(result.gateways[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch enabled payment gateways:', error);
      toast({
        title: t('common.error'),
        description: t('errors.formLoadFailed'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast({
        title: t('forms.step10.paymentRequired'),
        description: t('forms.step10.selectPaymentMethod'),
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);

    // Generate the application CSV before redirecting to payment
    try {
      await fetch(`${BACKEND_URL}/api/applications/generate-csv`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error('Failed to generate application CSV:', err);
    }

    if (paymentMethod === 'paypal') {
      try {
        const origin = window.location.origin;
        const applicationId = data?.applicationId || '';
        const returnUrl = `${origin}/payment-return?application_id=${encodeURIComponent(applicationId)}&amount=${totalAmount.toFixed(2)}`;
        const cancelUrl = `${origin}/payment-return?application_id=${encodeURIComponent(applicationId)}&amount=${totalAmount.toFixed(2)}&cancelled=1`;

        const response = await fetch(`${BACKEND_URL}/api/payment-gateways/paypal/create-order`, {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            application_id: applicationId,
            amount: totalAmount,
            return_url: returnUrl,
            cancel_url: cancelUrl
          })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || 'Failed to create PayPal order');
        }

        const { approval_url } = await response.json();
        window.location.href = approval_url;
        // page navigates away — no need to setProcessing(false)
      } catch (err) {
        toast({
          title: 'Payment Error',
          description: err.message || 'Could not initiate PayPal. Please try again.',
          variant: 'destructive'
        });
        setProcessing(false);
      }
      return;
    }

    // Fallback for other gateways (not yet integrated — prevent silent skip-to-success)
    toast({
      title: 'Not supported',
      description: 'This payment method is not yet integrated. Please choose PayPal.',
      variant: 'destructive'
    });
    setProcessing(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('forms.step10.loadingOptions')}</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step10.title')}</h3>
      
      {/* Fee Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4">{t('forms.step10.feeBreakdown')}</h4>
          {visaOption && (
            <p className="text-sm text-gray-500 mb-3">{visaOption.name}</p>
          )}
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">{t('forms.step10.governmentFee')}</span>
              <span className="font-semibold">${govtFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">{t('forms.step10.processingFee')}</span>
              <span className="font-semibold">${govtProcessingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">{t('forms.step10.ourFee')}</span>
              <span className="font-semibold">${ourFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg border-t-2">
              <span className="font-bold">{t('forms.step10.totalAmount')}</span>
              <span className="font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      {enabledGateways.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">{t('forms.step10.paymentMethod')}</h4>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">
                {t('forms.step10.payGateway')} <span className="text-red-500">*</span>
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder={t('forms.step10.choosePaymentMethod')} />
                </SelectTrigger>
                <SelectContent>
                  {enabledGateways.map((gateway) => (
                    <SelectItem key={gateway.id} value={gateway.id}>
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <div>
                          <div>{gateway.name}</div>
                          <div className="text-xs text-gray-500">{gateway.description}</div>
                          {gateway.mode === 'sandbox' && (
                            <div className="text-xs text-orange-600">(Test Mode)</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> {t('forms.step10.paymentNote')}
                Your payment information is processed securely and is never stored on our servers.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 text-amber-700 bg-amber-50 p-4 rounded-lg">
              <AlertCircle className="w-6 h-6" />
              <div>
                <h4 className="font-semibold">{t('forms.step10.noPaymentMethods')}</h4>
                <p className="text-sm">{t('forms.step10.noPaymentMethodsDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('application.back')}
        </Button>
        <Button 
          onClick={handlePayment} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={processing || enabledGateways.length === 0 || !paymentMethod}
        >
          {processing ? t('forms.step10.processing') : t('forms.step10.payNow', { amount: totalAmount.toFixed(2) })}
        </Button>
      </div>
    </div>
  );
};

export default Step10Payment;
