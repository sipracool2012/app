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
      answer: "Our platform is a comprehensive visa application service that helps individuals navigate the complex visa application process. We provide step-by-step guidance, document verification, and support across 150+ countries."
    },
    {
      id: 2,
      category: "General",
      question: "Is this service legal?",
      answer: "Yes, our service is completely legal. We are a registered company operating in compliance with all applicable laws and regulations. We do not provide legal advice; instead, we help you organize and submit your application accurately."
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
      question: "Can I apply for multiple visas simultaneously?",
      answer: "Yes, you can submit applications for multiple countries at the same time. Each application is independent and processed separately according to that country's requirements."
    },
    {
      id: 6,
      category: "Applications",
      question: "What visa types do you support?",
      answer: "We support tourist visas, business visas, student visas, work visas, family reunion visas, and healthcare visas across our 150+ supported countries. Check the visa finder to see what's available for your destination."
    },
    {
      id: 7,
      category: "Documents",
      question: "What documents will I need?",
      answer: "Required documents vary by country and visa type. Our platform provides a personalized document checklist based on your specific application. You'll receive this list when you start your application."
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
      answer: "Costs vary depending on the destination country and visa type. Our platform fee is transparent and clearly displayed before you complete payment. We also break down any government fees and service charges separately."
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
      answer: "Processing times vary significantly by country, ranging from 5 to 30 days. We provide estimated timelines based on historical data when you start your application."
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
      answer: "Refund policies depend on the visa type and stage of your application. Generally, we can offer refunds if your application hasn't been submitted to the government yet. Contact our support team for specific details."
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
