import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PhoneInput } from '../ui/phone-input';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step7References = ({ data, onNext, onBack, onDataChange }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
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
  // Report local changes to parent so jumping away via stepper saves latest data
  useEffect(() => { onDataChange?.(formData); }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps
  const [errors, setErrors] = useState({});

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
        title: t('common.error'),
        description: t('errors.formLoadFailed'),
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.indiaReferenceName.trim()) newErrors.indiaReferenceName = t('errors.fieldRequired');
    if (!formData.indiaReferenceAddress.trim()) newErrors.indiaReferenceAddress = t('errors.fieldRequired');
    if (!formData.indiaReferencePhoneNumber.trim()) newErrors.indiaReferencePhoneNumber = t('errors.phoneRequired');
    if (!formData.homeReferenceName.trim()) newErrors.homeReferenceName = t('errors.fieldRequired');
    if (!formData.homeReferenceAddress.trim()) newErrors.homeReferenceAddress = t('errors.fieldRequired');
    if (!formData.homeReferencePhoneNumber.trim()) newErrors.homeReferencePhoneNumber = t('errors.phoneRequired');
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: t('errors.fixErrors'),
        description: t('errors.fixErrorsDesc'),
        variant: 'destructive'
      });
      setTimeout(() => {
        const firstError = document.querySelector('.border-red-500');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    onNext(formData);
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('common.loading')}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step7.title')}</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Reference in India */}
        <div className="border-b pb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('forms.step7.indiaReference')}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indiaReferenceName">
                {t('forms.step7.indiaReferenceName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indiaReferenceName"
                value={formData.indiaReferenceName}
                onChange={(e) => {
                  setFormData({ ...formData, indiaReferenceName: e.target.value });
                  setErrors(prev => ({ ...prev, indiaReferenceName: '' }));
                }}
                className={errors.indiaReferenceName ? 'border-red-500' : ''}
              />
              {errors.indiaReferenceName && <p className="text-sm text-red-600">{errors.indiaReferenceName}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indiaReferenceAddress">
                {t('forms.step7.indiaReferenceAddress')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indiaReferenceAddress"
                value={formData.indiaReferenceAddress}
                onChange={(e) => {
                  setFormData({ ...formData, indiaReferenceAddress: e.target.value });
                  setErrors(prev => ({ ...prev, indiaReferenceAddress: '' }));
                }}
                className={errors.indiaReferenceAddress ? 'border-red-500' : ''}
              />
              {errors.indiaReferenceAddress && <p className="text-sm text-red-600">{errors.indiaReferenceAddress}</p>}
            </div>

            <div className="md:col-span-2">
              <PhoneInput
                label={t('forms.step7.phoneNo')}
                countryCode={formData.indiaReferencePhoneCountryCode}
                phoneNumber={formData.indiaReferencePhoneNumber}
                onCountryCodeChange={(value) => setFormData({ ...formData, indiaReferencePhoneCountryCode: value })}
                onPhoneNumberChange={(value) => {
                  setFormData({ ...formData, indiaReferencePhoneNumber: value });
                  setErrors(prev => ({ ...prev, indiaReferencePhoneNumber: '' }));
                }}
                phoneCodes={phoneCodes}
                error={!!errors.indiaReferencePhoneNumber}
                required
              />
              {errors.indiaReferencePhoneNumber && <p className="text-sm text-red-600 mt-1">{errors.indiaReferencePhoneNumber}</p>}
            </div>
          </div>
        </div>

        {/* Reference in Home Country */}
        <div className="border-b pb-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">{t('forms.step7.homeReference')}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="homeReferenceName">
                {t('forms.step7.homeReferenceName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="homeReferenceName"
                value={formData.homeReferenceName}
                onChange={(e) => {
                  setFormData({ ...formData, homeReferenceName: e.target.value });
                  setErrors(prev => ({ ...prev, homeReferenceName: '' }));
                }}
                className={errors.homeReferenceName ? 'border-red-500' : ''}
              />
              {errors.homeReferenceName && <p className="text-sm text-red-600">{errors.homeReferenceName}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="homeReferenceAddress">
                {t('forms.step7.homeReferenceAddress')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="homeReferenceAddress"
                value={formData.homeReferenceAddress}
                onChange={(e) => {
                  setFormData({ ...formData, homeReferenceAddress: e.target.value });
                  setErrors(prev => ({ ...prev, homeReferenceAddress: '' }));
                }}
                className={errors.homeReferenceAddress ? 'border-red-500' : ''}
              />
              {errors.homeReferenceAddress && <p className="text-sm text-red-600">{errors.homeReferenceAddress}</p>}
            </div>

            <div className="md:col-span-2">
              <PhoneInput
                label={t('forms.step7.phoneNo')}
                countryCode={formData.homeReferencePhoneCountryCode}
                phoneNumber={formData.homeReferencePhoneNumber}
                onCountryCodeChange={(value) => setFormData({ ...formData, homeReferencePhoneCountryCode: value })}
                onPhoneNumberChange={(value) => {
                  setFormData({ ...formData, homeReferencePhoneNumber: value });
                  setErrors(prev => ({ ...prev, homeReferencePhoneNumber: '' }));
                }}
                phoneCodes={phoneCodes}
                error={!!errors.homeReferencePhoneNumber}
                required
              />
              {errors.homeReferencePhoneNumber && <p className="text-sm text-red-600 mt-1">{errors.homeReferencePhoneNumber}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('application.back')}
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
          {t('application.continue')}
        </Button>
      </div>
    </form>
  );
};

export default Step7References;
