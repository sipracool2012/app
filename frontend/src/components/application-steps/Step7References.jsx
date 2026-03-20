import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChevronLeft } from 'lucide-react';

const Step10References = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    // India Reference
    indiaReferenceName: data?.indiaReferenceName || '',
    indiaReferenceAddress: data?.indiaReferenceAddress || '',
    indiaReferencePhone: data?.indiaReferencePhone || '',
    // Home Country Reference
    homeReferenceName: data?.homeReferenceName || '',
    homeReferenceAddress: data?.homeReferenceAddress || '',
    homeReferencePhone: data?.homeReferencePhone || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Reference</h3>
      
      {/* India Reference */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Reference in India</h4>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="indiaReferenceName">Reference Name in India *</Label>
            <Input
              id="indiaReferenceName"
              value={formData.indiaReferenceName}
              onChange={(e) => setFormData({ ...formData, indiaReferenceName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="indiaReferenceAddress">Address *</Label>
            <Input
              id="indiaReferenceAddress"
              value={formData.indiaReferenceAddress}
              onChange={(e) => setFormData({ ...formData, indiaReferenceAddress: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="indiaReferencePhone">Phone *</Label>
            <Input
              id="indiaReferencePhone"
              value={formData.indiaReferencePhone}
              onChange={(e) => setFormData({ ...formData, indiaReferencePhone: e.target.value })}
              placeholder="(+) Country code + Number"
              required
            />
          </div>
        </div>
      </div>

      {/* Home Country Reference */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Reference in Your Country</h4>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="homeReferenceName">Reference Name *</Label>
            <Input
              id="homeReferenceName"
              value={formData.homeReferenceName}
              onChange={(e) => setFormData({ ...formData, homeReferenceName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeReferenceAddress">Address *</Label>
            <Input
              id="homeReferenceAddress"
              value={formData.homeReferenceAddress}
              onChange={(e) => setFormData({ ...formData, homeReferenceAddress: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeReferencePhone">Phone *</Label>
            <Input
              id="homeReferencePhone"
              value={formData.homeReferencePhone}
              onChange={(e) => setFormData({ ...formData, homeReferencePhone: e.target.value })}
              placeholder="(+) Country code + Number"
              required
            />
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

export default Step10References;
