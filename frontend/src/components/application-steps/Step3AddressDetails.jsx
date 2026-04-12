import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { SearchableSelect } from '../ui/searchable-select';
import { PhoneInput } from '../ui/phone-input';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step3AddressDetails = ({ data, onNext, onBack, onDataChange }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
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
  // Report local changes to parent so jumping away via stepper saves latest data
  useEffect(() => { onDataChange?.(formData); }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps
  const [errors, setErrors] = useState({});

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
    if (!formData.houseNoStreet.trim()) newErrors.houseNoStreet = 'This field is required.';
    if (!formData.villageTownCity.trim()) newErrors.villageTownCity = 'This field is required.';
    if (!formData.country) newErrors.country = 'Please select an option.';
    if (!formData.stateProvince.trim()) newErrors.stateProvince = 'This field is required.';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'This field is required.';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast({
        title: 'Please fix the errors below',
        description: 'Some required fields are missing or contain invalid values.',
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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step3.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* House No./Street */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="houseNoStreet">
            {t('forms.step3.houseNoStreet')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="houseNoStreet"
            value={formData.houseNoStreet}
            onChange={(e) => {
              setFormData({ ...formData, houseNoStreet: e.target.value });
              setErrors(prev => ({ ...prev, houseNoStreet: '' }));
            }}
            className={errors.houseNoStreet ? 'border-red-500' : ''}
          />
          {errors.houseNoStreet && <p className="text-sm text-red-600">{errors.houseNoStreet}</p>}
        </div>

        {/* Village/Town/City */}
        <div className="space-y-2">
          <Label htmlFor="villageTownCity">
            {t('forms.step3.villageTownCity')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="villageTownCity"
            value={formData.villageTownCity}
            onChange={(e) => {
              setFormData({ ...formData, villageTownCity: e.target.value });
              setErrors(prev => ({ ...prev, villageTownCity: '' }));
            }}
            className={errors.villageTownCity ? 'border-red-500' : ''}
          />
          {errors.villageTownCity && <p className="text-sm text-red-600">{errors.villageTownCity}</p>}
        </div>

        {/* Country */}
        <div>
          <SearchableSelect
            label={t('forms.step3.country')}
            value={formData.country}
            onValueChange={(value) => {
              setFormData({ ...formData, country: value });
              setErrors(prev => ({ ...prev, country: '' }));
            }}
            options={countries}
            placeholder={t('forms.step3.selectCountry')}
            searchPlaceholder={t('forms.step3.searchCountries')}
            error={!!errors.country}
            required
          />
          {errors.country && <p className="text-sm text-red-600 mt-1">{errors.country}</p>}
        </div>

        {/* State/Province/District */}
        <div className="space-y-2">
          <Label htmlFor="stateProvince">
            {t('forms.step3.stateProvince')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="stateProvince"
            value={formData.stateProvince}
            onChange={(e) => {
              setFormData({ ...formData, stateProvince: e.target.value });
              setErrors(prev => ({ ...prev, stateProvince: '' }));
            }}
            className={errors.stateProvince ? 'border-red-500' : ''}
          />
          {errors.stateProvince && <p className="text-sm text-red-600">{errors.stateProvince}</p>}
        </div>

        {/* Postal/Zip Code */}
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            {t('forms.step3.postalCode')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => {
              setFormData({ ...formData, postalCode: e.target.value });
              setErrors(prev => ({ ...prev, postalCode: '' }));
            }}
            className={errors.postalCode ? 'border-red-500' : ''}
          />
          {errors.postalCode && <p className="text-sm text-red-600">{errors.postalCode}</p>}
        </div>

        {/* Phone Number with Country Code */}
        <div className="md:col-span-2">
          <PhoneInput
            label={t('forms.step3.phoneNo')}
            countryCode={formData.phoneCountryCode}
            phoneNumber={formData.phoneNumber}
            onCountryCodeChange={(value) => setFormData({ ...formData, phoneCountryCode: value })}
            onPhoneNumberChange={(value) => {
              setFormData({ ...formData, phoneNumber: value });
              setErrors(prev => ({ ...prev, phoneNumber: '' }));
            }}
            phoneCodes={phoneCodes}
            error={!!errors.phoneNumber}
            required
          />
          {errors.phoneNumber && <p className="text-sm text-red-600 mt-1">{errors.phoneNumber}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('application.back')}
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {t('application.continue')}
        </Button>
      </div>
    </form>
  );
};

export default Step3AddressDetails;
