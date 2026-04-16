import React from 'react';
import { useTranslation } from 'react-i18next';

export default function RefundPolicy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('pages.refund.title')}</h1>
        <p className="text-gray-600 mb-8">{t('pages.refund.lastUpdated', { date: 'April 7, 2026' })}</p>

        <div className="space-y-8 text-gray-700">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.refund.overviewTitle')}</h2>
            <p className="mb-4">{t('pages.refund.overviewP1')}</p>
            <p>{t('pages.refund.overviewP2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.refund.s1Title')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.refund.s1_1Title')}</h3>
            <p className="mb-4">{t('pages.refund.s1_1P1')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.refund.s1_2Title')}</h3>
            <p className="mb-4">{t('pages.refund.s1_2P1')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s1_2i1','s1_2i2','s1_2i3'].map(k => (
                <li key={k}>{t(`pages.refund.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.refund.s1_2Outro')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">{t('pages.refund.s1_3Title')}</h3>
            <p className="mb-4">{t('pages.refund.s1_3P1')}</p>
            <ul className="list-disc list-inside space-y-2">
              {['s1_3i1','s1_3i2','s1_3i3','s1_3i4'].map(k => (
                <li key={k}>{t(`pages.refund.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.refund.s2Title')}</h2>
            <p className="mb-4">{t('pages.refund.s2P1')}</p>
            <p>{t('pages.refund.s2P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.refund.s3Title')}</h2>
            <p>{t('pages.refund.s3P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.refund.s4Title')}</h2>
            <p className="mb-4">{t('pages.refund.s4P1')}</p>
            <p className="mb-4">{t('pages.refund.s4P2')}</p>
            <p>{t('pages.refund.s4P3')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.refund.s5Title')}</h2>
            <p className="mb-4">{t('pages.refund.s5P1')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s5i1','s5i2','s5i3','s5i4'].map(k => (
                <li key={k}>{t(`pages.refund.${k}`)}</li>
              ))}
            </ul>
            <p className="mb-4">{t('pages.refund.s5P2')}</p>
            <p>{t('pages.refund.s5P3')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.refund.s6Title')}</h2>
            <p className="mb-4">
              {t('pages.refund.s6P1')}{' '}
              <a href="/contact" className="text-blue-600 hover:underline">{t('pages.refund.s6ContactLink')}</a>{' '}
              page.
            </p>
            <p>
              {t('pages.refund.s6P2')}{' '}
              <a href="/terms" className="text-blue-600 hover:underline">{t('pages.refund.s6TermsLink')}</a>
              {' '}{t('pages.refund.s6And')}{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">{t('pages.refund.s6PrivacyLink')}</a>
              {' '}{t('pages.refund.s6P2End')}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
