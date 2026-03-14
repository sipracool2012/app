import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step8PreviousVisit = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    visitedIndiaBefore: data?.visitedIndiaBefore || 'No'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Previous Visa/Currently Valid Visa</h3>
      
      <div className="space-y-2">
        <Label htmlFor="visitedIndiaBefore">Have you ever visited India before? *</Label>
        <Select value={formData.visitedIndiaBefore} onValueChange={(value) => setFormData({ ...formData, visitedIndiaBefore: value })} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Yes">Yes</SelectItem>
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

export default Step8PreviousVisit;
