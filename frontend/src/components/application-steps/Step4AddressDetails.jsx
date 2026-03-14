import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { ChevronLeft } from 'lucide-react';

const Step4AddressDetails = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    houseNoStreet: data?.houseNoStreet || '',
    villageTownCity: data?.villageTownCity || '',
    country: data?.country || '',
    stateProvince: data?.stateProvince || '',
    postalCode: data?.postalCode || '',
    phoneNo: data?.phoneNo || '',
    mobileNo: data?.mobileNo || '',
    emailAddress: data?.emailAddress || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Applicants Address Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="houseNoStreet">House No./Street *</Label>
          <Input
            id="houseNoStreet"
            value={formData.houseNoStreet}
            onChange={(e) => setFormData({ ...formData, houseNoStreet: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="villageTownCity">Village/Town/City *</Label>
          <Input
            id="villageTownCity"
            value={formData.villageTownCity}
            onChange={(e) => setFormData({ ...formData, villageTownCity: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stateProvince">State/Province/District *</Label>
          <Input
            id="stateProvince"
            value={formData.stateProvince}
            onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal/Zip Code *</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNo">Phone No. *</Label>
          <Input
            id="phoneNo"
            value={formData.phoneNo}
            onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
            placeholder="(+) Country code + Number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNo">Mobile No.</Label>
          <Input
            id="mobileNo"
            value={formData.mobileNo}
            onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="emailAddress">Email Address *</Label>
          <Input
            id="emailAddress"
            type="email"
            value={formData.emailAddress}
            onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
            required
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

export default Step4AddressDetails;
