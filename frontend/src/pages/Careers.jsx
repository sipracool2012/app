import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Careers() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = React.useState(null);

  const jobs = [
    { id: 1, titleKey: 'job1Title', deptKey: 'job1Dept', descKey: 'job1Desc' },
    { id: 2, titleKey: 'job2Title', deptKey: 'job2Dept', descKey: 'job2Desc' },
    { id: 3, titleKey: 'job3Title', deptKey: 'job3Dept', descKey: 'job3Desc' },
    { id: 4, titleKey: 'job4Title', deptKey: 'job4Dept', descKey: 'job4Desc' },
    { id: 5, titleKey: 'job5Title', deptKey: 'job5Dept', descKey: 'job5Desc' },
    { id: 6, titleKey: 'job6Title', deptKey: 'job6Dept', descKey: 'job6Desc' },
  ];

  const perks = [
    { titleKey: 'perk1Title', descKey: 'perk1Desc' },
    { titleKey: 'perk2Title', descKey: 'perk2Desc' },
    { titleKey: 'perk3Title', descKey: 'perk3Desc' },
    { titleKey: 'perk4Title', descKey: 'perk4Desc' },
    { titleKey: 'perk5Title', descKey: 'perk5Desc' },
    { titleKey: 'perk6Title', descKey: 'perk6Desc' },
  ];

  const cultureItems = [
    { labelKey: 'cultureTrust', descKey: 'cultureTrustDesc' },
    { labelKey: 'cultureCollab', descKey: 'cultureCollabDesc' },
    { labelKey: 'cultureLearning', descKey: 'cultureLearningDesc' },
    { labelKey: 'cultureDiversity', descKey: 'cultureDiversityDesc' },
    { labelKey: 'cultureBalance', descKey: 'cultureBalanceDesc' },
    { labelKey: 'cultureTransparency', descKey: 'cultureTransparencyDesc' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('pages.careers.title')}</h1>
          <p className="text-xl text-blue-100">{t('pages.careers.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Why Join Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.careers.whyJoin')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {perks.map((perk) => (
              <div key={perk.titleKey} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-3">{t(`pages.careers.${perk.titleKey}`)}</h3>
                <p className="text-gray-700">{t(`pages.careers.${perk.descKey}`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.careers.openPositions')}</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md">
                <button
                  onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{t(`pages.careers.${job.titleKey}`)}</h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-sm text-gray-600">{t(`pages.careers.${job.deptKey}`)}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{t('pages.careers.remote')}</span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {t('pages.careers.fullTime')}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl text-gray-400">
                      {expandedId === job.id ? '−' : '+'}
                    </span>
                  </div>
                </button>
                {expandedId === job.id && (
                  <div className="px-6 pb-4 border-t border-gray-200">
                    <p className="text-gray-700 mb-4">{t(`pages.careers.${job.descKey}`)}</p>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      {t('pages.careers.applyNow')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Culture Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('pages.careers.ourCulture')}</h2>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg text-gray-700 mb-4">{t('pages.careers.cultureIntro')}</p>
            <ul className="space-y-3 text-gray-700">
              {cultureItems.map((item) => (
                <li key={item.labelKey}>• <strong>{t(`pages.careers.${item.labelKey}`)}:</strong> {t(`pages.careers.${item.descKey}`)}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
