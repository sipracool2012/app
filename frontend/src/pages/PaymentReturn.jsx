import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, RefreshCw, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { getAuthHeaders } from '../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const applicationId = searchParams.get('application_id') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');
  const gateway = searchParams.get('gateway') || 'paypal'; // paypal | razorpay | tazapay
  const orderId = searchParams.get('token'); // PayPal appends ?token=ORDER_ID
  const sessionId = searchParams.get('session_id'); // Tazapay
  const razorpayTxId = searchParams.get('transaction_id'); // Razorpay (already verified)
  const cancelled = searchParams.get('cancelled') === '1';

  const [state, setState] = useState('loading'); // 'loading' | 'success' | 'failed'
  const [transactionId, setTransactionId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [retrying, setRetrying] = useState(false);

  // Fire Google Ads conversion when payment is confirmed
  useEffect(() => {
    if (state === 'success' && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-18096686955/L3gLCJ36wJ0cEOuOlrVD',
        value: amount,
        currency: 'INR',
        transaction_id: transactionId,
      });
    }
  }, [state, transactionId, amount]);

  // Immediately strip sensitive payment params from the address bar so the
  // URL cannot be bookmarked, shared, or replayed by simply reloading the page.
  useEffect(() => {
    const clean = new URLSearchParams();
    if (applicationId) clean.set('application_id', applicationId);
    window.history.replaceState({}, '', `/payment-return?${clean.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cancelled) {
      setState('failed');
      setErrorMsg('Payment was cancelled. You can retry whenever you are ready.');
      return;
    }

    if (gateway === 'razorpay') {
      // Already verified inline — transaction_id passed in URL
      if (razorpayTxId) {
        setTransactionId(razorpayTxId);
        setState('success');
      } else {
        setState('failed');
        setErrorMsg('Payment verification data missing. Please contact support.');
      }
      return;
    }

    if (gateway === 'tazapay') {
      if (!sessionId) {
        setState('failed');
        setErrorMsg('No Tazapay session found. Please retry from below.');
        return;
      }
      verifyTazapay();
      return;
    }

    // Default: PayPal
    if (!orderId) {
      setState('failed');
      setErrorMsg('No payment order found. Please retry from below.');
      return;
    }
    captureOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureOrder = async () => {
    setState('loading');
    try {
      const response = await fetch(`${BACKEND_URL}/api/payment-gateways/paypal/capture-order`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ order_id: orderId, application_id: applicationId })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Payment capture failed');
      }

      const result = await response.json();
      setTransactionId(result.transaction_id || '');
      setState('success');
    } catch (err) {
      setErrorMsg(err.message || 'Payment could not be confirmed. Please retry or contact support.');
      setState('failed');
    }
  };

  const verifyTazapay = async () => {
    setState('loading');
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/payment-gateways/tazapay/verify/${sessionId}?application_id=${encodeURIComponent(applicationId)}`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Tazapay payment verification failed');
      }

      const result = await response.json();
      setTransactionId(result.transaction_id || sessionId);
      setState('success');
    } catch (err) {
      setErrorMsg(err.message || 'Payment could not be confirmed. Please retry or contact support.');
      setState('failed');
    }
  };

  const handleRetry = async () => {
    if (!applicationId || !amount) {
      navigate('/my-applications');
      return;
    }
    setRetrying(true);
    try {
      const origin = window.location.origin;
      const returnUrl = `${origin}/payment-return?application_id=${encodeURIComponent(applicationId)}&amount=${amount.toFixed(2)}`;
      const cancelUrl = `${origin}/payment-return?application_id=${encodeURIComponent(applicationId)}&amount=${amount.toFixed(2)}&cancelled=1`;

      const response = await fetch(`${BACKEND_URL}/api/payment-gateways/paypal/create-order`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          application_id: applicationId,
          amount,
          return_url: returnUrl,
          cancel_url: cancelUrl
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Could not create PayPal order');
      }

      const { approval_url } = await response.json();
      window.location.href = approval_url;
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initiate payment. Please try again later.');
      setRetrying(false);
    }
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">Confirming your payment…</h2>
            <p className="text-gray-500 text-sm">Please do not close this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your payment has been confirmed and your visa application is now under review.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-1">Your Application ID</p>
              <p className="text-2xl font-bold text-blue-600">{applicationId}</p>
              {transactionId && (
                <p className="text-xs text-gray-500 mt-3">
                  Transaction ID: <span className="font-mono">{transactionId}</span>
                </p>
              )}
              <p className="text-sm text-gray-600 mt-3">
                Please save this ID for future reference. You will receive an email confirmation shortly.
              </p>
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">What happens next?</h3>
                  <p className="text-gray-600">Our team will review your application within 1 business day.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email confirmation</h3>
                  <p className="text-gray-600">You'll receive an email with your application details and next steps.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Visa approval</h3>
                  <p className="text-gray-600">Once approved, your eVisa will be sent to your email address.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/my-applications')}>
                View My Applications
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // state === 'failed'
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-red-100 rounded-full p-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Unsuccessful</h1>
            <p className="text-gray-600 text-sm">{errorMsg}</p>
          </div>

          {applicationId && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500">Application ID</p>
              <p className="font-bold text-gray-800 tracking-wide">{applicationId}</p>
              {amount > 0 && (
                <p className="text-xs text-gray-500 mt-1">Amount: ${amount.toFixed(2)}</p>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500">
            Your application data has been saved. You can safely retry the payment.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Redirecting to PayPal…</>
              ) : (
                <><RefreshCw className="w-4 h-4 mr-2" />Retry Payment</>
              )}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/my-applications')}>
              Go to My Applications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReturn;
