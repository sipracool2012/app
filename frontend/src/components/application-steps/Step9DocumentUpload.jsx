import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChevronLeft, Upload, FileText, X } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { getAuthHeaders } from '../../utils/auth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step9DocumentUpload = ({ data, onNext, onBack, onDataChange }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const applicationId = data?.applicationId || '';

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

  // Report local changes to parent so jumping away via stepper saves latest data
  useEffect(() => { onDataChange?.(formData); }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (!applicationId) {
      toast({
        title: 'Error',
        description: 'Application ID not assigned yet. Please go back and try again.',
        variant: 'destructive'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('forms.step9.fileTooLarge'),
        description: t('forms.step9.fileTooLargeDesc'),
        variant: 'destructive'
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t('forms.step9.invalidFileType'),
        description: t('forms.step9.invalidFileTypeDesc'),
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    const url = `${BACKEND_URL}/api/upload?application_id=${encodeURIComponent(applicationId)}&field_name=${encodeURIComponent(fieldName)}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
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
        [fieldName]: result.filename
      });

      toast({
        title: t('common.success'),
        description: t('forms.step9.uploadSuccess')
      });
    } catch (error) {
      toast({
        title: t('forms.step9.uploadFailed'),
        description: t('forms.step9.uploadError'),
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

    // Check required documents
    const missingDocs = [];
    if (!formData.passportDocument) missingDocs.push('Passport copy');
    if (!formData.photoDocument) missingDocs.push('Recent photograph');
    if (isBusinessVisa) {
      if (!formData.businessLetter) missingDocs.push('Indian firm invitation letter');
      if (!formData.businessCard) missingDocs.push('Business card');
    }
    if (isConferenceVisa) {
      if (!formData.organizerInvitation) missingDocs.push('Organizer invitation letter');
      if (!formData.meaPoliticalClearance) missingDocs.push('MEA political clearance');
      if (!formData.mhaEventClearance) missingDocs.push('MHA event clearance');
    }
    if (isMedicalVisa) {
      if (!formData.medicalInvitationLetter) missingDocs.push('Medical invitation letter');
    }
    if (isTransitVisa) {
      if (!formData.confirmedTravelTicket) missingDocs.push('Confirmed travel ticket');
      if (!formData.destinationVisaOrPassport) missingDocs.push('Destination visa / passport');
    }

    if (missingDocs.length > 0) {
      toast({
        title: 'Required documents missing',
        description: `Please upload: ${missingDocs.join(', ')}.`,
        variant: 'destructive'
      });
      return;
    }

    // Re-check that the arrival date is still at least 4 days from today (IST)
    if (data?.expectedArrivalDate) {
      const now = new Date();
      const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
      const istDate = new Date(istMs);
      istDate.setUTCDate(istDate.getUTCDate() + 4);
      const minArrival = istDate.toISOString().split('T')[0];
      if (data.expectedArrivalDate < minArrival) {
        toast({
          title: 'Expected arrival date is no longer valid',
          description: 'Your selected arrival date is too soon. Please go back to Step 1 and choose a new date at least 4 days from today (IST).',
          variant: 'destructive'
        });
        return;
      }
    }

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
            {t('forms.step9.clickToUpload')}
          </Label>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF (max 5MB)</p>
          <Input
            id={fieldName}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileUpload(e, fieldName)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText className="h-5 w-5 text-blue-600 shrink-0" />
            <span className="text-sm text-gray-700 truncate">{fileNames[fieldName]}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0"
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
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step9.title')}</h3>

      {applicationId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-blue-700 font-medium">Application ID:</span>
          <span className="text-sm font-bold text-blue-900 tracking-wide">{applicationId}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Documents for All */}
        <div className="md:col-span-2 border-b pb-2 mb-2">
          <h4 className="text-lg font-semibold text-gray-800">{t('forms.step9.requiredDocs')}</h4>
        </div>

        <DocumentUploadField
          fieldName="passportDocument"
          label={t('forms.step9.passportCopyLabel')}
          description={t('forms.step9.passportCopyHint')}
        />

        <DocumentUploadField
          fieldName="photoDocument"
          label={t('forms.step9.recentPhotoLabel')}
          description={t('forms.step9.recentPhotoHint')}
        />

        {/* Business Visa Specific Documents */}
        {isBusinessVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">{t('forms.step9.businessDocs')}</h4>
            </div>

            <DocumentUploadField
              fieldName="businessLetter"
              label={t('forms.step9.indianFirmInvitationLabel')}
              description={t('forms.step9.indianFirmInvitationHint')}
            />

            <DocumentUploadField
              fieldName="businessCard"
              label={t('forms.step9.businessCardLabel')}
              description={t('forms.step9.businessCardHint')}
            />
          </>
        )}

        {/* Conference Visa Specific Documents */}
        {isConferenceVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">{t('forms.step9.conferenceDocs')}</h4>
            </div>

            <DocumentUploadField
              fieldName="organizerInvitation"
              label={t('forms.step9.organizerInvitationLabel')}
              description={t('forms.step9.organizerInvitationHint')}
            />

            <DocumentUploadField
              fieldName="meaPoliticalClearance"
              label={t('forms.step9.meaClearanceLabel')}
              description={t('forms.step9.meaClearanceHint')}
            />

            <DocumentUploadField
              fieldName="mhaEventClearance"
              label={t('forms.step9.mhaClearanceLabel')}
              description={t('forms.step9.mhaClearanceHint')}
            />
          </>
        )}

        {/* Medical Visa Specific Documents */}
        {isMedicalVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">{t('forms.step9.medicalDocs')}</h4>
            </div>

            <DocumentUploadField
              fieldName="medicalInvitationLetter"
              label={t('forms.step9.medicalInvitationLabel')}
              description={t('forms.step9.medicalInvitationHint')}
            />

            <DocumentUploadField
              fieldName="medicalDocument4"
              label={t('forms.step9.additionalDocLabel')}
              description={t('forms.step9.additionalDocHint')}
            />
          </>
        )}

        {/* Transit Visa Specific Documents */}
        {isTransitVisa && (
          <>
            <div className="md:col-span-2 border-t border-b py-2 my-2">
              <h4 className="text-lg font-semibold text-gray-800">{t('forms.step9.transitDocs')}</h4>
            </div>

            <DocumentUploadField
              fieldName="confirmedTravelTicket"
              label={t('forms.step9.travelTicketLabel')}
              description={t('forms.step9.travelTicketHint')}
            />

            <DocumentUploadField
              fieldName="destinationVisaOrPassport"
              label={t('forms.step9.destVisaLabel')}
              description={t('forms.step9.destVisaHint')}
            />
          </>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={onBack} disabled={uploading}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('application.back')}
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={uploading}>
          {uploading ? t('forms.step9.uploading') : t('application.continue')}
        </Button>
      </div>
    </form>
  );
};

export default Step9DocumentUpload;
