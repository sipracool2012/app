import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('pages.about.title')}</h1>
          <p className="text-xl text-blue-100">{t('pages.about.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('pages.about.mission')}</h2>
          <p className="text-lg text-gray-700 mb-4">
            Clear eVisa Services is a specialist Indian eVisa consultancy. Our mission is to ensure every traveller has
            correctly verified documents and a complete, accurate documentation package before they reach the official
            submission portal — eliminating the errors that cause delays and rejections.
          </p>
          <p className="text-lg text-gray-700">
            We don't submit applications on your behalf. Instead, we meticulously review every document and piece of
            information against India's eVisa requirements and prepare proper documentation so that when you submit
            on India's official portal, everything is in order the first time.
          </p>
        </section>

        {/* Vision Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('pages.about.vision')}</h2>
          <p className="text-lg text-gray-700">
            To be India's most trusted eVisa consultancy — where every traveller, regardless of their nationality,
            receives expert document verification and preparation that gives them the best chance of a successful
            India eVisa approval. We believe that with the right guidance, no application should be rejected due
            to avoidable documentation errors.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.about.coreValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.transparency')}</h3>
              <p className="text-gray-700">
                We believe in clear communication. Our users always know what to expect, what information we need, 
                and how we use their data.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.excellence')}</h3>
              <p className="text-gray-700">
                We are committed to delivering the highest quality service, continuously improving our platform, 
                and exceeding user expectations.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.accessibility')}</h3>
              <p className="text-gray-700">
                We believe visa services should be available to everyone. Our platform is designed to be user-friendly, 
                affordable, and inclusive.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.security')}</h3>
              <p className="text-gray-700">
                Your data is precious. We implement world-class security measures to protect your personal and sensitive information.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.innovation')}</h3>
              <p className="text-gray-700">
                We continuously adopt cutting-edge technology and best practices to improve the visa application journey.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.customerFocus')}</h3>
              <p className="text-gray-700">
                Our users are at the heart of everything we do. We listen, learn, and evolve based on your feedback.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Clear eVisa by the Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <p className="text-gray-700">Clients Assisted</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">193+</div>
              <p className="text-gray-700">Passport Nationalities Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">India</div>
              <p className="text-gray-700">eVisa Specialist</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-700">Customer Support</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.about.ourTeam')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-blue-600 font-bold">SS</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sipra Satpathi</h3>
              <p className="text-blue-600 font-semibold mb-2">Sole Proprietor</p>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="mb-16 bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Information</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Legal Entity Name:</strong> Clear eVisa Services</p>
            <p><strong>Registered Address:</strong> B1109, Venkatesh Graffiti Glover, Manjari Rd, Hanuman Nagar, Keshav Nagar, Mundhwa, Pune, Maharashtra 411036, India</p>
            <p><strong>Contact:</strong> +91-9474475384</p>
            <p><strong>Email:</strong> admin@clearevisa.com</p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.about.whyChooseUs')}</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  ✓
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{t('pages.about.expertGuidance')}</h3>
                <p className="text-gray-700">{t('pages.about.expertGuidanceDesc')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  ✓
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{t('pages.about.securePlatform')}</h3>
                <p className="text-gray-700">{t('pages.about.securePlatformDesc')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  ✓
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{t('pages.about.support247')}</h3>
                <p className="text-gray-700">{t('pages.about.support247Desc')}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  ✓
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{t('pages.about.affordablePricing')}</h3>
                <p className="text-gray-700">{t('pages.about.affordablePricingDesc')}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
