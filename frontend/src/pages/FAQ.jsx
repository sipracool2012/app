import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "General",
      question: "What is this platform?",
      answer: "Clear eVisa is a specialist Indian eVisa consultancy service. We verify all required documents and information for your India eVisa application, and prepare a complete, accurate documentation package — so you can submit on India's official portal with confidence, without errors that could lead to rejection or delay."
    },
    {
      id: 2,
      category: "General",
      question: "Is this service legal?",
      answer: "Yes, our service is completely legal. Clear eVisa Services is a registered consultancy operating in full compliance with applicable laws. We do not provide immigration legal advice. Instead, we review your documents and information against India's eVisa requirements and prepare accurate documentation to help you submit correctly on the official Government portal."
    },
    {
      id: 3,
      category: "Account & Support",
      question: "Do I need to create an account?",
      answer: "Yes, creating an account is required to use our platform. This allows you to save your progress, access your applications, and receive updates about your visa status."
    },
    {
      id: 4,
      category: "Account & Support",
      question: "How do I reset my password?",
      answer: "Click the 'Forgot Password' link on the sign-in page. Enter your email address, and we'll send you instructions to reset your password. Follow the link in the email and create a new password."
    },
    {
      id: 5,
      category: "Applications",
      question: "Can I get assistance for multiple family members?",
      answer: "Yes, we can assist multiple travellers — such as family members travelling together. Each person's documents and information are verified and prepared independently. Each traveller will need their own application submission on the official portal."
    },
    {
      id: 6,
      category: "Applications",
      question: "What India eVisa types do you support?",
      answer: "We specialise exclusively in India eVisa. We support all five India eVisa types: Tourist (30-day, 1-year, and 5-year), Business, Medical, Medical Attendant, and Conference eVisas — for eligible passport holders from 193+ nationalities."
    },
    {
      id: 7,
      category: "Documents",
      question: "What documents will I need?",
      answer: "Required documents vary by India eVisa type. Our platform provides a personalised document checklist based on your nationality and the visa type you are applying for. Common requirements include a digital passport photo, passport scan, and supporting documents such as a business letter or medical certificate depending on the visa category."
    },
    {
      id: 8,
      category: "Documents",
      question: "Can I upload documents later?",
      answer: "Yes, you can complete your application and upload documents anytime before final submission. However, you cannot submit your application until all required documents are uploaded."
    },
    {
      id: 9,
      category: "Payment",
      question: "What is the total cost?",
      answer: "Our consultancy fee covers thorough document verification, expert review of your information against India's eVisa requirements, and preparation of your complete documentation package. Government eVisa fees are paid directly by you at the time of submission on India's official portal. All fees are clearly displayed before payment."
    },
    {
      id: 10,
      category: "Payment",
      question: "Is it safe to pay online?",
      answer: "Yes, all payments are processed through secure, encrypted connections using industry-standard security protocols. We use reputable payment processors and never store your complete credit card information."
    },
    {
      id: 11,
      category: "Processing",
      question: "How long does visa processing take?",
      answer: "India eVisa processing by the Indian Government typically takes 3–5 business days after you submit on the official portal. Our consultancy ensures your documents are verified and correctly prepared before you submit, reducing the risk of delays caused by errors or missing information."
    },
    {
      id: 12,
      category: "Processing",
      question: "Can I track my application status?",
      answer: "Yes, you can track your application status 24/7 through your account dashboard. We also send email notifications for important updates."
    },
    {
      id: 13,
      category: "Refunds & Cancellation",
      question: "What's your refund policy?",
      answer: "Our consultancy fee covers document verification, information review, and preparation of your documentation. It does not cover the Government of India eVisa fee, which you pay separately when submitting on the official portal. Once our document review and preparation is complete, our service fee is non-refundable. See our Refund Policy for full details."
    },
    {
      id: 14,
      category: "Technical",
      question: "What browsers do you support?",
      answer: "We support all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, please use the latest version of your browser."
    },
    {
      id: 15,
      category: "Technical",
      question: "Can I use the platform on my phone?",
      answer: "Yes, our platform is fully mobile-responsive and works on all smartphones and tablets. You can start an application on one device and continue on another."
    },
    {
      id: 16,
      category: "Support",
      question: "What if I need help?",
      answer: "We offer 24/7 customer support through multiple channels: live chat on our website, email support, and phone support. You can also explore our comprehensive Help Center for self-service answers."
    },
    {
      id: 17,
      category: "Support",
      question: "Do you provide immigration legal advice?",
      answer: "We provide information and guidance on application requirements, but we do not provide legal advice. For legal questions, we recommend consulting with a qualified immigration attorney."
    },
    {
      id: 18,
      category: "Privacy",
      question: "How do you protect my data?",
      answer: "We implement comprehensive security measures including SSL encryption, secure data centers, regular audits, and strict access controls. See our Privacy Policy for complete details."
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

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
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors font-semibold"
            >
              {cat}
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
                  <div className="text-sm text-blue-600 font-semibold mb-1">{faq.category}</div>
                  <h3 className="text-lg font-semibold text-gray-900 text-left">{faq.question}</h3>
                </div>
                <span className="ml-4 mt-1 text-2xl text-gray-400 flex-shrink-0">
                  {expandedId === faq.id ? '−' : '+'}
                </span>
              </button>
              {expandedId === faq.id && (
                <div className="px-6 pb-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <section className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pages.faq.stillHaveQuestions')}</h2>
          <p className="text-gray-700 mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
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
