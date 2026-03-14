import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step6ProfessionalDetails = ({ data, onNext, onBack }) => {
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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional/Occupation Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="presentOccupation">Present Occupation *</Label>
          <Select value={formData.presentOccupation} onValueChange={(value) => setFormData({ ...formData, presentOccupation: value })} required>
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
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
          <Label htmlFor="employerName">Employer Name/Business *</Label>
          <Input
            id="employerName"
            value={formData.employerName}
            onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            placeholder="Use from Business Card if available"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="employerAddress">Address *</Label>
          <Input
            id="employerAddress"
            value={formData.employerAddress}
            onChange={(e) => setFormData({ ...formData, employerAddress: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="employerPhone">Phone</Label>
          <Input
            id="employerPhone"
            value={formData.employerPhone}
            onChange={(e) => setFormData({ ...formData, employerPhone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pastOccupation">Past Occupation if any</Label>
          <Input
            id="pastOccupation"
            value={formData.pastOccupation}
            onChange={(e) => setFormData({ ...formData, pastOccupation: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="militaryService">Are/were you in a Military/Semi-Military/Police/Security Organization? *</Label>
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
          <Label htmlFor="pastOccupationIfAny">Past occupation if any</Label>
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
          Back
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default Step6ProfessionalDetails;
