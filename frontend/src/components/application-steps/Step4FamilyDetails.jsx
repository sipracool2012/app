import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SearchableSelect } from '../ui/searchable-select';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step4FamilyDetails = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
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
        title: 'Error',
        description: 'Failed to load countries',
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
        title: 'Cannot Proceed',
        description: 'You have indicated a Pakistani passport connection. Please contact the embassy directly for visa processing.',
        variant: 'destructive'
      });
      return;
    }

    onNext(formData);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const showSpouseFields = formData.maritalStatus === 'Married';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Family Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Father's Details */}
        <div className="md:col-span-2 border-b pb-2 mb-2">
          <h4 className="text-lg font-semibold text-gray-800">Father's Details</h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherName">
            Father's Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fatherName"
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label="Father's Nationality"
          value={formData.fatherNationality}
          onValueChange={(value) => setFormData({ ...formData, fatherNationality: value })}
          options={countries}
          placeholder="Select nationality"
          searchPlaceholder="Search countries..."
          required
        />

        <SearchableSelect
          label="Previous Nationality"
          value={formData.fatherPreviousNationality}
          onValueChange={(value) => setFormData({ ...formData, fatherPreviousNationality: value })}
          options={countries}
          placeholder="Select if applicable"
          searchPlaceholder="Search countries..."
        />

        <div className="space-y-2">
          <Label htmlFor="fatherPlaceOfBirth">
            Father's Place of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fatherPlaceOfBirth"
            value={formData.fatherPlaceOfBirth}
            onChange={(e) => setFormData({ ...formData, fatherPlaceOfBirth: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label="Father's Country of Birth"
          value={formData.fatherCountryOfBirth}
          onValueChange={(value) => setFormData({ ...formData, fatherCountryOfBirth: value })}
          options={countries}
          placeholder="Select country"
          searchPlaceholder="Search countries..."
          required
        />

        {/* Mother's Details */}
        <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-800">Mother's Details</h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="motherName">
            Mother's Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="motherName"
            value={formData.motherName}
            onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label="Mother's Nationality"
          value={formData.motherNationality}
          onValueChange={(value) => setFormData({ ...formData, motherNationality: value })}
          options={countries}
          placeholder="Select nationality"
          searchPlaceholder="Search countries..."
          required
        />

        <SearchableSelect
          label="Previous Nationality"
          value={formData.motherPreviousNationality}
          onValueChange={(value) => setFormData({ ...formData, motherPreviousNationality: value })}
          options={countries}
          placeholder="Select if applicable"
          searchPlaceholder="Search countries..."
        />

        <div className="space-y-2">
          <Label htmlFor="motherPlaceOfBirth">
            Mother's Place of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="motherPlaceOfBirth"
            value={formData.motherPlaceOfBirth}
            onChange={(e) => setFormData({ ...formData, motherPlaceOfBirth: e.target.value })}
            required
          />
        </div>

        <SearchableSelect
          label="Mother's Country of Birth"
          value={formData.motherCountryOfBirth}
          onValueChange={(value) => setFormData({ ...formData, motherCountryOfBirth: value })}
          options={countries}
          placeholder="Select country"
          searchPlaceholder="Search countries..."
          required
        />

        {/* Marital Status */}
        <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-800">Marital Status</h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">
            Marital Status <span className="text-red-500">*</span>
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
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Spouse Details (conditional) */}
        {showSpouseFields && (
          <>
            <div className="md:col-span-2 border-b pb-2 mb-2 mt-4">
              <h4 className="text-lg font-semibold text-gray-800">Spouse's Details</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseName">
                Spouse's Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="spouseName"
                value={formData.spouseName}
                onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                required={showSpouseFields}
              />
            </div>

            <SearchableSelect
              label="Spouse's Nationality"
              value={formData.spouseNationality}
              onValueChange={(value) => setFormData({ ...formData, spouseNationality: value })}
              options={countries}
              placeholder="Select nationality"
              searchPlaceholder="Search countries..."
              required={showSpouseFields}
            />

            <SearchableSelect
              label="Previous Nationality"
              value={formData.spousePreviousNationality}
              onValueChange={(value) => setFormData({ ...formData, spousePreviousNationality: value })}
              options={countries}
              placeholder="Select if applicable"
              searchPlaceholder="Search countries..."
            />

            <div className="space-y-2">
              <Label htmlFor="spousePlaceOfBirth">
                Spouse's Place of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="spousePlaceOfBirth"
                value={formData.spousePlaceOfBirth}
                onChange={(e) => setFormData({ ...formData, spousePlaceOfBirth: e.target.value })}
                required={showSpouseFields}
              />
            </div>

            <SearchableSelect
              label="Spouse's Country of Birth"
              value={formData.spouseCountryOfBirth}
              onValueChange={(value) => setFormData({ ...formData, spouseCountryOfBirth: value })}
              options={countries}
              placeholder="Select country"
              searchPlaceholder="Search countries..."
              required={showSpouseFields}
            />
          </>
        )}

        {/* Pakistan Connection */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="pakistanConnection">
              Were your Parents/Grandparents Pakistan Nationals or Belong to Pakistan held area? <span className="text-red-500">*</span>
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
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
            {formData.pakistanConnection === 'Yes' && (
              <p className="text-sm text-red-600 mt-2 font-semibold">
                ⚠️ Cannot Proceed - You have indicated a Pakistani passport connection. Please contact the embassy directly for visa processing.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default Step4FamilyDetails;
