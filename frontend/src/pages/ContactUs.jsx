import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

export default function ContactUs() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/utility/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '', category: '' });
    } catch {
      setSubmitError(t('pages.contact.sendError2'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('pages.contact.title')}</h1>
          <p className="text-xl text-blue-100">{t('pages.contact.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="md:col-span-1 space-y-8">
            {/* Email */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('pages.contact.emailSectionTitle')}</h3>
              <p className="text-gray-600 mb-1">{t('pages.contact.generalInquiries')}</p>
              <p className="text-blue-600 font-semibold">admin@clearevisa.com</p>
              <p className="text-gray-600 mb-1 mt-3">{t('pages.contact.customerSupport')}</p>
              <p className="text-blue-600 font-semibold">support@clearevisa.com</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('pages.contact.phoneSectionTitle')}</h3>
              <p className="text-gray-700">
                <strong>+91-9474475384</strong>
              </p>
              <p className="text-gray-600 text-sm mt-2">{t('pages.contact.phoneHours')}</p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('pages.contact.addressSectionTitle')}</h3>
              <p className="text-gray-700">
                <strong>Clear eVisa Services</strong><br />
                B1109, Venkatesh Graffiti Glover,<br />
                Manjari Rd, Hanuman Nagar,<br />
                Keshav Nagar, Mundhwa,<br />
                Pune, Maharashtra 411036<br />
                India
              </p>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('pages.contact.hoursSectionTitle')}</h3>
              <p className="text-gray-700">
                <strong>{t('pages.contact.hoursCustomerLabel')}</strong><br />
                {t('pages.contact.hoursCustomerValue')}
              </p>
              <p className="text-gray-700 mt-3">
                <strong>{t('pages.contact.hoursSalesLabel')}</strong><br />
                {t('pages.contact.hoursSalesValue')}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pages.contact.sendUsMessage')}</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                  <p className="font-semibold">{t('pages.contact.messageSentTitle')}</p>
                  <p>{t('pages.contact.messageSentDesc')}</p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                  <p>{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">{t('pages.contact.fullName')} *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder={t('pages.contact.yourName')}
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">{t('pages.contact.emailAddress')} *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">{t('pages.contact.category')} *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="">{t('pages.contact.selectCategory')}</option>
                    <option value="support">{t('pages.contact.catSupport')}</option>
                    <option value="sales">{t('pages.contact.catSales')}</option>
                    <option value="partnership">{t('pages.contact.catPartnership')}</option>
                    <option value="press">{t('pages.contact.catPress')}</option>
                    <option value="other">{t('pages.contact.catOther')}</option>
                  </select>
                </div>

                {/* Subject */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">{t('pages.contact.subject')} *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder={t('pages.contact.howCanWeHelp')}
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">{t('pages.contact.message')} *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder={t('pages.contact.yourMessage')}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? t('pages.contact.sending') : t('pages.contact.send')}
                </button>
              </form>

              <p className="text-sm text-gray-600 mt-4">{t('pages.contact.requiredFields')}</p>
            </div>
          </div>
        </div>

        {/* Additional Ways to Connect */}
        <section className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pages.contact.otherWays')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{t('pages.contact.liveChatTitle')}</h3>
              <p className="text-gray-700">{t('pages.contact.liveChatDesc')}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{t('pages.contact.mobileAppTitle')}</h3>
              <p className="text-gray-700">{t('pages.contact.mobileAppDesc')}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">{t('pages.contact.socialTitle')}</h3>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-black text-white hover:opacity-80 transition-opacity shadow-md"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/people/Clear-evisa-Services/61586266041354/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-[#1877F2] text-white hover:opacity-80 transition-opacity shadow-md"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-[#0A66C2] text-white hover:opacity-80 transition-opacity shadow-md"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-gray-600 text-sm mt-2">{t('pages.contact.socialFollow')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
