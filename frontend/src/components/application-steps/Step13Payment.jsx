import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { ChevronLeft, CreditCard, Check } from 'lucide-react';

const Step13Payment = ({ data, onNext, onBack }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const visaPrice = 72.62; // Mock price

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock payment - just proceed
    onNext({ ...data, paymentData, paymentStatus: 'completed' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment</h3>
      
      {/* Order Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">30 day Indian Tourist eVisa</span>
              <span className="font-medium">USD ${visaPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-medium">USD $0.00</span>
            </div>
            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>USD ${visaPrice}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form - MOCK */}
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This is a mock payment form. No actual payment will be processed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              className="pl-10"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input
            id="cardName"
            placeholder="John Doe"
            value={paymentData.cardName}
            onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="flex items-start space-x-2 text-sm text-gray-600">
        <Check className="w-5 h-5 text-green-600 mt-0.5" />
        <p>Your payment information is secure and encrypted</p>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Complete Payment
        </Button>
      </div>
    </form>
  );
};

export default Step13Payment;
