import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ChevronLeft, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { getAuthHeaders } from '../../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Logo URLs for known gateways (falls back to CreditCard icon if image fails)
const GATEWAY_LOGO = {
  paypal: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  razorpay: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg',
};

const GatewayLogo = ({ id, name }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const src = GATEWAY_LOGO[id];
  if (!src || imgFailed) {
    return (
      <div className="flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-gray-500" />
        <span className="font-semibold text-gray-800">{name}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="h-7 object-contain"
      onError={() => setImgFailed(true)}
    />
  );
};

const Step10Payment = ({ data, onNext, onBack, isLastStep }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [enabledGateways, setEnabledGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(true);
  const [declareTruth, setDeclareTruth] = useState(false);
  const [declareTerms, setDeclareTerms] = useState(false);

  useEffect(() => {
    fetchEnabledGateways();
    fetchUtilitySettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUtilitySettings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/utility/settings`);
      if (!response.ok) return;
      const data = await response.json();
      setShowFeeBreakdown(data.show_fee_breakdown ?? true);
    } catch {
      // silently fall back to showing the breakdown
    }
  };

  // Fees come from selectedVisaOption stored in formData/draft (locked at application start)
  const visaOption = data?.selectedVisaOption || null;
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

    if (paymentMethod === 'razorpay') {
      try {
        const applicationId = data?.applicationId || '';
        const response = await fetch(`${BACKEND_URL}/api/payment-gateways/razorpay/create-order`, {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ application_id: applicationId, amount: totalAmount })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || 'Failed to create Razorpay order');
        }

        const { order_id, amount: rzpAmount, currency, key_id } = await response.json();

        // Dynamically load Razorpay checkout script
        await new Promise((resolve, reject) => {
          if (window.Razorpay) { resolve(); return; }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });

        await new Promise((resolve, reject) => {
          const options = {
            key: key_id,
            amount: rzpAmount,
            currency,
            name: 'Clear eVisa',
            description: `Visa application ${applicationId}`,
            order_id,
            prefill: { email: data?.email || '' },
            theme: { color: '#2563eb' },
            handler: async (rzpResponse) => {
              try {
                const verifyRes = await fetch(`${BACKEND_URL}/api/payment-gateways/razorpay/verify-payment`, {
                  method: 'POST',
                  headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
                  body: JSON.stringify({
                    application_id: applicationId,
                    order_id: rzpResponse.razorpay_order_id,
                    payment_id: rzpResponse.razorpay_payment_id,
                    signature: rzpResponse.razorpay_signature,
                  })
                });
                if (!verifyRes.ok) {
                  const err = await verifyRes.json();
                  throw new Error(err.detail || 'Payment verification failed');
                }
                const origin = window.location.origin;
                window.location.href = `${origin}/payment-return?application_id=${encodeURIComponent(applicationId)}&amount=${totalAmount.toFixed(2)}&gateway=razorpay&transaction_id=${rzpResponse.razorpay_payment_id}`;
                resolve();
              } catch (err) {
                reject(err);
              }
            },
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled')),
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        });

      } catch (err) {
        if (err.message !== 'Payment cancelled') {
          toast({
            title: 'Payment Error',
            description: err.message || 'Razorpay payment failed. Please try again.',
            variant: 'destructive'
          });
        }
        setProcessing(false);
      }
      return;
    }

    if (paymentMethod === 'tazapay') {
      try {
        const applicationId = data?.applicationId || '';
        const origin = window.location.origin;
        const successUrl = `${origin}/payment-return?application_id=${encodeURIComponent(applicationId)}&amount=${totalAmount.toFixed(2)}&gateway=tazapay`;
        const failureUrl = `${origin}/payment-return?application_id=${encodeURIComponent(applicationId)}&amount=${totalAmount.toFixed(2)}&gateway=tazapay&cancelled=1`;

        const response = await fetch(`${BACKEND_URL}/api/payment-gateways/tazapay/create-checkout`, {
          method: 'POST',
          headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            application_id: applicationId,
            amount: totalAmount,
            email: data?.email || '',
            success_url: successUrl,
            failure_url: failureUrl,
          })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || 'Failed to create Tazapay checkout');
        }

        const { redirect_url } = await response.json();
        window.location.href = redirect_url;
      } catch (err) {
        toast({
          title: 'Payment Error',
          description: err.message || 'Could not initiate Tazapay. Please try again.',
          variant: 'destructive'
        });
        setProcessing(false);
      }
      return;
    }

    toast({
      title: 'Not supported',
      description: 'This payment method is not yet integrated.',
      variant: 'destructive'
    });
    setProcessing(false);
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('forms.step10.loadingOptions')}</div>;
  }

  const canPay = !!paymentMethod && declareTruth && declareTerms && enabledGateways.length > 0;

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
          {showFeeBreakdown && (
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
            </div>
          )}
          <div className="flex justify-between py-3 text-lg border-t-2">
            <span className="font-bold">{t('forms.step10.totalAmount')}</span>
            <span className="font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method — radio cards */}
      {enabledGateways.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold mb-4">{t('forms.step10.paymentMethod')}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {enabledGateways.map((gateway) => {
                const selected = paymentMethod === gateway.id;
                return (
                  <button
                    key={gateway.id}
                    type="button"
                    onClick={() => setPaymentMethod(gateway.id)}
                    className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all focus:outline-none ${
                      selected
                        ? 'border-blue-600 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    {/* Radio indicator */}
                    <span
                      className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selected ? 'border-blue-600' : 'border-gray-300'
                      }`}
                    >
                      {selected && <span className="w-2 h-2 rounded-full bg-blue-600 block" />}
                    </span>

                    {/* Logo */}
                    <div className="h-8 flex items-center">
                      <GatewayLogo id={gateway.id} name={gateway.name} />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-snug">{gateway.description}</p>

                    {/* Mode badge */}
                    {gateway.mode === 'sandbox' && (
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
                        Test Mode
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your payment information is processed securely and is never stored on our servers.
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

      {/* Declaration of Applicant */}
      <Card>
        <div className="bg-blue-600 rounded-t-lg px-5 py-3">
          <h4 className="text-white font-semibold text-sm">Declaration of Applicant</h4>
        </div>
        <CardContent className="p-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={declareTruth}
              onChange={(e) => setDeclareTruth(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0"
            />
            <span className="text-sm text-gray-700">
              I declare that the information I have given in this application is{' '}
              <span className="text-orange-600 font-medium">truthful</span>, complete and correct.
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={declareTerms}
              onChange={(e) => setDeclareTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0"
            />
            <span className="text-sm text-gray-700">
              I have read and understood the{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">terms and conditions</a>,{' '}
              <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">refund policy</a>{' '}
              and{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">privacy policy</a>.
            </span>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('application.back')}
        </Button>
        <Button
          onClick={handlePayment}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={processing || !canPay}
        >
          {processing ? t('forms.step10.processing') : t('forms.step10.payNow', { amount: totalAmount.toFixed(2) })}
        </Button>
      </div>
    </div>
  );
};

export default Step10Payment;
