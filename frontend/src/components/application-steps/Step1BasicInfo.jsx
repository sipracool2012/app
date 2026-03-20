import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SearchableSelect } from '../ui/searchable-select';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step1BasicInfo = ({ data, onNext, isFirstStep }) => {
  const { toast } = useToast();
  const [ports, setPorts] = useState([]);
  const [visaSubtypes, setVisaSubtypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    passportType: data?.passportType || 'Ordinary',
    portOfArrival: data?.portOfArrival || '',
    expectedArrivalDate: data?.expectedArrivalDate || '',
    visaService: data?.visaService || '',
    visaServiceSubtype: data?.visaServiceSubtype || '',
    passportNumber: data?.passportNumber || '',
    dateOfIssue: data?.dateOfIssue || '',
    dateOfExpiry: data?.dateOfExpiry || '',
    otherPassportHeld: data?.otherPassportHeld || 'No',
    yogaInstituteName: data?.yogaInstituteName || '',
    yogaInstituteAddress: data?.yogaInstituteAddress || '',
    yogaInstitutePhone: data?.yogaInstitutePhone || ''
  });

  useEffect(() => {
    fetchConstants();
    // Parse visaId if available (format: countrycode-visatype-duration)
    if (data?.visaId) {
      parseVisaId(data.visaId);
    }
  }, [data?.visaId]);

  const parseVisaId = (visaId) => {
    // Example: "us-business" or "us-tourist-30d"
    const parts = visaId.toLowerCase().split('-');
    if (parts.length >= 2) {
      const visaType = parts[1]; // business, tourist, medical, etc.
      let visaServiceName = '';
      
      if (visaType === 'tourist') {
        const duration = parts[2] || '30d';
        if (duration === '30d') visaServiceName = '30 day Indian Tourist eVisa';
        else if (duration === '1yr') visaServiceName = '1 year Indian Tourist eVisa';
        else if (duration === '5yr') visaServiceName = '5 year Indian Tourist eVisa';
      } else if (visaType === 'business') {
        visaServiceName = '1 year Indian Business eVisa';
      } else if (visaType === 'medical') {
        visaServiceName = 'Indian Medical eVisa';
      } else if (visaType === 'transit') {
        visaServiceName = 'Indian Transit eVisa';
      } else if (visaType === 'conference') {
        visaServiceName = 'Indian Conference eVisa';
      } else if (visaType.includes('attendant')) {
        visaServiceName = 'Indian Medical Attendant eVisa';
      }
      
      if (visaServiceName) {
        setFormData(prev => ({ ...prev, visaService: visaServiceName }));
        // Fetch subtypes for this visa type
        fetchVisaSubtypes(visaType);
      }
    }
  };

  const fetchConstants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/constants/all`);
      const data = await response.json();
      setPorts(data.ports || []);
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

  const fetchVisaSubtypes = async (visaType) => {
    try {
      // Clean visa type: extract base type from full name or use directly
      let type = visaType;
      if (visaType.toLowerCase().includes('tourist')) type = 'tourist';
      else if (visaType.toLowerCase().includes('business')) type = 'business';
      else if (visaType.toLowerCase().includes('conference')) type = 'conference';
      else if (visaType.toLowerCase().includes('medical attendant')) type = 'medical_attendant';
      else if (visaType.toLowerCase().includes('medical')) type = 'medical';
      else if (visaType.toLowerCase().includes('transit')) type = 'transit';
      
      const response = await fetch(`${BACKEND_URL}/api/constants/visa-subtypes/${type}`);
      const data = await response.json();
      setVisaSubtypes(data.subtypes || []);
      
      // If subtypes exist and no subtype selected, select first one
      if (data.subtypes && data.subtypes.length > 0 && !formData.visaServiceSubtype) {
        setFormData(prev => ({ ...prev, visaServiceSubtype: data.subtypes[0] }));
      }
    } catch (error) {
      console.error('Failed to fetch visa subtypes:', error);
    }
  };

  const getMinArrivalDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toISOString().split('T')[0];
  };

  const showYogaFields = () => {
    const visaType = formData.visaService.toLowerCase();
    const subtype = formData.visaServiceSubtype;
    
    return visaType.includes('tourist') && 
           subtype !== 'Tourism, Recreation, Sight-seeing';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Ordinary passport type
    if (formData.passportType !== 'Ordinary') {
      toast({
        title: 'Invalid Passport Type',
        description: 'Only Ordinary passport type is allowed for this service. Please select Ordinary passport.',
        variant: 'destructive'
      });
      return;
    }

    // Validate arrival date
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 4);
    const selectedDate = new Date(formData.expectedArrivalDate);
    alert(selectedDate);
    alert(minDate);
    if (selectedDate < minDate) {
      toast({
        title: 'Invalid Arrival Date',
        description: 'Expected arrival date must be at least 5 days from today.',
        variant: 'destructive'
      });
      return;
    }

    onNext(formData);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passport Type */}
        <div className="space-y-2">
          <Label htmlFor="passportType">
            Passport Type <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.passportType} 
            onValueChange={(value) => setFormData({ ...formData, passportType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ordinary">Ordinary</SelectItem>
              <SelectItem value="Diplomatic">Diplomatic</SelectItem>
              <SelectItem value="Official">Official</SelectItem>
            </SelectContent>
          </Select>
          {formData.passportType !== 'Ordinary' && (
            <p className="text-sm text-red-600">
              ⚠️ Only Ordinary passport type is allowed for this service
            </p>
          )}
        </div>

        {/* Port of Arrival */}
        <SearchableSelect
          label="Port of Arrival"
          value={formData.portOfArrival}
          onValueChange={(value) => setFormData({ ...formData, portOfArrival: value })}
          options={ports}
          placeholder="Select port of arrival"
          searchPlaceholder="Search ports..."
          required
        />

        {/* Expected Date of Arrival */}
        <div className="space-y-2">
          <Label htmlFor="expectedArrivalDate">
            Expected Date of Arrival <span className="text-red-500">*</span>
          </Label>
          <Input
            id="expectedArrivalDate"
            type="date"
            value={formData.expectedArrivalDate}
            onChange={(e) => setFormData({ ...formData, expectedArrivalDate: e.target.value })}
            min={getMinArrivalDate()}
            required
          />
          <p className="text-xs text-gray-500">Must be at least 5 days from today</p>
        </div>

        {/* Visa Service */}
        <div className="space-y-2">
          <Label htmlFor="visaService">
            Visa Service <span className="text-red-500">*</span>
          </Label>
          <Input
            id="visaService"
            value={formData.visaService}
            readOnly
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">Auto-populated from your selection</p>
        </div>

        {/* Visa Service Subtype */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="visaServiceSubtype">
            Visa Service Subtype <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.visaServiceSubtype} 
            onValueChange={(value) => setFormData({ ...formData, visaServiceSubtype: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visa service subtype" />
            </SelectTrigger>
            <SelectContent>
              {visaSubtypes.map((subtype) => (
                <SelectItem key={subtype} value={subtype}>
                  {subtype}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Passport Details Section */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Passport Details</h4>
        </div>

        {/* Passport Number */}
        <div className="space-y-2">
          <Label htmlFor="passportNumber">
            Passport Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="passportNumber"
            value={formData.passportNumber}
            onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
            required
          />
        </div>

        {/* Date of Issue */}
        <div className="space-y-2">
          <Label htmlFor="dateOfIssue">
            Date of Issue <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfIssue"
            type="date"
            value={formData.dateOfIssue}
            onChange={(e) => setFormData({ ...formData, dateOfIssue: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Date of Expiry */}
        <div className="space-y-2">
          <Label htmlFor="dateOfExpiry">
            Date of Expiry <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfExpiry"
            type="date"
            value={formData.dateOfExpiry}
            onChange={(e) => setFormData({ ...formData, dateOfExpiry: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        {/* Other Passport Held */}
        <div className="space-y-2">
          <Label htmlFor="otherPassportHeld">
            Any other valid Passport/Identity Certificate(IC) held? <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.otherPassportHeld} 
            onValueChange={(value) => setFormData({ ...formData, otherPassportHeld: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Yoga Institute Fields */}
        {showYogaFields() && (
          <>
            <div className="md:col-span-2 border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yogaInstituteName">
                Name of Yoga Institute/Friend or Relative <span className="text-red-500">*</span>
              </Label>
              <Input
                id="yogaInstituteName"
                value={formData.yogaInstituteName}
                onChange={(e) => setFormData({ ...formData, yogaInstituteName: e.target.value })}
                required={showYogaFields()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yogaInstituteAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="yogaInstituteAddress"
                value={formData.yogaInstituteAddress}
                onChange={(e) => setFormData({ ...formData, yogaInstituteAddress: e.target.value })}
                required={showYogaFields()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yogaInstitutePhone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="yogaInstitutePhone"
                type="tel"
                value={formData.yogaInstitutePhone}
                onChange={(e) => setFormData({ ...formData, yogaInstitutePhone: e.target.value })}
                required={showYogaFields()}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
