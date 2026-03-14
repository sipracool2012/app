import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step3PassportDetails = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    passportNumber: data?.passportNumber || '',
    placeOfIssue: data?.placeOfIssue || '',
    dateOfIssue: data?.dateOfIssue || '',
    dateOfExpiry: data?.dateOfExpiry || '',
    otherPassportHeld: data?.otherPassportHeld || 'NO'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Passport Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="passportNumber">Passport Number *</Label>
          <Input
            id="passportNumber"
            value={formData.passportNumber}
            onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeOfIssue">Place of Issue *</Label>
          <Input
            id="placeOfIssue"
            value={formData.placeOfIssue}
            onChange={(e) => setFormData({ ...formData, placeOfIssue: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfIssue">Date of Issue *</Label>
          <Input
            id="dateOfIssue"
            type="date"
            value={formData.dateOfIssue}
            onChange={(e) => setFormData({ ...formData, dateOfIssue: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfExpiry">Date of Expiry *</Label>
          <Input
            id="dateOfExpiry"
            type="date"
            value={formData.dateOfExpiry}
            onChange={(e) => setFormData({ ...formData, dateOfExpiry: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="otherPassportHeld">Any other valid Passport/Identity Certificate(IC) held? *</Label>
          <Select value={formData.otherPassportHeld} onValueChange={(value) => setFormData({ ...formData, otherPassportHeld: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NO">No</SelectItem>
              <SelectItem value="YES">Yes</SelectItem>
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

export default Step3PassportDetails;
