import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Press() {
  const { t } = useTranslation();
  const pressReleases = [
    { dateKey: 'r1Date', titleKey: 'r1Title', excerptKey: 'r1Excerpt', link: '#' },
    { dateKey: 'r2Date', titleKey: 'r2Title', excerptKey: 'r2Excerpt', link: '#' },
    { dateKey: 'r3Date', titleKey: 'r3Title', excerptKey: 'r3Excerpt', link: '#' },
    { dateKey: 'r4Date', titleKey: 'r4Title', excerptKey: 'r4Excerpt', link: '#' },
    { dateKey: 'r5Date', titleKey: 'r5Title', excerptKey: 'r5Excerpt', link: '#' },
    { dateKey: 'r6Date', titleKey: 'r6Title', excerptKey: 'r6Excerpt', link: '#' },
  ];

  const inTheNews = [
    { sourceKey: 'n1Source', titleKey: 'n1Title', dateKey: 'n1Date' },
    { sourceKey: 'n2Source', titleKey: 'n2Title', dateKey: 'n2Date' },
    { sourceKey: 'n3Source', titleKey: 'n3Title', dateKey: 'n3Date' },
    { sourceKey: 'n4Source', titleKey: 'n4Title', dateKey: 'n4Date' },
  ];

  const companyFacts = [
    { labelKey: 'factFounded', valueKey: 'factFoundedValue' },
    { labelKey: 'factHQ', valueKey: 'factHQValue' },
    { labelKey: 'factTeam', valueKey: 'factTeamValue' },
    { labelKey: 'factCountries', valueKey: 'factCountriesValue' },
    { labelKey: 'factApps', valueKey: 'factAppsValue' },
    { labelKey: 'factSuccess', valueKey: 'factSuccessValue' },
    { labelKey: 'factLanguages', valueKey: 'factLanguagesValue' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('pages.press.title')}</h1>
          <p className="text-xl text-blue-100">{t('pages.press.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Press Contact */}
        <section className="mb-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.press.pressContact')}</h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>{t('pages.press.mediaRelations')}:</strong> press@clearevisa.com</p>
            {/*<p><strong>Phone:</strong> +1 (555) 123-4567</p>*/}
            <p><strong>{t('pages.press.pressAddress')}</strong></p>
            <p className="mt-4">{t('pages.press.pressInquiries')}</p>
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.press.pressReleases')}</h2>
          <div className="space-y-6">
            {pressReleases.map((release, idx) => (
              <article key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-sm text-gray-500 mb-2">{t(`pages.press.${release.dateKey}`)}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(`pages.press.${release.titleKey}`)}</h3>
                <p className="text-gray-700 mb-4">{t(`pages.press.${release.excerptKey}`)}</p>
                <a href={release.link} className="text-blue-600 hover:text-blue-800 font-semibold">
                  {t('pages.press.readFullRelease')} →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* In The News */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.press.inTheNews')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inTheNews.map((article, idx) => (
              <article key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="text-sm text-blue-600 font-semibold mb-2">{t(`pages.press.${article.sourceKey}`)}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t(`pages.press.${article.titleKey}`)}</h3>
                <div className="text-sm text-gray-500">{t(`pages.press.${article.dateKey}`)}</div>
              </article>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.press.mediaKit')}</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700 mb-6">{t('pages.press.mediaKitDesc')}</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              {t('pages.press.downloadMediaKit')}
            </button>
          </div>
        </section>

        {/* Company Facts */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.press.companyFacts')}</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <ul className="space-y-3 text-gray-700">
              {companyFacts.map((fact) => (
                <li key={fact.labelKey}>• <strong>{t(`pages.press.${fact.labelKey}`)}:</strong> {t(`pages.press.${fact.valueKey}`)}</li>
              ))}
             {/* <li>•  <strong>Funding:</strong> Series A: $10M </li> */}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
