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
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
          />
        </div>

        {/* Given Names */}
        <div className="space-y-2">
          <Label htmlFor="givenNames">
            {t('forms.step2.givenNames')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="givenNames"
            value={formData.givenNames}
            onChange={(e) => setFormData({ ...formData, givenNames: e.target.value })}
            required
          />
        </div>

        {/* Religion */}
        <div className="space-y-2">
          <Label htmlFor="religion">
            {t('forms.step2.religion')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.religion} 
            onValueChange={(value) => setFormData({ ...formData, religion: value })} 
            required
          >
            <SelectTrigger>
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
        </div>

        {/* Visible Identification Marks */}
        <div className="space-y-2">
          <Label htmlFor="visibleMarks">
            {t('forms.step2.visibleMarks')}
          </Label>
          <Input
            id="visibleMarks"
            value={formData.visibleMarks}
            onChange={(e) => setFormData({ ...formData, visibleMarks: e.target.value })}
            placeholder={t('forms.step2.visibleMarksHint')}
          />
          <p className="text-xs text-gray-500">{t('forms.step2.visibleMarksHint')}</p>
        </div>

        {/* Educational Qualification */}
        <div className="space-y-2">
          <Label htmlFor="educationalQualification">
            {t('forms.step2.educationalQualification')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.educationalQualification} 
            onValueChange={(value) => setFormData({ ...formData, educationalQualification: value })} 
            required
          >
            <SelectTrigger>
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
        </div>

        {/* Qualification From */}
        <div className="space-y-2">
          <Label htmlFor="qualificationFrom">
            {t('forms.step2.qualificationFrom')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="qualificationFrom"
            value={formData.qualificationFrom}
            onChange={(e) => setFormData({ ...formData, qualificationFrom: e.target.value })}
            placeholder={t('forms.step2.qualificationFromPlaceholder')}
            required
          />
        </div>

        {/* Lived Two Years */}
        <div className="space-y-2">
          <Label htmlFor="livedTwoYears">
            {t('forms.step2.livedTwoYears')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.livedTwoYears} 
            onValueChange={(value) => setFormData({ ...formData, livedTwoYears: value })} 
            required
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
