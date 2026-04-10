import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
      setSubmitError('Sorry, we could not send your message. Please email us directly at admin@clearevisa.com.');
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">📧 Email</h3>
              <p className="text-gray-600 mb-1">General Inquiries</p>
              <p className="text-blue-600 font-semibold">admin@clearevisa.com</p>
              <p className="text-gray-600 mb-1 mt-3">Customer Support</p>
              <p className="text-blue-600 font-semibold">support@clearevisa.com</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">📱 Phone</h3>
              <p className="text-gray-700">
                <strong>+91-9474475384</strong>
              </p>
              <p className="text-gray-600 text-sm mt-2">Mon – Fri: 9AM – 6PM IST</p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">📍 Address</h3>
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">🕐 Hours</h3>
              <p className="text-gray-700">
                <strong>Customer Support</strong><br />
                Available 24/7
              </p>
              <p className="text-gray-700 mt-3">
                <strong>Sales & Business</strong><br />
                Mon - Fri: 9AM - 6PM PST
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
                    <option value="support">Customer Support</option>
                    <option value="sales">Sales Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press/Media</option>
                    <option value="other">Other</option>
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
                  {submitting ? 'Sending…' : t('pages.contact.send')}
                </button>
              </form>

              <p className="text-sm text-gray-600 mt-4">
                * Required fields. We'll respond to your inquiry within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Ways to Connect */}
        <section className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pages.contact.otherWays')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">💬 Live Chat(Coming Soon)</h3>
              <p className="text-gray-700">Chat with our support team in real-time for immediate assistance.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">📱 Mobile App(Coming Soon)</h3>
              <p className="text-gray-700">Contact support directly through our mobile application.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">🐦 Social Media</h3>
              <p className="text-gray-700">Follow us on Twitter, Facebook, and LinkedIn for updates and support.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
