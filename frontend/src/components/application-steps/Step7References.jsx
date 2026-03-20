import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PhoneInput } from '../ui/phone-input';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step7References = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const [phoneCodes, setPhoneCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    indiaReferenceName: data?.indiaReferenceName || '',
    indiaReferenceAddress: data?.indiaReferenceAddress || '',
    indiaReferencePhoneCountryCode: data?.indiaReferencePhoneCountryCode || '+91',
    indiaReferencePhoneNumber: data?.indiaReferencePhoneNumber || '',
    homeReferenceName: data?.homeReferenceName || '',
    homeReferenceAddress: data?.homeReferenceAddress || '',
    homeReferencePhoneCountryCode: data?.homeReferencePhoneCountryCode || '+1',
    homeReferencePhoneNumber: data?.homeReferencePhoneNumber || ''
  });

  useEffect(() => {
    fetchPhoneCodes();
  }, []);

  const fetchPhoneCodes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/constants/phone-codes`);
      const data = await response.json();
      setPhoneCodes(data.phone_codes || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch phone codes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load phone codes',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">References</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Reference in India */}
        <div className="border-b pb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Reference in India</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indiaReferenceName">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indiaReferenceName"
                value={formData.indiaReferenceName}
                onChange={(e) => setFormData({ ...formData, indiaReferenceName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indiaReferenceAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indiaReferenceAddress"
                value={formData.indiaReferenceAddress}
                onChange={(e) => setFormData({ ...formData, indiaReferenceAddress: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <PhoneInput
                label="Phone No."
                countryCode={formData.indiaReferencePhoneCountryCode}
                phoneNumber={formData.indiaReferencePhoneNumber}
                onCountryCodeChange={(value) => setFormData({ ...formData, indiaReferencePhoneCountryCode: value })}
                onPhoneNumberChange={(value) => setFormData({ ...formData, indiaReferencePhoneNumber: value })}
                phoneCodes={phoneCodes}
                required
              />
            </div>
          </div>
        </div>

        {/* Reference in Home Country */}
        <div className="border-b pb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Reference in Your Home Country</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="homeReferenceName">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="homeReferenceName"
                value={formData.homeReferenceName}
                onChange={(e) => setFormData({ ...formData, homeReferenceName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="homeReferenceAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="homeReferenceAddress"
                value={formData.homeReferenceAddress}
                onChange={(e) => setFormData({ ...formData, homeReferenceAddress: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <PhoneInput
                label="Phone No."
                countryCode={formData.homeReferencePhoneCountryCode}
                phoneNumber={formData.homeReferencePhoneNumber}
                onCountryCodeChange={(value) => setFormData({ ...formData, homeReferencePhoneCountryCode: value })}
                onPhoneNumberChange={(value) => setFormData({ ...formData, homeReferencePhoneNumber: value })}
                phoneCodes={phoneCodes}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default Step7References;
