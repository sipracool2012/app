import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step5FamilyDetails = ({ data, onNext, onBack }) => {
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
    maritalStatus: data?.maritalStatus || 'SINGLE',
    spouseName: data?.spouseName || '',
    spouseNationality: data?.spouseNationality || '',
    spousePreviousNationality: data?.spousePreviousNationality || '',
    spousePlaceOfBirth: data?.spousePlaceOfBirth || '',
    spouseCountryOfBirth: data?.spouseCountryOfBirth || '',
    pakistanConnection: data?.pakistanConnection || 'NO'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Family Details</h3>
      
      {/* Father's Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Father's Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fatherName">Father's Name *</Label>
            <Input
              id="fatherName"
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherNationality">Father's Nationality *</Label>
            <Input
              id="fatherNationality"
              value={formData.fatherNationality}
              onChange={(e) => setFormData({ ...formData, fatherNationality: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherPreviousNationality">Previous Nationality</Label>
            <Input
              id="fatherPreviousNationality"
              value={formData.fatherPreviousNationality}
              onChange={(e) => setFormData({ ...formData, fatherPreviousNationality: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherPlaceOfBirth">Father's Place of Birth *</Label>
            <Input
              id="fatherPlaceOfBirth"
              value={formData.fatherPlaceOfBirth}
              onChange={(e) => setFormData({ ...formData, fatherPlaceOfBirth: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fatherCountryOfBirth">Father's Country of Birth *</Label>
            <Input
              id="fatherCountryOfBirth"
              value={formData.fatherCountryOfBirth}
              onChange={(e) => setFormData({ ...formData, fatherCountryOfBirth: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Mother's Details */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Mother's Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="motherName">Mother's Name *</Label>
            <Input
              id="motherName"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherNationality">Mother's Nationality *</Label>
            <Input
              id="motherNationality"
              value={formData.motherNationality}
              onChange={(e) => setFormData({ ...formData, motherNationality: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherPreviousNationality">Previous Nationality</Label>
            <Input
              id="motherPreviousNationality"
              value={formData.motherPreviousNationality}
              onChange={(e) => setFormData({ ...formData, motherPreviousNationality: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherPlaceOfBirth">Mother's Place of Birth *</Label>
            <Input
              id="motherPlaceOfBirth"
              value={formData.motherPlaceOfBirth}
              onChange={(e) => setFormData({ ...formData, motherPlaceOfBirth: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motherCountryOfBirth">Mother's Country of Birth *</Label>
            <Input
              id="motherCountryOfBirth"
              value={formData.motherCountryOfBirth}
              onChange={(e) => setFormData({ ...formData, motherCountryOfBirth: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Marital Status */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Marital Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Applicant's Marital Status *</Label>
            <Select value={formData.maritalStatus} onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Single</SelectItem>
                <SelectItem value="MARRIED">Married</SelectItem>
                <SelectItem value="DIVORCED">Divorced</SelectItem>
                <SelectItem value="WIDOWED">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.maritalStatus === 'MARRIED' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="spouseName">Spouse's Name *</Label>
              <Input
                id="spouseName"
                value={formData.spouseName}
                onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseNationality">Spouse's Nationality *</Label>
              <Input
                id="spouseNationality"
                value={formData.spouseNationality}
                onChange={(e) => setFormData({ ...formData, spouseNationality: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spousePreviousNationality">Previous Nationality</Label>
              <Input
                id="spousePreviousNationality"
                value={formData.spousePreviousNationality}
                onChange={(e) => setFormData({ ...formData, spousePreviousNationality: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spousePlaceOfBirth">Spouse's Place of Birth *</Label>
              <Input
                id="spousePlaceOfBirth"
                value={formData.spousePlaceOfBirth}
                onChange={(e) => setFormData({ ...formData, spousePlaceOfBirth: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spouseCountryOfBirth">Spouse's Country of Birth *</Label>
              <Input
                id="spouseCountryOfBirth"
                value={formData.spouseCountryOfBirth}
                onChange={(e) => setFormData({ ...formData, spouseCountryOfBirth: e.target.value })}
                required
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pakistanConnection">Were your Parents/Grandparents Pakistan Nationals or Belong to Pakistan held area? *</Label>
        <Select value={formData.pakistanConnection} onValueChange={(value) => setFormData({ ...formData, pakistanConnection: value })} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NO">No</SelectItem>
            <SelectItem value="YES">Yes</SelectItem>
          </SelectContent>
        </Select>
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

export default Step5FamilyDetails;
