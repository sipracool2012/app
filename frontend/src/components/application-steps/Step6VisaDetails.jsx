import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PhoneInput } from '../ui/phone-input';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Step6VisaDetails = ({ data, onNext, onBack }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [phoneCodes, setPhoneCodes] = useState([]);

  const [formData, setFormData] = useState({
    placesToVisit: data?.placesToVisit || '',
    placesToVisitLine2: data?.placesToVisitLine2 || '',
    hotelBooked: data?.hotelBooked || 'No',
    // Previous Visit fields
    visitedIndiaBefore: data?.visitedIndiaBefore || 'No',
    previousAddress: data?.previousAddress || '',
    citiesPreviouslyVisited: data?.citiesPreviouslyVisited || '',
    lastIndianVisaNo: data?.lastIndianVisaNo || '',
    oldVisaType: data?.oldVisaType || '',
    oldVisaIssuePlace: data?.oldVisaIssuePlace || '',
    oldVisaIssueDate: data?.oldVisaIssueDate || '',
    // Other Info fields
    countriesVisitedLast10Years: data?.countriesVisitedLast10Years || '',
    visitedSAARCCountries: data?.visitedSAARCCountries || 'No',
    // Business Visa fields
    companyName: data?.companyName || '',
    companyAddress: data?.companyAddress || '',
    companyPhoneCountryCode: data?.companyPhoneCountryCode || '+1',
    companyPhoneNumber: data?.companyPhoneNumber || '',
    companyWebsite: data?.companyWebsite || '',
    indianFirmName: data?.indianFirmName || '',
    indianFirmAddress: data?.indianFirmAddress || '',
    indianFirmPhoneCountryCode: data?.indianFirmPhoneCountryCode || '+91',
    indianFirmPhoneNumber: data?.indianFirmPhoneNumber || '',
    indianFirmWebsite: data?.indianFirmWebsite || '',
    // Conference Visa fields
    conferenceName: data?.conferenceName || '',
    conferenceStartDate: data?.conferenceStartDate || '',
    conferenceEndDate: data?.conferenceEndDate || '',
    conferenceAddress: data?.conferenceAddress || '',
    organizerName: data?.organizerName || '',
    organizerAddress: data?.organizerAddress || '',
    organizerPhoneCountryCode: data?.organizerPhoneCountryCode || '+91',
    organizerPhoneNumber: data?.organizerPhoneNumber || '',
    organizerEmail: data?.organizerEmail || ''
  });

  React.useEffect(() => {
    fetchPhoneCodes();
  }, []);

  const fetchPhoneCodes = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/constants/phone-codes`);
      const data = await response.json();
      setPhoneCodes(data.phone_codes || []);
    } catch (error) {
      console.error('Failed to fetch phone codes:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(formData);
  };

  // Determine visa type from previous step data (passed through data)
  const visaType = data?.visaService?.toLowerCase() || '';
  const isBusinessVisa = visaType.includes('business');
  const isConferenceVisa = visaType.includes('conference');
  const showPreviousVisit = formData.visitedIndiaBefore === 'Yes';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('forms.step6.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Places to Visit */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="placesToVisit">
            {t('forms.step6.placesToVisit')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="placesToVisit"
            value={formData.placesToVisit}
            onChange={(e) => setFormData({ ...formData, placesToVisit: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="placesToVisitLine2">
            {t('forms.step6.placesToVisitLine2')}
          </Label>
          <Input
            id="placesToVisitLine2"
            value={formData.placesToVisitLine2}
            onChange={(e) => setFormData({ ...formData, placesToVisitLine2: e.target.value })}
          />
        </div>

        {/* Hotel Booked */}
        <div className="space-y-2">
          <Label htmlFor="hotelBooked">
            {t('forms.step6.hotelBooked')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.hotelBooked} 
            onValueChange={(value) => setFormData({ ...formData, hotelBooked: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">{t('forms.no')}</SelectItem>
              <SelectItem value="Yes">{t('forms.yes')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Previous Visit Section */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.step6.previousVisit')}</h4>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visitedIndiaBefore">
            {t('forms.step6.visitedIndiaBefore')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.visitedIndiaBefore} 
            onValueChange={(value) => setFormData({ ...formData, visitedIndiaBefore: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">{t('forms.no')}</SelectItem>
              <SelectItem value="Yes">{t('forms.yes')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showPreviousVisit && (
          <>
            <div className="space-y-2">
              <Label htmlFor="previousAddress">
                Previous Address
              </Label>
              <Input
                id="previousAddress"
                value={formData.previousAddress}
                onChange={(e) => setFormData({ ...formData, previousAddress: e.target.value })}
                placeholder="NA if not remember"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="citiesPreviouslyVisited">
                {t('forms.step6.citiesPreviouslyVisited')}
              </Label>
              <Input
                id="citiesPreviouslyVisited"
                value={formData.citiesPreviouslyVisited}
                onChange={(e) => setFormData({ ...formData, citiesPreviouslyVisited: e.target.value })}
                placeholder="NA if not remember"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastIndianVisaNo">
                Last Indian Visa No/Currently valid Indian Visa No
              </Label>
              <Input
                id="lastIndianVisaNo"
                value={formData.lastIndianVisaNo}
                onChange={(e) => setFormData({ ...formData, lastIndianVisaNo: e.target.value })}
                placeholder="NA if not remember"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldVisaType">
                Old Visa Type
              </Label>
              <Select 
                value={formData.oldVisaType} 
                onValueChange={(value) => setFormData({ ...formData, oldVisaType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select old visa type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ayush Visa">{t('forms.step6.ayushVisa')}</SelectItem>
                  <SelectItem value="Business Visa">{t('forms.step6.businessVisa')}</SelectItem>
                  <SelectItem value="Conference Visa">{t('forms.step6.conferenceVisa')}</SelectItem>
                  <SelectItem value="Diplomatic Visa">{t('forms.step6.diplomaticVisa')}</SelectItem>
                  <SelectItem value="Double Entry">{t('forms.step6.doubleEntry')}</SelectItem>
                  <SelectItem value="Employment Visa">{t('forms.step6.employmentVisa')}</SelectItem>
                  <SelectItem value="Entry Visa">{t('forms.step6.entryVisa')}</SelectItem>
                  <SelectItem value="e-Visa">{t('forms.step6.eVisa')}</SelectItem>
                  <SelectItem value="Film Visa">{t('forms.step6.filmVisa')}</SelectItem>
                  <SelectItem value="Journalist Visa">{t('forms.step6.journalistVisa')}</SelectItem>
                  <SelectItem value="Medical Visa">{t('forms.step6.medicalVisa')}</SelectItem>
                  <SelectItem value="Missionary Visa">{t('forms.step6.missionaryVisa')}</SelectItem>
                  <SelectItem value="Mountaineering Visa">{t('forms.step6.mountaineeringVisa')}</SelectItem>
                  <SelectItem value="Official Visa">{t('forms.step6.officialVisa')}</SelectItem>
                  <SelectItem value="Pilgrimes Visa">{t('forms.step6.pilgrimVisa')}</SelectItem>
                  <SelectItem value="Student Visa">{t('forms.step6.studentVisa')}</SelectItem>
                  <SelectItem value="Tourist Visa">{t('forms.step6.touristVisa')}</SelectItem>
                  <SelectItem value="Transit Visa">{t('forms.step6.transitVisa')}</SelectItem>
                  <SelectItem value="UN Diplomat">{t('forms.step6.unDiplomat')}</SelectItem>
                  <SelectItem value="UN Official">{t('forms.step6.unOfficial')}</SelectItem>
                  <SelectItem value="Visit Visa">{t('forms.step6.visitVisa')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldVisaIssuePlace">
                Old Visa Issue Place
              </Label>
              <Input
                id="oldVisaIssuePlace"
                value={formData.oldVisaIssuePlace}
                onChange={(e) => setFormData({ ...formData, oldVisaIssuePlace: e.target.value })}
                placeholder="online if not remember"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oldVisaIssueDate">
                Old Visa Issue Date
              </Label>
              <Input
                id="oldVisaIssueDate"
                type="date"
                value={formData.oldVisaIssueDate}
                onChange={(e) => setFormData({ ...formData, oldVisaIssueDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </>
        )}

        {/* Other Information Section */}
        <div className="md:col-span-2 border-t pt-4 mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.step6.otherInfo')}</h4>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="countriesVisitedLast10Years">
            Countries Visited in Last 10 years (Optional)
          </Label>
          <Input
            id="countriesVisitedLast10Years"
            value={formData.countriesVisitedLast10Years}
            onChange={(e) => setFormData({ ...formData, countriesVisitedLast10Years: e.target.value })}
            placeholder="List countries separated by commas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visitedSAARCCountries">
            Have you visited SAARC countries? <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.visitedSAARCCountries} 
            onValueChange={(value) => setFormData({ ...formData, visitedSAARCCountries: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">{t('forms.no')}</SelectItem>
              <SelectItem value="Yes">{t('forms.yes')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Business Visa Specific Fields */}
        {isBusinessVisa && (
          <>
            <div className="md:col-span-2 border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.step6.applicantCompanyDetails')}</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required={isBusinessVisa}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyAddress"
                value={formData.companyAddress}
                onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                required={isBusinessVisa}
              />
            </div>

            <div className="md:col-span-2">
              <PhoneInput
                label={t('forms.step6.phoneNo')}
                countryCode={formData.companyPhoneCountryCode}
                phoneNumber={formData.companyPhoneNumber}
                onCountryCodeChange={(value) => setFormData({ ...formData, companyPhoneCountryCode: value })}
                onPhoneNumberChange={(value) => setFormData({ ...formData, companyPhoneNumber: value })}
                phoneCodes={phoneCodes}
                required={isBusinessVisa}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyWebsite">
                Website
              </Label>
              <Input
                id="companyWebsite"
                type="url"
                value={formData.companyWebsite}
                onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                placeholder="https://"
              />
            </div>

            <div className="md:col-span-2 border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.step6.indianFirmDetails')}</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indianFirmName">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indianFirmName"
                value={formData.indianFirmName}
                onChange={(e) => setFormData({ ...formData, indianFirmName: e.target.value })}
                required={isBusinessVisa}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="indianFirmAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="indianFirmAddress"
                value={formData.indianFirmAddress}
                onChange={(e) => setFormData({ ...formData, indianFirmAddress: e.target.value })}
                required={isBusinessVisa}
              />
            </div>

            <div className="md:col-span-2">
              <PhoneInput
                label={t('forms.step6.phoneNo')}
                countryCode={formData.indianFirmPhoneCountryCode}
                phoneNumber={formData.indianFirmPhoneNumber}
                onCountryCodeChange={(value) => setFormData({ ...formData, indianFirmPhoneCountryCode: value })}
                onPhoneNumberChange={(value) => setFormData({ ...formData, indianFirmPhoneNumber: value })}
                phoneCodes={phoneCodes}
                required={isBusinessVisa}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="indianFirmWebsite">
                Website
              </Label>
              <Input
                id="indianFirmWebsite"
                type="url"
                value={formData.indianFirmWebsite}
                onChange={(e) => setFormData({ ...formData, indianFirmWebsite: e.target.value })}
                placeholder="https://"
              />
            </div>
          </>
        )}

        {/* Conference Visa Specific Fields */}
        {isConferenceVisa && (
          <>
            <div className="md:col-span-2 border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.step6.conferenceDetails')}</h4>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="conferenceName">
                Name/subject of conference <span className="text-red-500">*</span>
              </Label>
              <Input
                id="conferenceName"
                value={formData.conferenceName}
                onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })}
                required={isConferenceVisa}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conferenceStartDate">
                Start date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="conferenceStartDate"
                type="date"
                value={formData.conferenceStartDate}
                onChange={(e) => setFormData({ ...formData, conferenceStartDate: e.target.value })}
                required={isConferenceVisa}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conferenceEndDate">
                End date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="conferenceEndDate"
                type="date"
                value={formData.conferenceEndDate}
                onChange={(e) => setFormData({ ...formData, conferenceEndDate: e.target.value })}
                min={formData.conferenceStartDate}
                required={isConferenceVisa}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="conferenceAddress">
                Full address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="conferenceAddress"
                value={formData.conferenceAddress}
                onChange={(e) => setFormData({ ...formData, conferenceAddress: e.target.value })}
                required={isConferenceVisa}
              />
            </div>

            <div className="md:col-span-2 border-t pt-4 mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">{t('forms.step6.organizerDetails')}</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizerName">
                Name of organizer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organizerName"
                value={formData.organizerName}
                onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                required={isConferenceVisa}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="organizerAddress">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organizerAddress"
                value={formData.organizerAddress}
                onChange={(e) => setFormData({ ...formData, organizerAddress: e.target.value })}
                required={isConferenceVisa}
              />
            </div>

            <div className="md:col-span-2">
              <PhoneInput
                label={t('forms.step6.phoneNo')}
                countryCode={formData.organizerPhoneCountryCode}
                phoneNumber={formData.organizerPhoneNumber}
                onCountryCodeChange={(value) => setFormData({ ...formData, organizerPhoneCountryCode: value })}
                onPhoneNumberChange={(value) => setFormData({ ...formData, organizerPhoneNumber: value })}
                phoneCodes={phoneCodes}
                required={isConferenceVisa}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizerEmail">
                Email id <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organizerEmail"
                type="email"
                value={formData.organizerEmail}
                onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                required={isConferenceVisa}
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('application.back')}
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          {t('application.continue')}
        </Button>
      </div>
    </form>
  );
};

export default Step6VisaDetails;
