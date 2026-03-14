import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step9OtherInfo = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    countriesVisited: data?.countriesVisited || '',
    visitedSAARCCountries: data?.visitedSAARCCountries || 'No'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Other Information</h3>
      
      <div className="space-y-2">
        <Label htmlFor="countriesVisited">Countries Visited in Last 10 years *</Label>
        <Textarea
          id="countriesVisited"
          value={formData.countriesVisited}
          onChange={(e) => setFormData({ ...formData, countriesVisited: e.target.value })}
          placeholder="e.g., Spain, Egypt, Vietnam, Cambodia, Thailand"
          rows={3}
          required
        />
        <p className="text-sm text-gray-500">Do not copy paste, look up countries one by one</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="visitedSAARCCountries">Have you visited SAARC countries? *</Label>
        <Select value={formData.visitedSAARCCountries} onValueChange={(value) => setFormData({ ...formData, visitedSAARCCountries: value })} required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Yes">Yes</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">SAARC countries: Afghanistan, Bangladesh, Bhutan, Maldives, Nepal, Pakistan, Sri Lanka</p>
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

export default Step9OtherInfo;
