import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    { id: 1, catKey: 'cat1', qKey: 'q1', aKey: 'a1' },
    { id: 2, catKey: 'cat1', qKey: 'q2', aKey: 'a2' },
    { id: 3, catKey: 'cat2', qKey: 'q3', aKey: 'a3' },
    { id: 4, catKey: 'cat2', qKey: 'q4', aKey: 'a4' },
    { id: 5, catKey: 'cat3', qKey: 'q5', aKey: 'a5' },
    { id: 6, catKey: 'cat3', qKey: 'q6', aKey: 'a6' },
    { id: 7, catKey: 'cat4', qKey: 'q7', aKey: 'a7' },
    { id: 8, catKey: 'cat4', qKey: 'q8', aKey: 'a8' },
    { id: 9, catKey: 'cat5', qKey: 'q9', aKey: 'a9' },
    { id: 10, catKey: 'cat5', qKey: 'q10', aKey: 'a10' },
    { id: 11, catKey: 'cat6', qKey: 'q11', aKey: 'a11' },
    { id: 12, catKey: 'cat6', qKey: 'q12', aKey: 'a12' },
    { id: 13, catKey: 'cat7', qKey: 'q13', aKey: 'a13' },
    { id: 14, catKey: 'cat8', qKey: 'q14', aKey: 'a14' },
    { id: 15, catKey: 'cat8', qKey: 'q15', aKey: 'a15' },
    { id: 16, catKey: 'cat9', qKey: 'q16', aKey: 'a16' },
    { id: 17, catKey: 'cat9', qKey: 'q17', aKey: 'a17' },
    { id: 18, catKey: 'cat10', qKey: 'q18', aKey: 'a18' },
  ];

  const categoryKeys = ['cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6', 'cat7', 'cat8', 'cat9', 'cat10'];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('pages.faq.title')}</h1>
          <p className="text-xl text-blue-100">{t('pages.faq.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Categories Navigation */}
        <div className="mb-12 flex flex-wrap gap-2">
          {categoryKeys.map((catKey) => (
            <button
              key={catKey}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors font-semibold"
            >
              {t(`pages.faq.${catKey}`)}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleExpand(faq.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="text-sm text-blue-600 font-semibold mb-1">{t(`pages.faq.${faq.catKey}`)}</div>
                  <h3 className="text-lg font-semibold text-gray-900 text-left">{t(`pages.faq.${faq.qKey}`)}</h3>
                </div>
                <span className="ml-4 mt-1 text-2xl text-gray-400 flex-shrink-0">
                  {expandedId === faq.id ? '−' : '+'}
                </span>
              </button>
              {expandedId === faq.id && (
                <div className="px-6 pb-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">{t(`pages.faq.${faq.aKey}`)}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <section className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.faq.stillHaveQuestions')}</h2>
          <p className="text-gray-700 mb-6">{t('pages.faq.cantFind')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/help" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              {t('pages.faq.visitHelpCenter')}
            </a>
            <a href="/contact" className="bg-white text-blue-600 px-6 py-2 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-semibold">
              {t('pages.faq.contactUs')}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
