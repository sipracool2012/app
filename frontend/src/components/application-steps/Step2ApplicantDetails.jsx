import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step2ApplicantDetails = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    surname: data?.surname || '',
    givenNames: data?.givenNames || '',
    gender: data?.gender || '',
    applicantDateOfBirth: data?.applicantDateOfBirth || '',
    townOfBirth: data?.townOfBirth || '',
    countryOfBirth: data?.countryOfBirth || '',
    citizenshipNo: data?.citizenshipNo || 'NA',
    religion: data?.religion || '',
    visibleMarks: data?.visibleMarks || 'none',
    educationalQualification: data?.educationalQualification || '',
    qualificationFrom: data?.qualificationFrom || '',
    applicantNationality: data?.applicantNationality || '',
    nationalityByBirth: data?.nationalityByBirth || '',
    livedTwoYears: data?.livedTwoYears || 'Yes'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Applicant Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="surname">Surname (Family Name) *</Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="givenNames">Given Names (First Name) *</Label>
          <Input
            id="givenNames"
            value={formData.givenNames}
            onChange={(e) => setFormData({ ...formData, givenNames: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicantDateOfBirth">Date of Birth *</Label>
          <Input
            id="applicantDateOfBirth"
            type="date"
            value={formData.applicantDateOfBirth}
            onChange={(e) => setFormData({ ...formData, applicantDateOfBirth: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="townOfBirth">Town/City of Birth *</Label>
          <Input
            id="townOfBirth"
            value={formData.townOfBirth}
            onChange={(e) => setFormData({ ...formData, townOfBirth: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="countryOfBirth">Country of Birth *</Label>
          <Input
            id="countryOfBirth"
            value={formData.countryOfBirth}
            onChange={(e) => setFormData({ ...formData, countryOfBirth: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="citizenshipNo">Citizenship/National ID No</Label>
          <Input
            id="citizenshipNo"
            value={formData.citizenshipNo}
            onChange={(e) => setFormData({ ...formData, citizenshipNo: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="religion">Religion *</Label>
          <Select value={formData.religion} onValueChange={(value) => setFormData({ ...formData, religion: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Christian">Christian</SelectItem>
              <SelectItem value="Muslim">Muslim</SelectItem>
              <SelectItem value="Hindu">Hindu</SelectItem>
              <SelectItem value="Buddhist">Buddhist</SelectItem>
              <SelectItem value="Jewish">Jewish</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visibleMarks">Visible Identification Marks</Label>
          <Input
            id="visibleMarks"
            value={formData.visibleMarks}
            onChange={(e) => setFormData({ ...formData, visibleMarks: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationalQualification">Educational Qualification *</Label>
          <Select value={formData.educationalQualification} onValueChange={(value) => setFormData({ ...formData, educationalQualification: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Below Matriculation">Below Matriculation</SelectItem>
              <SelectItem value="Higher secondary">Higher Secondary</SelectItem>
              <SelectItem value="Graduate">Graduate</SelectItem>
              <SelectItem value="Post Graduate">Post Graduate</SelectItem>
              <SelectItem value="Doctorate">Doctorate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualificationFrom">Qualification From (College/University) *</Label>
          <Input
            id="qualificationFrom"
            value={formData.qualificationFrom}
            onChange={(e) => setFormData({ ...formData, qualificationFrom: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicantNationality">Nationality *</Label>
          <Input
            id="applicantNationality"
            value={formData.applicantNationality}
            onChange={(e) => setFormData({ ...formData, applicantNationality: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalityByBirth">Did you acquire nationality by birth or naturalization? *</Label>
          <Select value={formData.nationalityByBirth} onValueChange={(value) => setFormData({ ...formData, nationalityByBirth: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Birth">By Birth</SelectItem>
              <SelectItem value="Naturalization">By Naturalization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="livedTwoYears">Have you lived for at least two years in the country where you are applying visa? *</Label>
          <Select value={formData.livedTwoYears} onValueChange={(value) => setFormData({ ...formData, livedTwoYears: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
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

export default Step2ApplicantDetails;
