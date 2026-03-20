import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step2ApplicantDetails = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const [religions, setReligions] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    surname: data?.surname || '',
    givenNames: data?.givenNames || '',
    religion: data?.religion || '',
    visibleMarks: data?.visibleMarks || 'None',
    educationalQualification: data?.educationalQualification || '',
    qualificationFrom: data?.qualificationFrom || '',
    livedTwoYears: data?.livedTwoYears || 'Yes'
  });

  useEffect(() => {
    fetchConstants();
  }, []);

  const fetchConstants = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/constants/all`);
      const data = await response.json();
      setReligions(data.religions || []);
      setQualifications(data.qualifications || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch constants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Applicant Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Surname */}
        <div className="space-y-2">
          <Label htmlFor="surname">
            Surname (Family Name) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="surname"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
          />
        </div>

        {/* Given Names */}
        <div className="space-y-2">
          <Label htmlFor="givenNames">
            Given Names (First Name) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="givenNames"
            value={formData.givenNames}
            onChange={(e) => setFormData({ ...formData, givenNames: e.target.value })}
            required
          />
        </div>

        {/* Religion */}
        <div className="space-y-2">
          <Label htmlFor="religion">
            Religion <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.religion} 
            onValueChange={(value) => setFormData({ ...formData, religion: value })} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              {religions.map((religion) => (
                <SelectItem key={religion} value={religion}>
                  {religion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Visible Identification Marks */}
        <div className="space-y-2">
          <Label htmlFor="visibleMarks">
            Visible Identification Marks
          </Label>
          <Input
            id="visibleMarks"
            value={formData.visibleMarks}
            onChange={(e) => setFormData({ ...formData, visibleMarks: e.target.value })}
            placeholder="None"
          />
          <p className="text-xs text-gray-500">Default: None</p>
        </div>

        {/* Educational Qualification */}
        <div className="space-y-2">
          <Label htmlFor="educationalQualification">
            Educational Qualification <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.educationalQualification} 
            onValueChange={(value) => setFormData({ ...formData, educationalQualification: value })} 
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent>
              {qualifications.map((qualification) => (
                <SelectItem key={qualification} value={qualification}>
                  {qualification}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Qualification From */}
        <div className="space-y-2">
          <Label htmlFor="qualificationFrom">
            Qualification From (College/University) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="qualificationFrom"
            value={formData.qualificationFrom}
            onChange={(e) => setFormData({ ...formData, qualificationFrom: e.target.value })}
            placeholder="University/College name"
            required
          />
        </div>

        {/* Lived Two Years */}
        <div className="space-y-2">
          <Label htmlFor="livedTwoYears">
            Have you lived for at least two years in the country where you are applying visa? <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.livedTwoYears} 
            onValueChange={(value) => setFormData({ ...formData, livedTwoYears: value })} 
            required
          >
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
