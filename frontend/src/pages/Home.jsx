import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight, Clock, Info, CheckCircle2 } from 'lucide-react';
import { FlagIcon } from '../components/ui/FlagIcon';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { partnerLogos, testimonials } from '../mock/mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [enabledCountries, setEnabledCountries] = useState([]);
  const [enabledPurposes, setEnabledPurposes] = useState([]);
  const [visaOptions, setVisaOptions] = useState([]);
  const [hasEvisaOptions, setHasEvisaOptions] = useState(true);
  const [countryName, setCountryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [feeDisplayMode, setFeeDisplayMode] = useState('full_breakdown');

  // Fetch utility settings on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/utility/settings`)
      .then(r => r.json())
      .then(d => setFeeDisplayMode(d.fee_display_mode ?? 'full_breakdown'))
      .catch(() => {});
  }, []);

  // Fetch enabled countries on mount
  useEffect(() => {
    const fetchEnabledCountries = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/countries/enabled`);
        const data = await response.json();
        setEnabledCountries(data);
        
        // Auto-select first country if available
        if (data.length > 0) {
          setSelectedCountry(data[0].code);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnabledCountries();
  }, []);

  // Fetch enabled purposes when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    
    const fetchPurposes = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/countries/${selectedCountry}/purposes`);
        const data = await response.json();
        setEnabledPurposes(data.purposes || []);
        
        // Auto-select first purpose if available
        if (data.purposes && data.purposes.length > 0) {
          setSelectedPurpose(data.purposes[0].value);
        } else {
          setSelectedPurpose('');
        }
      } catch (error) {
        console.error('Error fetching purposes:', error);
        setEnabledPurposes([]);
      }
    };
    
    fetchPurposes();
  }, [selectedCountry]);

  // Fetch visa options when country or purpose changes
  useEffect(() => {
    if (!selectedCountry) return;
    
    const fetchVisaOptions = async () => {
      setLoadingOptions(true);
      try {
        const url = selectedPurpose 
          ? `${BACKEND_URL}/api/countries/${selectedCountry}/visa-options?purpose=${selectedPurpose}`
          : `${BACKEND_URL}/api/countries/${selectedCountry}/visa-options`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        setVisaOptions(data.options || []);
        setHasEvisaOptions(data.has_evisa_options);
        setCountryName(data.country_name || '');
      } catch (error) {
        console.error('Error fetching visa options:', error);
        setVisaOptions([]);
        setHasEvisaOptions(false);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchVisaOptions();
  }, [selectedCountry, selectedPurpose]);

  const handleApply = (visaId) => {
    const passportCountry = enabledCountries.find(c => c.code === selectedCountry);
    const params = new URLSearchParams();
    if (selectedCountry) params.set('passport', selectedCountry);
    if (passportCountry?.name) params.set('passportName', passportCountry.name);
    navigate(`/visa/${visaId}?${params.toString()}`);
  };

  // Get selected country name
  const getSelectedCountryName = () => {
    const country = enabledCountries.find(c => c.code === selectedCountry);
    return country ? country.name : '';
  };

  // Get selected country demonym (falls back to name if not available)
  const getSelectedCountryDemonym = () => {
    const country = enabledCountries.find(c => c.code === selectedCountry);
    return (country && country.demonym) ? country.demonym : getSelectedCountryName();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side - Search */}
            <div className="space-y-8">
              {/* Country Selector */}
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Passport Country Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.yourPassport')}</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={loading}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loading ? t('home.loadingCountries') : t('home.selectCountry')} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {enabledCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <FlagIcon code={country.code} width={16} height={12} />
                              {country.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Fixed India Destination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.travelingTo')}</label>
                    <div className="w-full h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center gap-2 text-gray-700">
                      <FlagIcon code="IN" width={16} height={12} />
                      India
                    </div>
                  </div>
                </div>

                {/* Purpose Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.purposeOfTravel')}</label>
                  <Select 
                    value={selectedPurpose} 
                    onValueChange={setSelectedPurpose}
                    disabled={enabledPurposes.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={enabledPurposes.length === 0 ? t('home.noOptions') : t('home.selectPurpose')} />
                    </SelectTrigger>
                    <SelectContent>
                      {enabledPurposes.map((purpose) => (
                        <SelectItem key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  {t('home.searchVisa')}
                </Button>
              </div>

              {/* Dynamic Title */}
              {selectedCountry && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {hasEvisaOptions 
                      ? t('home.visaNeeded', { destination: 'India', passportCountry: getSelectedCountryName() })
                      : t('home.visaRequirements', { destination: 'India', passportCountry: getSelectedCountryName() })
                    }
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {t('home.visaOptionsCount', { count: visaOptions.length })}
                  </p>
                </div>
              )}

              {/* Loading State */}
              {loadingOptions && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}

              {/* Visa Cards or Embassy Fallback */}
              {!loadingOptions && (
                <div className="space-y-4">
                  {hasEvisaOptions && visaOptions.length > 0 ? (
                    <>
                      {/* eVisa Header */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">{t('home.electronicVisa')}</span>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      {/* Visa Option Cards */}
                      {visaOptions.map((visa) => {
                        const discount = parseFloat(visa.discount_amount) || 0;
                        const visaOurFee = parseFloat(visa.our_fee) || 0;
                        const displayedPrice =
                          feeDisplayMode === 'our_fee_only'
                            ? visaOurFee
                            : feeDisplayMode === 'with_discount'
                            ? Math.max(0, visaOurFee - discount)
                            : visa.price;
                        const priceLabel =
                          feeDisplayMode === 'our_fee_only'
                            ? 'Service fee'
                            : feeDisplayMode === 'with_discount' && discount > 0
                            ? 'After discount'
                            : null;
                        return (
                        <Card key={visa.id} className="border-2 hover:border-blue-500 transition-all cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{visa.name}</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>{t('home.entries')}: <span className="font-medium">{visa.entries}</span></p>
                                  <p>{t('home.stayFor')}: <span className="font-medium">{visa.stay_duration}</span></p>
                                  <p>{t('home.useWithin')}: <span className="font-medium">{visa.validity}</span></p>
                                  <p>{t('home.purpose')}: <span className="font-medium">{visa.purpose}</span></p>
                                </div>
                              </div>
                              <div className="text-right">
                                {feeDisplayMode === 'with_discount' && discount > 0 && (
                                  <p className="text-sm line-through text-gray-400">USD ${visaOurFee.toFixed(2)}</p>
                                )}
                                <p className="text-2xl font-bold text-gray-900">USD ${displayedPrice.toFixed(2)}</p>
                                {priceLabel && (
                                  <p className="text-xs text-gray-500">{priceLabel}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-blue-600 mb-4">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{t('home.approvedBy', { date: visa.approved_by })}</span>
                            </div>
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleApply(visa.id)}
                            >
                              {t('home.applyOnline')}
                            </Button>
                          </CardContent>
                        </Card>
                        );
                      })}
                    </>
                  ) : selectedCountry && !hasEvisaOptions ? (
                    <>
                      {/* Embassy Visa Fallback */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">{t('home.embassyVisa')}</span>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <Card className="border-2 bg-gray-50">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('home.visitorVisa')}</h3>
                          <p className="text-gray-600 mb-4">
                            {t('home.embassyVisaDesc')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {t('home.embassyVisaNote')}
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            {/* Right side - Image (sticky: floats alongside visa cards while scrolling) */}
            <div className="hidden lg:block sticky top-20">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=1000&fit=crop"
                alt="Taj Mahal India"
                className="rounded-lg shadow-2xl w-full object-cover"
                style={{ height: 'calc(100vh - 6rem)', maxHeight: '800px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos — temporarily hidden */}
      {/* <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-blue-600 font-medium mb-8">{t('home.trustedByBrands')}</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partnerLogos.map((logo) => (
              <img
                key={logo.name}
                src={logo.url}
                alt={logo.name}
                className="h-8 opacity-60 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Learn More Section — shown only for the 1-year Tourist eVisa when a country is selected */}
      {(() => {
        const oneYearTourist = selectedCountry && !loadingOptions && hasEvisaOptions
          ? visaOptions.find(v =>
              /1\s*year/i.test(v.validity) && /tourism/i.test(v.purpose)
            )
          : null;
        if (!oneYearTourist) return null;
        return (
          <section className="py-16 bg-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Section header */}
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
                {t('home.learnMoreTitle', { visaName: oneYearTourist.name, country: getSelectedCountryDemonym() })}
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-12 rounded-full"></div>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-14">
                {/* Left — narrative content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {t('home.learnMoreSubtitle', { country: getSelectedCountryDemonym() })}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{t('home.learnMorePara1')}</p>
                  <p className="text-gray-600 leading-relaxed">{t('home.learnMorePara2')}</p>
                  <p className="text-gray-600 leading-relaxed">{t('home.learnMorePara3')}</p>
                  <p className="text-gray-600 leading-relaxed">{t('home.learnMorePara4')}</p>
                </div>

                {/* Right — Quick Summary + requirements + CTA */}
                <div className="space-y-8">
                  {/* Quick Summary */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t('home.quickSummary')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">
                          {t('home.summaryPurpose', { visaName: oneYearTourist.name })}{' '}
                          <strong>{oneYearTourist.purpose}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">
                          {t('home.summaryStay', { visaName: oneYearTourist.name })}{' '}
                          <strong>{oneYearTourist.stay_duration}</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">
                          {t('home.summaryEmail', { visaName: oneYearTourist.name })}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">
                          {t('home.summarySubmit', { visaName: oneYearTourist.name })}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* What do I need to apply? */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">{t('home.whatDoINeedTitle')}</h4>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{t('home.requiredForPurchase')}</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{t('home.requirementAccommodation')}</span>
                      </li>
                    </ul>
                    <p className="text-sm font-semibold text-gray-700 mb-2">{t('home.requiredLater')}</p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{t('home.requirementPassport')}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{t('home.requirementHeadshot')}</span>
                      </li>
                    </ul>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                      onClick={() => handleApply(oneYearTourist.id)}
                    >
                      {t('home.applyNow')}
                    </Button>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="space-y-8 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {t('home.faq1Title', { visaName: oneYearTourist.name })}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('home.faq1Ans', { visaName: oneYearTourist.name })}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {t('home.faq2Title')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('home.faq2Ans', { stayDuration: oneYearTourist.stay_duration })}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {t('home.faq3Title', { visaName: oneYearTourist.name })}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t('home.faq3Ans', { validity: oneYearTourist.validity })}
                  </p>
                </div>
              </div>

            </div>
          </section>
        );
      })()}

      {/* How Clear eVisa Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">{t('home.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.step1Title')}</h3>
              <p className="text-gray-600">
                {t('home.step1Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.step2Title')}</h3>
              <p className="text-gray-600">
                {t('home.step2Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('home.step3Title')}</h3>
              <p className="text-gray-600">
                {t('home.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home.testimonialsTitle')}</h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>
              <span className="text-xl font-bold text-gray-900">4.7</span>
              <span className="text-gray-600">{t('home.trustpilotRating')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{testimonial.time}</span>
                  </div>
                  <p className="text-gray-700 mb-4">{testimonial.text}</p>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t('home.ctaTitle')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('home.ctaSubtitle')}
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => visaOptions.length > 0 && handleApply(visaOptions[0].id)}
          >
            {t('home.ctaButton')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
