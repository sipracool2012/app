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
          <p className="text-lg text-gray-700 mb-4">{t('pages.about.missionText1')}</p>
          <p className="text-lg text-gray-700">{t('pages.about.missionText2')}</p>
        </section>

        {/* Vision Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('pages.about.vision')}</h2>
          <p className="text-lg text-gray-700">{t('pages.about.visionText')}</p>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.about.coreValues')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.transparency')}</h3>
              <p className="text-gray-700">{t('pages.about.transparencyDesc')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.excellence')}</h3>
              <p className="text-gray-700">{t('pages.about.excellenceDesc')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.accessibility')}</h3>
              <p className="text-gray-700">{t('pages.about.accessibilityDesc')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.security')}</h3>
              <p className="text-gray-700">{t('pages.about.securityDesc')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.innovation')}</h3>
              <p className="text-gray-700">{t('pages.about.innovationDesc')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{t('pages.about.customerFocus')}</h3>
              <p className="text-gray-700">{t('pages.about.customerFocusDesc')}</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('pages.about.byTheNumbers')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('pages.about.stat1Value')}</div>
              <p className="text-gray-700">{t('pages.about.stat1Label')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('pages.about.stat2Value')}</div>
              <p className="text-gray-700">{t('pages.about.stat2Label')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('pages.about.stat3Value')}</div>
              <p className="text-gray-700">{t('pages.about.stat3Label')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('pages.about.stat4Value')}</div>
              <p className="text-gray-700">{t('pages.about.stat4Label')}</p>
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
              <p className="text-blue-600 font-semibold mb-2">{t('pages.about.teamMemberRole')}</p>
            </div>
          </div>
        </section>

        {/* Legal Information */}
        <section className="mb-16 bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.about.legalTitle')}</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>{t('pages.about.legalEntityLabel')}:</strong> {t('pages.about.legalEntityValue')}</p>
            <p><strong>{t('pages.about.legalAddressLabel')}:</strong> {t('pages.about.legalAddressValue')}</p>
            <p><strong>{t('pages.about.legalContactLabel')}:</strong> +91-9474475384</p>
            <p><strong>{t('pages.about.legalEmailLabel')}:</strong> admin@clearevisa.com</p>
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
