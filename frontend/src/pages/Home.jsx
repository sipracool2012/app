import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, ArrowRight, Clock, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { partnerLogos, testimonials } from '../mock/mockData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [enabledCountries, setEnabledCountries] = useState([]);
  const [enabledPurposes, setEnabledPurposes] = useState([]);
  const [visaOptions, setVisaOptions] = useState([]);
  const [hasEvisaOptions, setHasEvisaOptions] = useState(true);
  const [countryName, setCountryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);

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
    navigate(`/apply/${visaId}`);
  };

  // Get selected country name
  const getSelectedCountryName = () => {
    const country = enabledCountries.find(c => c.code === selectedCountry);
    return country ? country.name : '';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Search */}
            <div className="space-y-8">
              {/* Country Selector */}
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Passport Country Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your passport</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={loading}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={loading ? "Loading..." : "Select country"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {enabledCountries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Fixed India Destination */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Traveling to</label>
                    <div className="w-full h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center text-gray-700">
                      🇮🇳 India
                    </div>
                  </div>
                </div>

                {/* Purpose Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of travel</label>
                  <Select 
                    value={selectedPurpose} 
                    onValueChange={setSelectedPurpose}
                    disabled={enabledPurposes.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={enabledPurposes.length === 0 ? "No options available" : "Select purpose"} />
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
                  Search Visa
                </Button>
              </div>

              {/* Dynamic Title */}
              {selectedCountry && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {hasEvisaOptions 
                      ? `You need a visa for India if you have a ${getSelectedCountryName()} passport`
                      : `Visa requirements for ${getSelectedCountryName()} passport holders`
                    }
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Visa options for India ({visaOptions.length})
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
                        <span className="font-medium">Electronic visa (eVisa)</span>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      {/* Visa Option Cards */}
                      {visaOptions.map((visa) => (
                        <Card key={visa.id} className="border-2 hover:border-blue-500 transition-all cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{visa.name}</h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>Entries: <span className="font-medium">{visa.entries}</span></p>
                                  <p>Stay for: <span className="font-medium">{visa.stay_duration}</span></p>
                                  <p>Use within: <span className="font-medium">{visa.validity}</span></p>
                                  <p>Purpose: <span className="font-medium">{visa.purpose}</span></p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">USD ${visa.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-blue-600 mb-4">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>Approved by {visa.approved_by}</span>
                            </div>
                            <Button 
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleApply(visa.id)}
                            >
                              Apply online
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  ) : selectedCountry && !hasEvisaOptions ? (
                    <>
                      {/* Embassy Visa Fallback */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Embassy visa</span>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <Card className="border-2 bg-gray-50">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Visitor visa</h3>
                          <p className="text-gray-600 mb-4">
                            Travelers need a visa to visit India for Business or Tourism. Travelers must obtain a paper or embassy visa from an embassy, consulate or visa center before traveling.
                          </p>
                          <p className="text-sm text-gray-500">
                            This is not offered by Clear eVisa. Apply directly with the government.
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=1000&fit=crop"
                alt="Taj Mahal India"
                className="rounded-lg shadow-2xl w-full h-[700px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-blue-600 font-medium mb-8">Clear eVisa is trusted by the best travel brands</p>
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
      </section>

      {/* How Clear eVisa Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How Clear eVisa works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Find the visa you need</h3>
              <p className="text-gray-600">
                Government visa requirements depend on your destination and passport. We'll help you find what you need before you go.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit your application</h3>
              <p className="text-gray-600">
                Our easy-to-use forms guide you through the process. Then we review your application before it's submitted.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Check your inbox</h3>
              <p className="text-gray-600">
                Once you're approved, you'll get an email with your eVisa and all the instructions you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join over 1M+ customers who trust Clear eVisa with their visas</h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>
              <span className="text-xl font-bold text-gray-900">4.7</span>
              <span className="text-gray-600">out of 5 based on 5,006 reviews on Trustpilot</span>
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
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get your visa?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your application today and travel with confidence
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => visaOptions.length > 0 && handleApply(visaOptions[0].id)}
          >
            Get visa now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
