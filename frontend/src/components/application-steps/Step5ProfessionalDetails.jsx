import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const Step5ProfessionalDetails = ({ data, onNext, onBack, onDataChange }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    presentOccupation: data?.presentOccupation || '',
    employerName: data?.employerName || '',
    designation: data?.designation || '',
    employerAddress: data?.employerAddress || '',
    employerPhone: data?.employerPhone || '',
    pastOccupation: data?.pastOccupation || '',
    militaryService: data?.militaryService || 'No',
    pastOccupationIfAny: data?.pastOccupationIfAny || ''
  });
  // Report local changes to parent so jumping away via stepper saves latest data
  useEffect(() => { onDataChange?.(formData); }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.presentOccupation) newErrors.presentOccupation = t('errors.selectOption');
    if (!formData.employerName.trim()) newErrors.employerName = t('errors.fieldRequired');
    if (!formData.employerAddress.trim()) newErrors.employerAddress = t('errors.fieldRequired');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step5.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="presentOccupation">{t('forms.step5.presentOccupation')} <span className="text-red-500">*</span></Label>
          <Select value={formData.presentOccupation} onValueChange={(value) => {
            setFormData({ ...formData, presentOccupation: value });
            setErrors(prev => ({ ...prev, presentOccupation: '' }));
          }}>
            <SelectTrigger className={errors.presentOccupation ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('forms.step5.selectOccupation')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Private service">{t('forms.step5.privateService')}</SelectItem>
              <SelectItem value="Government service">{t('forms.step5.governmentService')}</SelectItem>
              <SelectItem value="Self employed">{t('forms.step5.selfEmployed')}</SelectItem>
              <SelectItem value="Student">{t('forms.step5.studentOcc')}</SelectItem>
              <SelectItem value="Retired">{t('forms.step5.retired')}</SelectItem>
              <SelectItem value="Housewife">{t('forms.step5.housewife')}</SelectItem>
              <SelectItem value="Others">{t('forms.step5.others')}</SelectItem>
            </SelectContent>
          </Select>
          {errors.presentOccupation && <p className="text-sm text-red-600">{errors.presentOccupation}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employerName">{t('forms.step5.employerName')} <span className="text-red-500">*</span></Label>
          <Input
            id="employerName"
            value={formData.employerName}
            onChange={(e) => {
              setFormData({ ...formData, employerName: e.target.value });
              setErrors(prev => ({ ...prev, employerName: '' }));
            }}
            className={errors.employerName ? 'border-red-500' : ''}
          />
          {errors.employerName && <p className="text-sm text-red-600">{errors.employerName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">{t('forms.step5.designation')}</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            placeholder={t('forms.step5.designationPlaceholder')}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="employerAddress">{t('forms.step5.employerAddress')} <span className="text-red-500">*</span></Label>
          <Input
            id="employerAddress"
            value={formData.employerAddress}
            onChange={(e) => {
              setFormData({ ...formData, employerAddress: e.target.value });
              setErrors(prev => ({ ...prev, employerAddress: '' }));
            }}
            className={errors.employerAddress ? 'border-red-500' : ''}
          />
          {errors.employerAddress && <p className="text-sm text-red-600">{errors.employerAddress}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employerPhone">{t('forms.step5.employerPhone')}</Label>
          <Input
            id="employerPhone"
            value={formData.employerPhone}
            onChange={(e) => setFormData({ ...formData, employerPhone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pastOccupation">{t('forms.step5.pastOccupation')}</Label>
          <Input
            id="pastOccupation"
            value={formData.pastOccupation}
            onChange={(e) => setFormData({ ...formData, pastOccupation: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="militaryService">{t('forms.step5.militaryService')} *</Label>
          <Select value={formData.militaryService} onValueChange={(value) => setFormData({ ...formData, militaryService: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">{t('forms.no')}</SelectItem>
              <SelectItem value="Yes">{t('forms.yes')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pastOccupationIfAny">{t('forms.step5.pastOccupationIfAny')}</Label>
          <Input
            id="pastOccupationIfAny"
            value={formData.pastOccupationIfAny}
            onChange={(e) => setFormData({ ...formData, pastOccupationIfAny: e.target.value })}
          />
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

export default Step5ProfessionalDetails;
