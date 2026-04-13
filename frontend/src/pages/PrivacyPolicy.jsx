import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('pages.privacy.title')}</h1>
        <p className="text-gray-600 mb-8">{t('pages.privacy.lastUpdated', { date: 'March 20, 2026' })}</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s1Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s1P1')}</p>
            <p>{t('pages.privacy.s1P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s2Title')}</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.privacy.s2_1Title')}</h3>
            <p className="mb-4">{t('pages.privacy.s2_1Intro')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s2_1i1','s2_1i2','s2_1i3','s2_1i4','s2_1i5','s2_1i6','s2_1i7','s2_1i8','s2_1i9'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.privacy.s2_2Title')}</h3>
            <p className="mb-4">{t('pages.privacy.s2_2Intro')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s2_2i1','s2_2i2','s2_2i3','s2_2i4'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s3Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s3Intro')}</p>
            <ul className="list-disc list-inside space-y-2">
              {['s3i1','s3i2','s3i3','s3i4','s3i5','s3i6','s3i7','s3i8','s3i9'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s4Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s4Intro')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s4i1','s4i2','s4i3','s4i4','s4i5'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.privacy.s4Outro')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s5Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s5Intro')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s5i1','s5i2','s5i3','s5i4','s5i5'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.privacy.s5Outro')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s6Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s6P1')}</p>
            <p>{t('pages.privacy.s6P2')}</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              {['s6i1','s6i2','s6i3'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s7Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s7Intro')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s7i1','s7i2','s7i3'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.privacy.s7Outro')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s8Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s8Intro')}</p>
            <ul className="list-disc list-inside space-y-2">
              {['s8i1','s8i2','s8i3','s8i4','s8i5','s8i6'].map(k => (
                <li key={k}>{t(`pages.privacy.${k}`)}</li>
              ))}
            </ul>
            <p className="mt-4">{t('pages.privacy.s8Outro')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s9Title')}</h2>
            <p>{t('pages.privacy.s9P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s10Title')}</h2>
            <p>{t('pages.privacy.s10P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s11Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s11P1')}</p>
            <p>{t('pages.privacy.s11P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s12Title')}</h2>
            <p className="mb-4">{t('pages.privacy.s12P1')}</p>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Clear eVisa Services</strong></p>
              <p>Email: admin@clearevisa.com</p>
              <p>Phone: +91-9474475384</p>
              <p>Address: B1109, Venkatesh Graffiti Glover, Manjari Rd, Hanuman Nagar, Keshav Nagar, Mundhwa, Pune, Maharashtra 411036, India</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.privacy.s13Title')}</h2>
            <p>{t('pages.privacy.s13P1')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
