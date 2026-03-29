import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Step5ProfessionalDetails = ({ data, onNext, onBack }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step5.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="presentOccupation">{t('forms.step5.presentOccupation')} *</Label>
          <Select value={formData.presentOccupation} onValueChange={(value) => setFormData({ ...formData, presentOccupation: value })} required>
            <SelectTrigger>
              <SelectValue placeholder={t('forms.step5.selectOccupation')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Private service">Private Service</SelectItem>
              <SelectItem value="Government service">Government Service</SelectItem>
              <SelectItem value="Self employed">Self Employed</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
              <SelectItem value="Housewife">Housewife</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employerName">{t('forms.step5.employerName')} *</Label>
          <Input
            id="employerName"
            value={formData.employerName}
            onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
            required
          />
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
          <Label htmlFor="employerAddress">{t('forms.step5.employerAddress')} *</Label>
          <Input
            id="employerAddress"
            value={formData.employerAddress}
            onChange={(e) => setFormData({ ...formData, employerAddress: e.target.value })}
            required
          />
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
          <Select value={formData.militaryService} onValueChange={(value) => setFormData({ ...formData, militaryService: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
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
