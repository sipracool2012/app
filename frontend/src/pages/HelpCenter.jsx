import React, { useState } from 'react';

export default function HelpCenter() {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const categories = [
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'application', name: 'Application Process' },
    { id: 'documents', name: 'Documents & Files' },
    { id: 'payment', name: 'Payment & Fees' },
    { id: 'tracking', name: 'Tracking Status' },
    { id: 'technical', name: 'Technical Issues' }
  ];

  const articles = {
    'getting-started': [
      {
        id: 1,
        question: "How do I create an account?",
        answer: "To create an account, click the 'Sign Up' button on our homepage. Enter your email address, create a strong password, and agree to our terms. You'll receive a verification email to confirm your account."
      },
      {
        id: 2,
        question: "What information do I need to get started?",
        answer: "You'll need basic personal information including your full name, date of birth, passport number, and email address. We'll guide you through collecting additional information as needed for your specific visa type."
      },
      {
        id: 3,
        question: "Can I save my progress and continue later?",
        answer: "Yes! Your application is automatically saved as you complete each section. You can log back in anytime to continue where you left off."
      }
    ],
    'application': [
      {
        id: 4,
        question: "How long does the application process take?",
        answer: "The application process typically takes 20-30 minutes to complete, depending on the visa type and amount of information required. You can save and return to your application at any time."
      },
      {
        id: 5,
        question: "Which visa types do you support?",
        answer: "We support applications for tourist, business, student, work, family reunion, and healthcare visas across 150+ countries. You can filter by your destination country to see available visa types."
      },
      {
        id: 6,
        question: "Can I apply for multiple visas at once?",
        answer: "Yes, you can submit applications for different countries simultaneously. Each application is processed independently according to that country's requirements."
      }
    ],
    'documents': [
      {
        id: 7,
        question: "What file formats are accepted for document uploads?",
        answer: "We accept PDF, JPG, PNG, and DOC/DOCX files. Files should be clear and legible, with a maximum size of 10MB per file."
      },
      {
        id: 8,
        question: "How do I know which documents I need?",
        answer: "We provide a personalized document checklist based on your visa type and destination country. The checklist will be shown during the application process, and you can download it for reference."
      },
      {
        id: 9,
        question: "Can I edit or replace uploaded documents?",
        answer: "Yes, you can replace any uploaded document before submitting your final application. After submission, contact our support team if you need to make changes."
      }
    ],
    'payment': [
      {
        id: 10,
        question: "What payment methods do you accept?",
        answer: "We accept credit cards (Visa, Mastercard, American Express), debit cards, and digital wallets (PayPal, Apple Pay, Google Pay)."
      },
      {
        id: 11,
        question: "Is my payment information secure?",
        answer: "Yes, all payments are processed through encrypted connections using industry-standard security protocols. We never store your complete credit card information on our servers."
      },
      {
        id: 12,
        question: "What's included in the application fee?",
        answer: "Our application fee includes platform access, document verification, personalized guidance, and customer support. We clearly break down all fees before you complete your payment."
      }
    ],
    'tracking': [
      {
        id: 13,
        question: "How do I check my application status?",
        answer: "You can check your application status anytime by logging into your account and visiting the 'My Applications' section. You'll see detailed status updates for each application."
      },
      {
        id: 14,
        question: "Will I receive notifications about my application?",
        answer: "Yes, we send email notifications for important updates including submission confirmation, document verification status, and final decisions."
      },
      {
        id: 15,
        question: "How long does processing typically take?",
        answer: "Processing times vary by country and visa type, ranging from 5-30 days. We provide estimated timelines during the application process based on historical data."
      }
    ],
    'technical': [
      {
        id: 16,
        question: "What browsers do you support?",
        answer: "We support Chrome, Firefox, Safari, and Edge browsers on both desktop and mobile devices. For the best experience, please keep your browser updated to the latest version."
      },
      {
        id: 17,
        question: "I'm having trouble uploading documents. What should I do?",
        answer: "Ensure your file size is under 10MB and in a supported format (PDF, JPG, PNG, DOC/DOCX). Clear your browser cache and try again. If problems persist, contact our support team."
      },
      {
        id: 18,
        question: "Is the platform mobile-friendly?",
        answer: "Yes, our platform is fully responsive and works seamlessly on mobile devices, tablets, and desktops. You can start an application on your phone and continue on your computer."
      }
    ]
  };

  const currentArticles = articles[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-blue-100">Find answers to common questions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Search Bar */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Search for help..."
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
                {cat.name}
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
                <h3 className="text-lg font-semibold text-gray-900">{article.question}</h3>
                <span className="text-2xl text-gray-400">
                  {expandedId === article.id ? '−' : '+'}
                </span>
              </button>
              {expandedId === article.id && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  <p className="text-gray-700">{article.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <section className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Didn't find what you're looking for?</h2>
          <p className="text-gray-700 mb-6">
            Our support team is here to help. Contact us through chat, email, or phone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Start Live Chat
            </button>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
              Email Support
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            📞 Phone: +1 (555) 123-4567 | Available 24/7
          </p>
        </section>
      </div>
    </div>
  );
}
