import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Step8AdditionalQuestions = ({ data, onNext, onBack }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    arrestedConvicted: data?.arrestedConvicted || 'No',
    arrestedConvictedReason: data?.arrestedConvictedReason || '',
    refusedEntry: data?.refusedEntry || 'No',
    refusedEntryReason: data?.refusedEntryReason || '',
    humanTrafficking: data?.humanTrafficking || 'No',
    humanTraffickingReason: data?.humanTraffickingReason || '',
    cyberCrime: data?.cyberCrime || 'No',
    cyberCrimeReason: data?.cyberCrimeReason || '',
    terroristViews: data?.terroristViews || 'No',
    terroristViewsReason: data?.terroristViewsReason || '',
    asylumSought: data?.asylumSought || 'No',
    asylumSoughtReason: data?.asylumSoughtReason || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const questions = [
    {
      key: 'arrestedConvicted',
      reasonKey: 'arrestedConvictedReason',
      text: 'Has any applicant been arrested/ prosecuted/ convicted by Court of Law of any country?'
    },
    {
      key: 'refusedEntry',
      reasonKey: 'refusedEntryReason',
      text: 'Has any applicant been refused entry / deported by any country including India?'
    },
    {
      key: 'humanTrafficking',
      reasonKey: 'humanTraffickingReason',
      text: 'Has any applicant been engaged in Human trafficking/ Drug trafficking/ Child abuse/ Crime against women/ Economic offense / Financial fraud?'
    },
    {
      key: 'cyberCrime',
      reasonKey: 'cyberCrimeReason',
      text: 'Has any applicant been engaged in Cyber crime/ Fake Indian Currency Notes/ Hawala transactions/ IPR violations?'
    },
    {
      key: 'terroristViews',
      reasonKey: 'terroristViewsReason',
      text: 'Has any applicant at any time been associated with any organization declared as terrorist organization by the Government of India OR by any country/ international organization?'
    },
    {
      key: 'asylumSought',
      reasonKey: 'asylumSoughtReason',
      text: 'Has any applicant sought asylum (political or otherwise) in any country?'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step8.title')}</h3>
      <p className="text-sm text-gray-600 mb-4">{t('forms.step8.subtitle')}</p>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.key} className="border rounded-lg p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">
                {index + 1}. {question.text} <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData[question.key]} 
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  [question.key]: value,
                  // Clear reason if No is selected
                  [question.reasonKey]: value === 'No' ? '' : formData[question.reasonKey]
                })}
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

            {formData[question.key] === 'Yes' && (
              <div className="space-y-2 pl-4 border-l-2 border-blue-500">
                <Label htmlFor={question.reasonKey}>
                  {t('forms.step8.provideReason')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={question.reasonKey}
                  value={formData[question.reasonKey]}
                  onChange={(e) => setFormData({ ...formData, [question.reasonKey]: e.target.value })}
                  placeholder={t('forms.step8.reasonPlaceholder')}
                  required={formData[question.key] === 'Yes'}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
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

export default Step8AdditionalQuestions;
