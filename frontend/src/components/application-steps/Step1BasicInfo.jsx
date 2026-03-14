import React, { useState } from 'react';
import { Calendar, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const Step1BasicInfo = ({ data, onNext, isFirstStep }) => {
  const [formData, setFormData] = useState({
    passportType: data?.passportType || 'ORDINARY',
    nationality: data?.nationality || '',
    portOfArrival: data?.portOfArrival || '',
    dateOfBirth: data?.dateOfBirth || '',
    email: data?.email || '',
    confirmEmail: data?.confirmEmail || '',
    expectedArrivalDate: data?.expectedArrivalDate || '',
    visaService: data?.visaService || 'Tourist (Day30)',
    visaServiceSubtype: data?.visaServiceSubtype || 'Recreation'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email !== formData.confirmEmail) {
      alert('Emails do not match!');
      return;
    }
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="passportType">Passport Type</Label>
          <Select value={formData.passportType} onValueChange={(value) => setFormData({ ...formData, passportType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ORDINARY">Ordinary</SelectItem>
              <SelectItem value="DIPLOMATIC">Diplomatic</SelectItem>
              <SelectItem value="OFFICIAL">Official</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portOfArrival">Port of Arrival</Label>
          <Input
            id="portOfArrival"
            value={formData.portOfArrival}
            onChange={(e) => setFormData({ ...formData, portOfArrival: e.target.value })}
            placeholder="e.g., Delhi"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email ID</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmEmail">Re-enter Email ID</Label>
          <Input
            id="confirmEmail"
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedArrivalDate">Expected Date of Arrival</Label>
          <Input
            id="expectedArrivalDate"
            type="date"
            value={formData.expectedArrivalDate}
            onChange={(e) => setFormData({ ...formData, expectedArrivalDate: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaService">Visa Service</Label>
          <Select value={formData.visaService} onValueChange={(value) => setFormData({ ...formData, visaService: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tourist (Day30)">Tourist (30 Days)</SelectItem>
              <SelectItem value="Tourist (1 Year)">Tourist (1 Year)</SelectItem>
              <SelectItem value="Tourist (5 Years)">Tourist (5 Years)</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaServiceSubtype">Visa Service Subtype</Label>
          <Select value={formData.visaServiceSubtype} onValueChange={(value) => setFormData({ ...formData, visaServiceSubtype: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Recreation">Recreation</SelectItem>
              <SelectItem value="Sightseeing">Sightseeing</SelectItem>
              <SelectItem value="Meeting Friends">Meeting Friends/Relatives</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
