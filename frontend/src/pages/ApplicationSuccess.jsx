import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const ApplicationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationId = location.state?.applicationId || 'APP000000';

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
            Your visa application has been received and is being processed.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Your Application ID</p>
            <p className="text-2xl font-bold text-blue-600">{applicationId}</p>
            <p className="text-sm text-gray-600 mt-4">
              Please save this ID for future reference. You will receive an email confirmation shortly.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">What happens next?</h3>
                <p className="text-gray-600">Our team will review your application within 5 business days.</p>
              </div>
            </div>
            <div className="flex items-start text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Email confirmation</h3>
                <p className="text-gray-600">You'll receive an email with your application details and next steps.</p>
              </div>
            </div>
            <div className="flex items-start text-left">
              <CheckCircle className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Visa approval</h3>
                <p className="text-gray-600">Once approved, your eVisa will be sent to your email address.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationSuccess;
