import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChevronLeft, Upload, FileText, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step9DocumentUpload = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    passportDocument: data?.passportDocument || '',
    photoDocument: data?.photoDocument || '',
    // Business visa documents
    businessLetter: data?.businessLetter || '',
    businessCard: data?.businessCard || '',
    // Conference visa documents
    organizerInvitation: data?.organizerInvitation || '',
    meaPoliticalClearance: data?.meaPoliticalClearance || '',
    mhaEventClearance: data?.mhaEventClearance || '',
    // Medical visa documents
    medicalInvitationLetter: data?.medicalInvitationLetter || '',
    // Transit visa documents
    confirmedTravelTicket: data?.confirmedTravelTicket || '',
    destinationVisaOrPassport: data?.destinationVisaOrPassport || ''
  });

  const [fileNames, setFileNames] = useState({
    passportDocument: data?.passportDocument || '',
    photoDocument: data?.photoDocument || '',
    businessLetter: data?.businessLetter || '',
    businessCard: data?.businessCard || '',
    organizerInvitation: data?.organizerInvitation || '',
    meaPoliticalClearance: data?.meaPoliticalClearance || '',
    mhaEventClearance: data?.mhaEventClearance || '',
    medicalInvitationLetter: data?.medicalInvitationLetter || '',
    confirmedTravelTicket: data?.confirmedTravelTicket || '',
    destinationVisaOrPassport: data?.destinationVisaOrPassport || ''
  });

  // Determine visa type from previous step data
  const visaType = data?.visaService?.toLowerCase() || '';
  const isBusinessVisa = visaType.includes('business');
  const isConferenceVisa = visaType.includes('conference');
  const isMedicalVisa = visaType.includes('medical') && !visaType.includes('attendant');
  const isMedicalAttendantVisa = visaType.includes('attendant') || visaType.includes('medical attendant');
  const isTransitVisa = visaType.includes('transit');
  const isTouristVisa = visaType.includes('tourist');

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 5MB',
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Only JPG, PNG, and PDF files are allowed',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      setFormData({
        ...formData,
        [fieldName]: result.url
      });

      setFileNames({
        ...fileNames,
        [fieldName]: file.name
      });

      toast({
        title: 'Success',
        description: 'File uploaded successfully'
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: ''
    });
    setFileNames({
      ...fileNames,
      [fieldName]: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  const DocumentUploadField = ({ fieldName, label, required = true, description }) => (
    <div className="space-y-2">
      <Label htmlFor={fieldName}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      
      {!formData[fieldName] ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <Label 
            htmlFor={fieldName} 
            className="cursor-pointer text-blue-600 hover:text-blue-700"
          >
            Click to upload
          </Label>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF (max 5MB)</p>
          <Input
            id={fieldName}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileUpload(e, fieldName)}
            className="hidden"
            required={required}
          />
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">{fileNames[fieldName]}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeFile(fieldName)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Documents for All */}
        <div className="md:col-span-2 border-b pb-2 mb-2">
          <h4 className="text-lg font-semibold text-gray-800">Required Documents (All Applicants)</h4>
        </div>

        <DocumentUploadField
          fieldName="passportDocument"
          label="Passport Copy"
          description="First and last page of passport"
        />

        <DocumentUploadField
          fieldName="photoDocument"
          label="Recent Photograph"
          description="Passport size photo with white background"
        />

        {/* Business Visa Specific Documents */}
        {isBusinessVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">Business Visa Documents</h4>
            </div>

            <DocumentUploadField
              fieldName="businessLetter"
              label="Invitation Letter from Indian Firm"
              description="Official invitation letter"
            />

            <DocumentUploadField
              fieldName="businessCard"
              label="Business Card"
              description="Your business card"
            />
          </>
        )}

        {/* Conference Visa Specific Documents */}
        {isConferenceVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">Conference Visa Documents</h4>
            </div>

            <DocumentUploadField
              fieldName="organizerInvitation"
              label="Invitation from Organizer"
              description="Official invitation letter"
            />

            <DocumentUploadField
              fieldName="meaPoliticalClearance"
              label="Political Clearance from MEA"
              description="Ministry of External Affairs clearance"
            />

            <DocumentUploadField
              fieldName="mhaEventClearance"
              label="Event Clearance from MHA"
              description="Ministry of Home Affairs clearance"
            />
          </>
        )}

        {/* Medical Visa Specific Documents */}
        {isMedicalVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">Medical Visa Documents</h4>
            </div>

            <DocumentUploadField
              fieldName="medicalInvitationLetter"
              label="System Generated Medical Invitation Letter"
              description="Medical invitation in defined format"
            />

            <DocumentUploadField
              fieldName="medicalDocument4"
              label="Additional Document (Optional)"
              description="Any additional medical document"
              required={false}
            />
          </>
        )}

        {/* Transit Visa Specific Documents */}
        {isTransitVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">Transit Visa Documents</h4>
            </div>

            <DocumentUploadField
              fieldName="confirmedTravelTicket"
              label="Confirmed Travel Ticket"
              description="Ticket to India and onward journey"
            />

            <DocumentUploadField
              fieldName="destinationVisaOrPassport"
              label="Destination Visa or Passport"
              description="Visa/entry permit for destination or passport of destination country"
            />
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={uploading}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

export default Step9DocumentUpload;
