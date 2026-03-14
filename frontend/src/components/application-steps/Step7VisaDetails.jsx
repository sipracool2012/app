import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step7VisaDetails = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    typeOfVisa: data?.typeOfVisa || 'e-Visa',
    visaServiceType: data?.visaServiceType || 'Tourist',
    placesToVisit: data?.placesToVisit || '',
    placesToVisitLine2: data?.placesToVisitLine2 || '',
    hotelBooked: data?.hotelBooked || 'NO',
    durationOfVisa: data?.durationOfVisa || '30 days',
    numberOfEntries: data?.numberOfEntries || 'Double',
    portOfArrivalIndia: data?.portOfArrivalIndia || '',
    expectedPortOfExit: data?.expectedPortOfExit || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Details of Visa Sought</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="typeOfVisa">Type of Visa *</Label>
          <Select value={formData.typeOfVisa} onValueChange={(value) => setFormData({ ...formData, typeOfVisa: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="e-Visa">e-Visa</SelectItem>
              <SelectItem value="Regular Visa">Regular Visa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaServiceType">Visa Service *</Label>
          <Select value={formData.visaServiceType} onValueChange={(value) => setFormData({ ...formData, visaServiceType: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tourist">Tourist</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
              <SelectItem value="Conference">Conference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="placesToVisit">Places to be visited *</Label>
          <Textarea
            id="placesToVisit"
            value={formData.placesToVisit}
            onChange={(e) => setFormData({ ...formData, placesToVisit: e.target.value })}
            placeholder="e.g., DELHI AMRISTAR SHIMLA AGRA JAIPUR"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="placesToVisitLine2">Places to be visited (Line 2)</Label>
          <Textarea
            id="placesToVisitLine2"
            value={formData.placesToVisitLine2}
            onChange={(e) => setFormData({ ...formData, placesToVisitLine2: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="hotelBooked">Have you booked any room in Hotel/Resort etc. through any Tour Operator? *</Label>
          <Select value={formData.hotelBooked} onValueChange={(value) => setFormData({ ...formData, hotelBooked: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NO">No</SelectItem>
              <SelectItem value="YES">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="durationOfVisa">Duration of Visa *</Label>
          <Select value={formData.durationOfVisa} onValueChange={(value) => setFormData({ ...formData, durationOfVisa: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30 days">30 days</SelectItem>
              <SelectItem value="1 year">1 year</SelectItem>
              <SelectItem value="5 years">5 years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfEntries">No. of Entries *</Label>
          <Select value={formData.numberOfEntries} onValueChange={(value) => setFormData({ ...formData, numberOfEntries: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single">Single</SelectItem>
              <SelectItem value="Double">Double</SelectItem>
              <SelectItem value="Multiple">Multiple</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portOfArrivalIndia">Port of Arrival in India *</Label>
          <Input
            id="portOfArrivalIndia"
            value={formData.portOfArrivalIndia}
            onChange={(e) => setFormData({ ...formData, portOfArrivalIndia: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedPortOfExit">Expected Port of Exit from India</Label>
          <Input
            id="expectedPortOfExit"
            value={formData.expectedPortOfExit}
            onChange={(e) => setFormData({ ...formData, expectedPortOfExit: e.target.value })}
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

export default Step7VisaDetails;
