import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ChevronLeft, Upload, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const Step12DocumentUpload = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    passport: data?.passport || null,
    photo: data?.photo || null
  });

  const [passportPreview, setPassportPreview] = useState(data?.passportPreview || null);
  const [photoPreview, setPhotoPreview] = useState(data?.photoPreview || null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'File size must be less than 5MB',
          variant: 'destructive'
        });
        return;
      }

      // Mock: In real app, this would upload to S3
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'passport') {
          setFormData({ ...formData, passport: file });
          setPassportPreview(reader.result);
        } else {
          setFormData({ ...formData, photo: file });
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type) => {
    if (type === 'passport') {
      setFormData({ ...formData, passport: null });
      setPassportPreview(null);
    } else {
      setFormData({ ...formData, photo: null });
      setPhotoPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.passport || !formData.photo) {
      toast({
        title: 'Error',
        description: 'Please upload both passport and photo',
        variant: 'destructive'
      });
      return;
    }

    onNext({ ...formData, passportPreview, photoPreview });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h3>
      
      <div className="space-y-6">
        {/* Passport Upload */}
        <div className="space-y-2">
          <Label htmlFor="passport">Passport (Required) *</Label>
          <p className="text-sm text-gray-500">Upload a clear scan or photo of your passport bio page. Max size: 5MB</p>
          
          {!passportPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <Input
                id="passport"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileChange(e, 'passport')}
                className="hidden"
              />
              <Label htmlFor="passport" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                <span className="text-gray-600"> or drag and drop</span>
              </Label>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Passport uploaded</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('passport')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {passportPreview.startsWith('data:image') && (
                <img src={passportPreview} alt="Passport preview" className="max-h-48 rounded" />
              )}
            </div>
          )}
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <Label htmlFor="photo">Face Photo / Selfie (Required) *</Label>
          <p className="text-sm text-gray-500">Upload a recent passport-style photo or selfie. Max size: 5MB</p>
          
          {!photoPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
                className="hidden"
              />
              <Label htmlFor="photo" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                <span className="text-gray-600"> or drag and drop</span>
              </Label>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Photo uploaded</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile('photo')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <img src={photoPreview} alt="Photo preview" className="max-h-48 rounded" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> All documents will be securely stored and used only for visa processing purposes.
        </p>
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

export default Step12DocumentUpload;
