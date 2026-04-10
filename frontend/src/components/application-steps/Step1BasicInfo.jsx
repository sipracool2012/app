import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SearchableSelect } from '../ui/searchable-select';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step1BasicInfo = ({ data, onNext, isFirstStep }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
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
    yogaInstitutePhoneCode: data?.yogaInstitutePhoneCode || '+91',
    yogaInstitutePhone: data?.yogaInstitutePhone || ''
  });
  const [errors, setErrors] = useState({});

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
        title: t('common.error'),
        description: t('errors.formLoadFailed'),
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

  const getMinArrivalDateIST = () => {
    // Compute today's date in IST (UTC+5:30), then add 4 days
    const now = new Date();
    const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
    const istDate = new Date(istMs);
    istDate.setUTCDate(istDate.getUTCDate() + 4);
    return istDate.toISOString().split('T')[0];
  };

  const getMinExpiryDate = () => {
    if (!formData.expectedArrivalDate) return '';
    const arrival = new Date(formData.expectedArrivalDate);
    arrival.setMonth(arrival.getMonth() + 6);
    return arrival.toISOString().split('T')[0];
  };

  const showYogaFields = () => {
    const visaType = formData.visaService.toLowerCase();
    const subtype = formData.visaServiceSubtype;
    
    return visaType.includes('tourist') && 
           subtype !== 'Tourism, Recreation, Sight-seeing';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Passport type check
    if (formData.passportType !== 'Ordinary') {
      toast({
        title: t('errors.invalidPassportType'),
        description: t('errors.invalidPassportTypeDesc'),
        variant: 'destructive'
      });
      return;
    }

    // Required field checks
    if (!formData.portOfArrival) newErrors.portOfArrival = 'Port of arrival is required.';
    if (!formData.visaServiceSubtype) newErrors.visaServiceSubtype = 'Visa subtype is required.';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required.';
    if (!formData.dateOfIssue) newErrors.dateOfIssue = 'Date of issue is required.';

    // Arrival date: required + must be >= today+4 IST
    if (!formData.expectedArrivalDate) {
      newErrors.expectedArrivalDate = 'Expected date of arrival is required.';
    } else {
      const minArrival = new Date(getMinArrivalDateIST());
      const selectedArrival = new Date(formData.expectedArrivalDate);
      if (selectedArrival < minArrival) {
        newErrors.expectedArrivalDate = 'Arrival date must be at least 4 days from today (IST).';
      }
    }

    // Expiry date: required + must be >= arrival + 6 months
    if (!formData.dateOfExpiry) {
      newErrors.dateOfExpiry = 'Date of expiry is required.';
    } else if (formData.expectedArrivalDate) {
      const minExpiry = new Date(formData.expectedArrivalDate);
      minExpiry.setMonth(minExpiry.getMonth() + 6);
      if (new Date(formData.dateOfExpiry) < minExpiry) {
        newErrors.dateOfExpiry = 'Passport must be valid for at least 6 months from the arrival date.';
      }
    }

    // Yoga / Additional Information fields
    if (showYogaFields()) {
      if (!formData.yogaInstituteName.trim()) newErrors.yogaInstituteName = 'This field is required.';
      if (!formData.yogaInstituteAddress.trim()) newErrors.yogaInstituteAddress = 'Address is required.';
      if (!formData.yogaInstitutePhone.trim()) {
        newErrors.yogaInstitutePhone = 'Phone number is required.';
      } else if (!/^\d{5,15}$/.test(formData.yogaInstitutePhone.replace(/[\s\-]/g, ''))) {
        newErrors.yogaInstitutePhone = 'Enter a valid phone number (5–15 digits).';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: 'Please fix the errors below',
        description: 'Some required fields are missing or contain invalid values.',
        variant: 'destructive'
      });
      return;
    }

    onNext(formData);
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step1.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passport Type */}
        <div className="space-y-2">
          <Label htmlFor="passportType">
            {t('forms.step1.passportType')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.passportType} 
            onValueChange={(value) => setFormData({ ...formData, passportType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ordinary">{t('forms.step1.ordinary')}</SelectItem>
              <SelectItem value="Diplomatic">{t('forms.step1.diplomatic')}</SelectItem>
              <SelectItem value="Official">{t('forms.step1.official')}</SelectItem>
            </SelectContent>
          </Select>
          {formData.passportType !== 'Ordinary' && (
            <p className="text-sm text-red-600">
              {t('forms.step1.passportTypeWarning')}
            </p>
          )}
        </div>

        {/* Port of Arrival */}
        <div>
          <SearchableSelect
            label={t('forms.step1.portOfArrival')}
            value={formData.portOfArrival}
            onValueChange={(value) => {
              setFormData({ ...formData, portOfArrival: value });
              setErrors(prev => ({ ...prev, portOfArrival: '' }));
            }}
            options={ports}
            placeholder={t('forms.step1.selectPort')}
            searchPlaceholder={t('forms.step1.searchPorts')}
            required
          />
          {errors.portOfArrival && (
            <p className="text-sm text-red-600 mt-1">{errors.portOfArrival}</p>
          )}
        </div>

        {/* Expected Date of Arrival */}
        <div className="space-y-2">
          <Label htmlFor="expectedArrivalDate">
            {t('forms.step1.expectedArrivalDate')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="expectedArrivalDate"
            type="date"
            value={formData.expectedArrivalDate}
            onChange={(e) => {
              const newDate = e.target.value;
              setFormData(prev => {
                // Clear expiry if it would become invalid (< 6 months from new arrival)
                let newExpiry = prev.dateOfExpiry;
                if (newDate && prev.dateOfExpiry) {
                  const minExpiry = new Date(newDate);
                  minExpiry.setMonth(minExpiry.getMonth() + 6);
                  if (new Date(prev.dateOfExpiry) < minExpiry) newExpiry = '';
                }
                return { ...prev, expectedArrivalDate: newDate, dateOfExpiry: newExpiry };
              });
              setErrors(prev => ({ ...prev, expectedArrivalDate: '', dateOfExpiry: '' }));
            }}
            min={getMinArrivalDateIST()}
            className={errors.expectedArrivalDate ? 'border-red-500' : ''}
            required
          />
          {errors.expectedArrivalDate
            ? <p className="text-sm text-red-600">{errors.expectedArrivalDate}</p>
            : <p className="text-xs text-gray-500">{t('forms.step1.arrivalDateHint')}</p>
          }
        </div>

        {/* Visa Service */}
        <div className="space-y-2">
          <Label htmlFor="visaService">
            {t('forms.step1.visaService')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="visaService"
            value={formData.visaService}
            readOnly
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">{t('forms.step1.visaServiceHint')}</p>
        </div>

        {/* Visa Service Subtype */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="visaServiceSubtype">
            {t('forms.step1.visaServiceSubtype')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.visaServiceSubtype} 
            onValueChange={(value) => {
              setFormData({ ...formData, visaServiceSubtype: value });
              setErrors(prev => ({ ...prev, visaServiceSubtype: '' }));
            }}
          >
            <SelectTrigger className={errors.visaServiceSubtype ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('forms.step1.selectVisaSubtype')} />
            </SelectTrigger>
            <SelectContent>
              {visaSubtypes.map((subtype) => (
                <SelectItem key={subtype} value={subtype}>
                  {subtype}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.visaServiceSubtype && <p className="text-sm text-red-600">{errors.visaServiceSubtype}</p>}
        </div>

        {/* Passport Details Section */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.step1.passportDetails')}</h4>
        </div>

        {/* Passport Number */}
        <div className="space-y-2">
          <Label htmlFor="passportNumber">
            {t('forms.step1.passportNumber')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="passportNumber"
            value={formData.passportNumber}
            onChange={(e) => {
              setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() });
              setErrors(prev => ({ ...prev, passportNumber: '' }));
            }}
            className={errors.passportNumber ? 'border-red-500' : ''}
          />
          {errors.passportNumber && <p className="text-sm text-red-600">{errors.passportNumber}</p>}
        </div>

        {/* Date of Issue */}
        <div className="space-y-2">
          <Label htmlFor="dateOfIssue">
            {t('forms.step1.dateOfIssue')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfIssue"
            type="date"
            value={formData.dateOfIssue}
            onChange={(e) => {
              setFormData({ ...formData, dateOfIssue: e.target.value });
              setErrors(prev => ({ ...prev, dateOfIssue: '' }));
            }}
            max={new Date().toISOString().split('T')[0]}
            className={errors.dateOfIssue ? 'border-red-500' : ''}
          />
          {errors.dateOfIssue && <p className="text-sm text-red-600">{errors.dateOfIssue}</p>}
        </div>

        {/* Date of Expiry */}
        <div className="space-y-2">
          <Label htmlFor="dateOfExpiry">
            {t('forms.step1.dateOfExpiry')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfExpiry"
            type="date"
            value={formData.dateOfExpiry}
            onChange={(e) => {
              const newExpiry = e.target.value;
              setFormData(prev => ({ ...prev, dateOfExpiry: newExpiry }));
              if (newExpiry && formData.expectedArrivalDate) {
                const minExpiry = new Date(formData.expectedArrivalDate);
                minExpiry.setMonth(minExpiry.getMonth() + 6);
                if (new Date(newExpiry) < minExpiry) {
                  setErrors(prev => ({ ...prev, dateOfExpiry: 'Passport must be valid for at least 6 months from the arrival date.' }));
                } else {
                  setErrors(prev => ({ ...prev, dateOfExpiry: '' }));
                }
              } else {
                setErrors(prev => ({ ...prev, dateOfExpiry: '' }));
              }
            }}
            min={getMinExpiryDate() || new Date().toISOString().split('T')[0]}
            className={errors.dateOfExpiry ? 'border-red-500' : ''}
            required
          />
          {errors.dateOfExpiry && (
            <p className="text-sm text-red-600">{errors.dateOfExpiry}</p>
          )}
          {!errors.dateOfExpiry && formData.expectedArrivalDate && (
            <p className="text-xs text-gray-500">
              Must be valid at least 6 months after arrival date.
            </p>
          )}
        </div>

        {/* Other Passport Held */}
        <div className="space-y-2">
          <Label htmlFor="otherPassportHeld">
            {t('forms.step1.otherPassportHeld')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.otherPassportHeld} 
            onValueChange={(value) => setFormData({ ...formData, otherPassportHeld: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">{t('forms.no')}</SelectItem>
              <SelectItem value="Yes">{t('forms.yes')}</SelectItem>
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
                onChange={(e) => {
                  setFormData({ ...formData, yogaInstituteName: e.target.value });
                  setErrors(prev => ({ ...prev, yogaInstituteName: '' }));
                }}
                className={errors.yogaInstituteName ? 'border-red-500' : ''}
              />
              {errors.yogaInstituteName && <p className="text-sm text-red-600">{errors.yogaInstituteName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yogaInstituteAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="yogaInstituteAddress"
                value={formData.yogaInstituteAddress}
                onChange={(e) => {
                  setFormData({ ...formData, yogaInstituteAddress: e.target.value });
                  setErrors(prev => ({ ...prev, yogaInstituteAddress: '' }));
                }}
                className={errors.yogaInstituteAddress ? 'border-red-500' : ''}
              />
              {errors.yogaInstituteAddress && <p className="text-sm text-red-600">{errors.yogaInstituteAddress}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yogaInstitutePhone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="yogaInstitutePhoneCode"
                  value={formData.yogaInstitutePhoneCode}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\+?\d{0,4}$/.test(val)) {
                      setFormData(prev => ({ ...prev, yogaInstitutePhoneCode: val }));
                    }
                  }}
                  placeholder="+91"
                  className="w-24 shrink-0"
                  aria-label="Country code"
                />
                <Input
                  id="yogaInstitutePhone"
                  type="tel"
                  value={formData.yogaInstitutePhone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, yogaInstitutePhone: e.target.value }));
                    setErrors(prev => ({ ...prev, yogaInstitutePhone: '' }));
                  }}
                  placeholder="1234567890"
                  required={showYogaFields()}
                  className={errors.yogaInstitutePhone ? 'border-red-500' : ''}
                />
              </div>
              {errors.yogaInstitutePhone && (
                <p className="text-sm text-red-600">{errors.yogaInstitutePhone}</p>
              )}
              <p className="text-xs text-gray-500">Enter country code (e.g. +91) and phone number.</p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {t('application.continue')}
        </Button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
