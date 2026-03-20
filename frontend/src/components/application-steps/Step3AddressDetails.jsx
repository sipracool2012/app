import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { SearchableSelect } from '../ui/searchable-select';
import { PhoneInput } from '../ui/phone-input';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step3AddressDetails = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const [countries, setCountries] = useState([]);
  const [phoneCodes, setPhoneCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    houseNoStreet: data?.houseNoStreet || '',
    villageTownCity: data?.villageTownCity || '',
    country: data?.country || '',
    stateProvince: data?.stateProvince || '',
    postalCode: data?.postalCode || '',
    phoneCountryCode: data?.phoneCountryCode || '+1',
    phoneNumber: data?.phoneNumber || ''
  });

  useEffect(() => {
    fetchConstants();
  }, []);

  const fetchConstants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/constants/all`);
      const data = await response.json();
      setCountries(data.countries || []);
      setPhoneCodes(data.phone_codes || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch constants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load form data',
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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Address Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* House No./Street */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="houseNoStreet">
            House No./Street <span className="text-red-500">*</span>
          </Label>
          <Input
            id="houseNoStreet"
            value={formData.houseNoStreet}
            onChange={(e) => setFormData({ ...formData, houseNoStreet: e.target.value })}
            required
          />
        </div>

        {/* Village/Town/City */}
        <div className="space-y-2">
          <Label htmlFor="villageTownCity">
            Village/Town/City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="villageTownCity"
            value={formData.villageTownCity}
            onChange={(e) => setFormData({ ...formData, villageTownCity: e.target.value })}
            required
          />
        </div>

        {/* Country */}
        <SearchableSelect
          label="Country"
          value={formData.country}
          onValueChange={(value) => setFormData({ ...formData, country: value })}
          options={countries}
          placeholder="Select country"
          searchPlaceholder="Search countries..."
          required
        />

        {/* State/Province/District */}
        <div className="space-y-2">
          <Label htmlFor="stateProvince">
            State/Province/District <span className="text-red-500">*</span>
          </Label>
          <Input
            id="stateProvince"
            value={formData.stateProvince}
            onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
            required
          />
        </div>

        {/* Postal/Zip Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            Postal/Zip Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            required
          />
        </div>

        {/* Phone Number with Country Code */}
        <div className="md:col-span-2">
          <PhoneInput
            label="Phone No."
            countryCode={formData.phoneCountryCode}
            phoneNumber={formData.phoneNumber}
            onCountryCodeChange={(value) => setFormData({ ...formData, phoneCountryCode: value })}
            onPhoneNumberChange={(value) => setFormData({ ...formData, phoneNumber: value })}
            phoneCodes={phoneCodes}
            required
          />
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

export default Step3AddressDetails;
