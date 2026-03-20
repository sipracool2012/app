import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ChevronLeft, CreditCard } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const Step10Payment = ({ data, onNext, onBack, isLastStep }) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);

  // Calculate fees (these should come from the visa option selected on Home page)
  const govtFee = data?.selectedVisaOption?.govt_fee || 80;
  const ourFee = data?.selectedVisaOption?.payment_fee || 20;
  const govtProcessingFee = data?.selectedVisaOption?.processing_fee || (govtFee * 0.025);
  const totalAmount = govtFee + ourFee + govtProcessingFee;

  const handlePayment = async () => {
    setProcessing(true);

    // Here we'll integrate with the selected payment gateway
    // For now, we'll just pass the data forward
    const paymentData = {
      ...data,
      paymentMethod,
      paymentStatus: 'pending',
      amount: totalAmount
    };

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onNext(paymentData);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment</h3>
      
      {/* Fee Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4">Fee Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Government Fee</span>
              <span className="font-semibold">${govtFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Government Processing Fee (2.5%)</span>
              <span className="font-semibold">${govtProcessingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Our Fee</span>
              <span className="font-semibold">${ourFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 text-lg border-t-2">
              <span className="font-bold">Total Amount</span>
              <span className="font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold mb-4">Select Payment Method</h4>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">
              Payment Gateway <span className="text-red-500">*</span>
            </Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="razorpay">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Razorpay (Credit/Debit Card, UPI, Net Banking)
                  </div>
                </SelectItem>
                <SelectItem value="tazapay">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Tazapay (International Payments)
                  </div>
                </SelectItem>
                <SelectItem value="paypal">
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    PayPal
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You will be redirected to a secure payment page to complete your transaction.
              Your payment information is processed securely and is never stored on our servers.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={processing}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handlePayment} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={processing}
        >
          {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

export default Step10Payment;
