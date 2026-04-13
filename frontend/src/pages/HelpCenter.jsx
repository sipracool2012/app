import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function HelpCenter() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', nameKey: 'catGettingStarted' },
    { id: 'application', nameKey: 'catApplication' },
    { id: 'documents', nameKey: 'catDocuments' },
    { id: 'payment', nameKey: 'catPayment' },
    { id: 'tracking', nameKey: 'catTracking' },
    { id: 'technical', nameKey: 'catTechnical' }
  ];

  const articles = {
    'getting-started': [
      { id: 1, questionKey: 'q1', answerKey: 'a1' },
      { id: 2, questionKey: 'q2', answerKey: 'a2' },
      { id: 3, questionKey: 'q3', answerKey: 'a3' },
    ],
    'application': [
      { id: 4, questionKey: 'q4', answerKey: 'a4' },
      { id: 5, questionKey: 'q5', answerKey: 'a5' },
      { id: 6, questionKey: 'q6', answerKey: 'a6' },
    ],
    'documents': [
      { id: 7, questionKey: 'q7', answerKey: 'a7' },
      { id: 8, questionKey: 'q8', answerKey: 'a8' },
      { id: 9, questionKey: 'q9', answerKey: 'a9' },
    ],
    'payment': [
      { id: 10, questionKey: 'q10', answerKey: 'a10' },
      { id: 11, questionKey: 'q11', answerKey: 'a11' },
      { id: 12, questionKey: 'q12', answerKey: 'a12' },
    ],
    'tracking': [
      { id: 13, questionKey: 'q13', answerKey: 'a13' },
      { id: 14, questionKey: 'q14', answerKey: 'a14' },
      { id: 15, questionKey: 'q15', answerKey: 'a15' },
    ],
    'technical': [
      { id: 16, questionKey: 'q16', answerKey: 'a16' },
      { id: 17, questionKey: 'q17', answerKey: 'a17' },
      { id: 18, questionKey: 'q18', answerKey: 'a18' },
    ]
  };

  const currentArticles = articles[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('pages.helpCenter.title')}</h1>
          <p className="text-xl text-blue-100">{t('pages.helpCenter.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Search Bar */}
        <div className="mb-12">
          <input
            type="text"
            placeholder={t('pages.helpCenter.searchPlaceholder')}
            className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-lg transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {t(`pages.helpCenter.${cat.nameKey}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-4 mb-16">
          {currentArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md">
              <button
                onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
              >
                <h3 className="text-lg font-semibold text-gray-900">{t(`pages.helpCenter.${article.questionKey}`)}</h3>
                <span className="text-2xl text-gray-400">
                  {expandedId === article.id ? '−' : '+'}
                </span>
              </button>
              {expandedId === article.id && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  <p className="text-gray-700">{t(`pages.helpCenter.${article.answerKey}`)}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <section className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.helpCenter.didntFind')}</h2>
          <p className="text-gray-700 mb-6">{t('pages.helpCenter.contactSupportDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
           {/*} <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Live Chat
            </button>*/}
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              {t('pages.helpCenter.emailSupport')}
            </button>
          </div>
          {/*<p className="mt-6 text-sm text-gray-600">
            📞 Phone: +1 (555) 123-4567 | Available 24/7
          </p>*/}
        </section>
      </div>
    </div>
  );
}
