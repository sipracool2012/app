import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronLeft } from 'lucide-react';

const Step11AdditionalQuestions = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    arrestedConvicted: data?.arrestedConvicted || 'False',
    refusedEntry: data?.refusedEntry || 'False',
    humanTrafficking: data?.humanTrafficking || 'False',
    cyberCrime: data?.cyberCrime || 'False',
    terroristViews: data?.terroristViews || 'False',
    asylumSought: data?.asylumSought || 'False'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Question Details</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="arrestedConvicted">Have you ever been arrested/prosecuted/convicted by Court of Law of any country? *</Label>
          <Select value={formData.arrestedConvicted} onValueChange={(value) => setFormData({ ...formData, arrestedConvicted: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="False">No</SelectItem>
              <SelectItem value="True">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="refusedEntry">Have you ever been refused entry/deported by any country including India? *</Label>
          <Select value={formData.refusedEntry} onValueChange={(value) => setFormData({ ...formData, refusedEntry: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="False">No</SelectItem>
              <SelectItem value="True">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="humanTrafficking">Have you ever been engaged in Human trafficking/Drug trafficking/Child abuse/Crime against women/Economic offense/Financial fraud? *</Label>
          <Select value={formData.humanTrafficking} onValueChange={(value) => setFormData({ ...formData, humanTrafficking: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="False">No</SelectItem>
              <SelectItem value="True">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cyberCrime">Have you ever been engaged in Cyber crime/Terrorist activities/Sabotage/Espionage/Genocide/Political killing/other act of violence? *</Label>
          <Select value={formData.cyberCrime} onValueChange={(value) => setFormData({ ...formData, cyberCrime: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="False">No</SelectItem>
              <SelectItem value="True">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="terroristViews">Have you ever by any means or medium expressed views that justify or glorify terrorist violence or that may encourage others to terrorist acts or other serious criminal acts? *</Label>
          <Select value={formData.terroristViews} onValueChange={(value) => setFormData({ ...formData, terroristViews: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="False">No</SelectItem>
              <SelectItem value="True">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="asylumSought">Have you sought asylum (political or otherwise) in any country? *</Label>
          <Select value={formData.asylumSought} onValueChange={(value) => setFormData({ ...formData, asylumSought: value })} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="False">No</SelectItem>
              <SelectItem value="True">Yes</SelectItem>
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

export default Step11AdditionalQuestions;
