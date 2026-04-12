import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step2ApplicantDetails = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [religions, setReligions] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    surname: data?.surname || '',
    givenNames: data?.givenNames || '',
    religion: data?.religion || '',
    visibleMarks: data?.visibleMarks || 'None',
    educationalQualification: data?.educationalQualification || '',
    qualificationFrom: data?.qualificationFrom || '',
    livedTwoYears: data?.livedTwoYears || 'Yes'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchConstants();
  }, []);

  const fetchConstants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/constants/all`);
      const data = await response.json();
      setReligions(data.religions || []);
      setQualifications(data.qualifications || []);
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

    if (!formData.surname.trim()) newErrors.surname = 'This field is required.';
    if (!formData.givenNames.trim()) newErrors.givenNames = 'This field is required.';
    if (!formData.religion) newErrors.religion = 'Please select an option.';
    if (!formData.visibleMarks.trim()) newErrors.visibleMarks = 'This field is required.';
    if (!formData.educationalQualification) newErrors.educationalQualification = 'Please select an option.';
    if (!formData.qualificationFrom.trim()) newErrors.qualificationFrom = 'This field is required.';

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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step2.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Surname */}
        <div className="space-y-2">
          <Label htmlFor="surname">
            {t('forms.step2.surname')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => {
              setFormData({ ...formData, surname: e.target.value });
              setErrors(prev => ({ ...prev, surname: '' }));
            }}
            className={errors.surname ? 'border-red-500' : ''}
          />
          {errors.surname && <p className="text-sm text-red-600">{errors.surname}</p>}
        </div>

        {/* Given Names */}
        <div className="space-y-2">
          <Label htmlFor="givenNames">
            {t('forms.step2.givenNames')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="givenNames"
            value={formData.givenNames}
            onChange={(e) => {
              setFormData({ ...formData, givenNames: e.target.value });
              setErrors(prev => ({ ...prev, givenNames: '' }));
            }}
            className={errors.givenNames ? 'border-red-500' : ''}
          />
          {errors.givenNames && <p className="text-sm text-red-600">{errors.givenNames}</p>}
        </div>

        {/* Religion */}
        <div className="space-y-2">
          <Label htmlFor="religion">
            {t('forms.step2.religion')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.religion} 
            onValueChange={(value) => {
              setFormData({ ...formData, religion: value });
              setErrors(prev => ({ ...prev, religion: '' }));
            }}
          >
            <SelectTrigger className={errors.religion ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('forms.step2.selectReligion')} />
            </SelectTrigger>
            <SelectContent>
              {religions.map((religion) => (
                <SelectItem key={religion} value={religion}>
                  {religion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.religion && <p className="text-sm text-red-600">{errors.religion}</p>}
        </div>

        {/* Visible Identification Marks */}
        <div className="space-y-2">
          <Label htmlFor="visibleMarks">
            {t('forms.step2.visibleMarks')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="visibleMarks"
            value={formData.visibleMarks}
            onChange={(e) => {
              setFormData({ ...formData, visibleMarks: e.target.value });
              setErrors(prev => ({ ...prev, visibleMarks: '' }));
            }}
            placeholder={t('forms.step2.visibleMarksHint')}
            className={errors.visibleMarks ? 'border-red-500' : ''}
          />
          {errors.visibleMarks && <p className="text-sm text-red-600">{errors.visibleMarks}</p>}
          {!errors.visibleMarks && <p className="text-xs text-gray-500">{t('forms.step2.visibleMarksHint')}</p>}
        </div>

        {/* Educational Qualification */}
        <div className="space-y-2">
          <Label htmlFor="educationalQualification">
            {t('forms.step2.educationalQualification')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.educationalQualification} 
            onValueChange={(value) => {
              setFormData({ ...formData, educationalQualification: value });
              setErrors(prev => ({ ...prev, educationalQualification: '' }));
            }}
          >
            <SelectTrigger className={errors.educationalQualification ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('forms.step2.selectQualification')} />
            </SelectTrigger>
            <SelectContent>
              {qualifications.map((qualification) => (
                <SelectItem key={qualification} value={qualification}>
                  {qualification}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.educationalQualification && <p className="text-sm text-red-600">{errors.educationalQualification}</p>}
        </div>

        {/* Qualification From */}
        <div className="space-y-2">
          <Label htmlFor="qualificationFrom">
            {t('forms.step2.qualificationFrom')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="qualificationFrom"
            value={formData.qualificationFrom}
            onChange={(e) => {
              setFormData({ ...formData, qualificationFrom: e.target.value });
              setErrors(prev => ({ ...prev, qualificationFrom: '' }));
            }}
            placeholder={t('forms.step2.qualificationFromPlaceholder')}
            className={errors.qualificationFrom ? 'border-red-500' : ''}
          />
          {errors.qualificationFrom && <p className="text-sm text-red-600">{errors.qualificationFrom}</p>}
        </div>

        {/* Lived Two Years */}
        <div className="space-y-2">
          <Label htmlFor="livedTwoYears">
            {t('forms.step2.livedTwoYears')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.livedTwoYears} 
            onValueChange={(value) => setFormData({ ...formData, livedTwoYears: value })} 
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">{t('forms.yes')}</SelectItem>
              <SelectItem value="No">{t('forms.no')}</SelectItem>
            </SelectContent>
          </Select>
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

export default Step2ApplicantDetails;
