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
            We are dedicated to revolutionizing the visa application process by providing a seamless, user-friendly platform 
            that simplifies international travel. Our mission is to remove barriers and complexities in visa applications, 
            making it easier for people around the world to pursue their dreams.
          </p>
          <p className="text-lg text-gray-700">
            By combining technology, expertise, and a commitment to excellence, we empower individuals and families to 
            navigate the visa application process with confidence and clarity.
          </p>
        </section>

        {/* Vision Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('pages.about.vision')}</h2>
          <p className="text-lg text-gray-700">
            To create a world where visa applications are no longer a burden, but a straightforward step toward achieving 
            your goals. We envision a future where technology and human expertise work together to make international mobility 
            accessible to everyone.
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('pages.about.byTheNumbers')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <p className="text-gray-700">{t('pages.about.applicationsProcessed')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <p className="text-gray-700">{t('pages.about.countriesSupported')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <p className="text-gray-700">{t('pages.about.successRate')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-700">{t('pages.about.customerSupport')}</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.about.ourTeam')}</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our team consists of experienced immigration professionals, software engineers, designers, and customer support specialists 
            working together to provide you with the best visa application experience possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">John Smith</h3>
              <p className="text-blue-600 font-semibold mb-2">Founder & CEO</p>
              <p className="text-gray-700 text-sm">20+ years in immigration services</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-blue-600 font-semibold mb-2">Chief Technology Officer</p>
              <p className="text-gray-700 text-sm">Fintech & SaaS technology expert</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-blue-600 font-semibold mb-2">Head of Operations</p>
              <p className="text-gray-700 text-sm">Global operations and compliance</p>
            </div>
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
