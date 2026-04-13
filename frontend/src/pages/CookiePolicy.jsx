import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CookiePolicy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('pages.cookies.title')}</h1>
        <p className="text-gray-600 mb-8">{t('pages.cookies.lastUpdated', { date: 'March 20, 2026' })}</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s1Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s1P1')}</p>
            <p>{t('pages.cookies.s1P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s2Title')}</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.cookies.s2_1Title')}</h3>
            <p className="mb-4">{t('pages.cookies.s2_1P1')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s2_1i1','s2_1i2','s2_1i3','s2_1i4'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
            <p className="mb-4">{t('pages.cookies.s2_1P2')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.cookies.s2_2Title')}</h3>
            <p className="mb-4">{t('pages.cookies.s2_2P1')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s2_2i1','s2_2i2','s2_2i3','s2_2i4'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
            <p className="mb-4">{t('pages.cookies.s2_2P2')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.cookies.s2_3Title')}</h3>
            <p className="mb-4">{t('pages.cookies.s2_3P1')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s2_3i1','s2_3i2','s2_3i3','s2_3i4'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
            <p className="mb-4">{t('pages.cookies.s2_3P2')}</p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('pages.cookies.s2_4Title')}</h3>
            <p className="mb-4">{t('pages.cookies.s2_4P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s3Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s3P1')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s3i1','s3i2','s3i3','s3i4'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.cookies.s3P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s4Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s4P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s4i1','s4i2','s4i3','s4i4','s4i5','s4i6'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s5Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s5P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s5i1','s5i2'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.cookies.s5P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s6Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s6P1')}</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              {['s6i1','s6i2','s6i3','s6i4'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
            <p className="mb-4">{t('pages.cookies.s6P2')}</p>
            <ul className="list-disc list-inside space-y-2">
              {['s6b1','s6b2','s6b3','s6b4'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s7Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s7P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s7i1','s7i2','s7i3'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
            <p>{t('pages.cookies.s7P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s8Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s8P1')}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {['s8i1','s8i2','s8i3'].map(k => (
                <li key={k}>{t(`pages.cookies.${k}`)}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s9Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s9P1')}</p>
            <p>{t('pages.cookies.s9P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s10Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s10P1')}</p>
            <p>{t('pages.cookies.s10P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s11Title')}</h2>
            <p>{t('pages.cookies.s11P1')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s12Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s12P1')}</p>
            <div className="bg-gray-50 p-4 rounded mb-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">{t('pages.cookies.s12ColName')}</th>
                    <th className="text-left font-semibold">{t('pages.cookies.s12ColType')}</th>
                    <th className="text-left font-semibold">{t('pages.cookies.s12ColPurpose')}</th>
                    <th className="text-left font-semibold">{t('pages.cookies.s12ColDuration')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[1,2,3,4].map(n => (
                    <tr key={n} className="border-t">
                      <td className="py-2">{t(`pages.cookies.s12R${n}Name`)}</td>
                      <td>{t(`pages.cookies.s12R${n}Type`)}</td>
                      <td>{t(`pages.cookies.s12R${n}Purpose`)}</td>
                      <td>{t(`pages.cookies.s12R${n}Duration`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s13Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s13P1')}</p>
            <p>{t('pages.cookies.s13P2')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.cookies.s14Title')}</h2>
            <p className="mb-4">{t('pages.cookies.s14P1')}</p>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Visa Application Platform</strong></p>
              <p>Email: privacy@clearevisa.com</p>
              <p>Address: B1109 - Graffiti Glover Commercial, Pune, Maharashtra, 411036, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
