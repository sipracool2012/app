import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { visaOptions, countries, destinations, partnerLogos, testimonials } from '../mock/mockData';

const Home = () => {
  const navigate = useNavigate();
  const [fromCountry, setFromCountry] = useState('US');
  const [toCountry, setToCountry] = useState('IN');
  const [purpose, setPurpose] = useState('Tourism');

  const handleApply = (visaId) => {
    navigate(`/apply/${visaId}`);
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <Select value={fromCountry} onValueChange={setFromCountry}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <Select value={toCountry} onValueChange={setToCountry}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tourism">Tourism</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  Search Visa
                </Button>
              </div>

              {/* Info text */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  You need a visa for India if you have a United States passport
                </h1>
                <p className="text-gray-600 text-lg">
                  Visa options for India ({visaOptions.length})
                </p>
              </div>

              {/* Visa Cards */}
              <div className="space-y-4">
                {visaOptions.map((visa) => (
                  <Card key={visa.id} className="border-2 hover:border-blue-500 transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{visa.name}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>Entries: <span className="font-medium">{visa.entries}</span></p>
                            <p>Stay for: <span className="font-medium">{visa.stayDuration}</span></p>
                            <p>Use within: <span className="font-medium">{visa.validity}</span></p>
                            <p>Purpose: <span className="font-medium">{visa.purpose}</span></p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">USD ${visa.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-blue-600 mb-4">
                        <Check className="w-4 h-4 mr-1" />
                        <span>Approved by {visa.approvedBy}</span>
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
              </div>
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
            onClick={() => handleApply(visaOptions[0].id)}
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
