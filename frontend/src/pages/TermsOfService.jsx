import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TermsOfService() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('pages.terms.title')}</h1>
        <p className="text-gray-600 mb-8">{t('pages.terms.lastUpdated', { date: 'March 20, 2026' })}</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s1Title')}</h2>
            <p className="mb-4">{t('pages.terms.s1P1')}</p>
            <p>{t('pages.terms.s1P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s2Title')}</h2>
            <p className="mb-4">{t('pages.terms.s2P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s2i1','s2i2','s2i3','s2i4','s2i5','s2i6'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s3Title')}</h2>
            <p className="mb-4">{t('pages.terms.s3P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s3i1','s3i2','s3i3','s3i4','s3i5'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s4Title')}</h2>
            <p className="mb-4">{t('pages.terms.s4P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s4i1','s4i2','s4i3','s4i4','s4i5'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.terms.s4Disclaimer')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s5Title')}</h2>
            <p className="mb-4">{t('pages.terms.s5P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s5i1','s5i2','s5i3','s5i4','s5i5','s5i6','s5i7'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s6Title')}</h2>
            <p className="mb-4">{t('pages.terms.s6P1')}</p>
            <p className="mb-4">{t('pages.terms.s6P2')}</p>
            <p>{t('pages.terms.s6P3')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s7Title')}</h2>
            <p className="mb-4">{t('pages.terms.s7P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s7i1','s7i2','s7i3','s7i4'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.terms.s7Outro')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s8Title')}</h2>
            <p className="mb-4">{t('pages.terms.s8P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s8i1','s8i2','s8i3','s8i4'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s9Title')}</h2>
            <p className="mb-4">{t('pages.terms.s9P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s9i1','s9i2','s9i3','s9i4'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.terms.s9Outro')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s10Title')}</h2>
            <p>{t('pages.terms.s10P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s11Title')}</h2>
            <p className="mb-4">{t('pages.terms.s11P1')}</p>
            <p>{t('pages.terms.s11P2')}</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              {['s11i1','s11i2','s11i3'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s12Title')}</h2>
            <p className="mb-4">{t('pages.terms.s12P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s12i1','s12i2','s12i3','s12i4','s12i5','s12i6'].map(k => (
                <li key={k}>{t(`pages.terms.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s13Title')}</h2>
            <p className="mb-4">{t('pages.terms.s13P1')}</p>
            <p>{t('pages.terms.s13P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s14Title')}</h2>
            <p>{t('pages.terms.s14P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s15Title')}</h2>
            <p>{t('pages.terms.s15P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.terms.s16Title')}</h2>
            <p>{t('pages.terms.s16P1')}</p>
            <div className="bg-gray-100 p-4 rounded mt-4">
              <p><strong>Clear eVisa Services</strong></p>
              <p>Email: admin@clearevisa.com</p>
              <p>Phone: +91-9474475384</p>
              <p>Address: B1109, Venkatesh Graffiti Glover, Manjari Rd, Hanuman Nagar, Keshav Nagar, Mundhwa, Pune, Maharashtra 411036, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
