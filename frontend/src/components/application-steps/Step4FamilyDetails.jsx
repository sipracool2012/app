import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SearchableSelect } from '../ui/searchable-select';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step4FamilyDetails = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fatherName: data?.fatherName || '',
    fatherNationality: data?.fatherNationality || '',
    fatherPreviousNationality: data?.fatherPreviousNationality || '',
    fatherPlaceOfBirth: data?.fatherPlaceOfBirth || '',
    fatherCountryOfBirth: data?.fatherCountryOfBirth || '',
    motherName: data?.motherName || '',
    motherNationality: data?.motherNationality || '',
    motherPreviousNationality: data?.motherPreviousNationality || '',
    motherPlaceOfBirth: data?.motherPlaceOfBirth || '',
    motherCountryOfBirth: data?.motherCountryOfBirth || '',
    maritalStatus: data?.maritalStatus || 'Single',
    spouseName: data?.spouseName || '',
    spouseNationality: data?.spouseNationality || '',
    spousePreviousNationality: data?.spousePreviousNationality || '',
    spousePlaceOfBirth: data?.spousePlaceOfBirth || '',
    spouseCountryOfBirth: data?.spouseCountryOfBirth || '',
    pakistanConnection: data?.pakistanConnection || 'No'
  });

  useEffect(() => {
    fetchConstants();
  }, []);

  const fetchConstants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/constants/countries`);
      const data = await response.json();
      setCountries(data.countries || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
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

    // Validate Pakistan connection
    if (formData.pakistanConnection === 'Yes') {
      toast({
        title: t('forms.step4.cannotProceed'),
        description: t('forms.step4.pakistaniWarning'),
        variant: 'destructive'
      });
      return;
    }

    onNext(formData);
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('common.loading')}</div>;
  }

  const showSpouseFields = formData.maritalStatus === 'Married';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step4.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father's Details */}
        <div className="md:col-span-2 border-b pb-2 mb-2">
          <h4 className="text-lg font-semibold text-gray-800">{t('forms.step4.fatherDetails')}</h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherName">
            {t('forms.step4.fatherName')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fatherName"
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label={t('forms.step4.fatherNationality')}
          value={formData.fatherNationality}
          onValueChange={(value) => setFormData({ ...formData, fatherNationality: value })}
          options={countries}
          placeholder={t('forms.step4.selectNationality')}
          searchPlaceholder={t('forms.step4.searchCountries')}
          required
        />

        <SearchableSelect
          label={t('forms.step4.fatherPreviousNationality')}
          value={formData.fatherPreviousNationality}
          onValueChange={(value) => setFormData({ ...formData, fatherPreviousNationality: value })}
          options={countries}
          placeholder={t('forms.step4.selectPrevNationality')}
          searchPlaceholder={t('forms.step4.searchCountries')}
        />

        <div className="space-y-2">
          <Label htmlFor="fatherPlaceOfBirth">
            {t('forms.step4.fatherPlaceOfBirth')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fatherPlaceOfBirth"
            value={formData.fatherPlaceOfBirth}
            onChange={(e) => setFormData({ ...formData, fatherPlaceOfBirth: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label={t('forms.step4.fatherCountryOfBirth')}
          value={formData.fatherCountryOfBirth}
          onValueChange={(value) => setFormData({ ...formData, fatherCountryOfBirth: value })}
          options={countries}
          placeholder={t('forms.step3.selectCountry')}
          searchPlaceholder={t('forms.step4.searchCountries')}
          required
        />

        {/* Mother's Details */}
        <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-800">{t('forms.step4.motherDetails')}</h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherName">
            {t('forms.step4.motherName')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="motherName"
            value={formData.motherName}
            onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label={t('forms.step4.motherNationality')}
          value={formData.motherNationality}
          onValueChange={(value) => setFormData({ ...formData, motherNationality: value })}
          options={countries}
          placeholder={t('forms.step4.selectNationality')}
          searchPlaceholder={t('forms.step4.searchCountries')}
          required
        />

        <SearchableSelect
          label={t('forms.step4.motherPreviousNationality')}
          value={formData.motherPreviousNationality}
          onValueChange={(value) => setFormData({ ...formData, motherPreviousNationality: value })}
          options={countries}
          placeholder={t('forms.step4.selectPrevNationality')}
          searchPlaceholder={t('forms.step4.searchCountries')}
        />

        <div className="space-y-2">
          <Label htmlFor="motherPlaceOfBirth">
            {t('forms.step4.motherPlaceOfBirth')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="motherPlaceOfBirth"
            value={formData.motherPlaceOfBirth}
            onChange={(e) => setFormData({ ...formData, motherPlaceOfBirth: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label={t('forms.step4.motherCountryOfBirth')}
          value={formData.motherCountryOfBirth}
          onValueChange={(value) => setFormData({ ...formData, motherCountryOfBirth: value })}
          options={countries}
          placeholder={t('forms.step3.selectCountry')}
          searchPlaceholder={t('forms.step4.searchCountries')}
          required
        />

        {/* Marital Status */}
        <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-800">{t('forms.step4.maritalStatus')}</h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">
            {t('forms.step4.maritalStatus')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.maritalStatus} 
            onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })} 
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">{t('forms.step4.single')}</SelectItem>
              <SelectItem value="Married">{t('forms.step4.married')}</SelectItem>
              <SelectItem value="Divorced">{t('forms.step4.divorced')}</SelectItem>
              <SelectItem value="Widowed">{t('forms.step4.widowed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Spouse Details (conditional) */}
        {showSpouseFields && (
          <>
            <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
              <h4 className="text-lg font-semibold text-gray-800">{t('forms.step4.spouseDetails')}</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseName">
                {t('forms.step4.spouseName')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="spouseName"
                value={formData.spouseName}
                onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                required={showSpouseFields}
              />
            </div>

            <SearchableSelect
              label={t('forms.step4.spouseNationality')}
              value={formData.spouseNationality}
              onValueChange={(value) => setFormData({ ...formData, spouseNationality: value })}
              options={countries}
              placeholder={t('forms.step4.selectNationality')}
              searchPlaceholder={t('forms.step4.searchCountries')}
              required={showSpouseFields}
            />

            <SearchableSelect
              label={t('forms.step4.spousePreviousNationality')}
              value={formData.spousePreviousNationality}
              onValueChange={(value) => setFormData({ ...formData, spousePreviousNationality: value })}
              options={countries}
              placeholder={t('forms.step4.selectPrevNationality')}
              searchPlaceholder={t('forms.step4.searchCountries')}
            />

            <div className="space-y-2">
              <Label htmlFor="spousePlaceOfBirth">
                {t('forms.step4.spousePlaceOfBirth')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="spousePlaceOfBirth"
                value={formData.spousePlaceOfBirth}
                onChange={(e) => setFormData({ ...formData, spousePlaceOfBirth: e.target.value })}
                required={showSpouseFields}
              />
            </div>

            <SearchableSelect
              label={t('forms.step4.spouseCountryOfBirth')}
              value={formData.spouseCountryOfBirth}
              onValueChange={(value) => setFormData({ ...formData, spouseCountryOfBirth: value })}
              options={countries}
              placeholder={t('forms.step3.selectCountry')}
              searchPlaceholder={t('forms.step4.searchCountries')}
              required={showSpouseFields}
            />
          </>
        )}

        {/* Pakistan Connection */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="pakistanConnection">
              {t('forms.step4.pakistanConnectionLabel')} <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={formData.pakistanConnection} 
              onValueChange={(value) => setFormData({ ...formData, pakistanConnection: value })} 
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">{t('forms.no')}</SelectItem>
                <SelectItem value="Yes">{t('forms.yes')}</SelectItem>
              </SelectContent>
            </Select>
            {formData.pakistanConnection === 'Yes' && (
              <p className="text-sm text-red-600 mt-2 font-semibold">
                {t('forms.step4.pakistanWarningInline')}
              </p>
            )}
          </div>
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

export default Step4FamilyDetails;
