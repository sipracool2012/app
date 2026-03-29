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
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing and using this visa application platform ("Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p>
              We reserve the right to make changes to these Terms of Service at any time without notice. Your continued use 
              of the Service following the posting of revised Terms of Service means that you accept and agree to the changes.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on our Service 
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Violate any applicable laws or regulations or our usage policies</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="mb-4">
              To use certain features of the Service, you must create an account. When you create an account, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the confidentiality of your password</li>
              <li>Be responsible for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Be at least 13 years of age (or local equivalent age of majority)</li>
            </ul>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Service Description</h2>
            <p className="mb-4">
              Our Service provides a platform to help you organize, prepare, and submit visa applications. We offer:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Application guidance and step-by-step instructions</li>
              <li>Document organization and verification tools</li>
              <li>Application status tracking</li>
              <li>Customer support services</li>
            </ul>
            <p>
              <strong>Important Disclaimer:</strong> We are not a law firm and do not provide legal advice. Our Service is 
              designed to help you organize and prepare your visa application, but it does not replace professional legal counsel. 
              For legal advice, please consult a qualified immigration attorney.
            </p>
          </section>

          {/* Visa Application Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Visa Application Process</h2>
            <p className="mb-4">
              By using our Service to submit a visa application, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>All information provided is accurate, complete, and truthful</li>
              <li>You have the legal right to apply for the visa</li>
              <li>You understand the visa requirements and your eligibility</li>
              <li>We submit your application to the relevant government authority on your behalf</li>
              <li>The decision to grant or deny your visa rests solely with the government authority</li>
              <li>We do not guarantee approval of your visa application</li>
            </ul>
          </section>

          {/* Fees and Payments */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Fees and Payments</h2>
            <p className="mb-4">
              You agree to pay all fees charged to your account according to the pricing displayed when you use the Service. 
              Fees are non-refundable except as specified in this agreement or as required by applicable law.
            </p>
            <p className="mb-4">
              We reserve the right to change our fees at any time, but will provide at least 30 days notice for changes. 
              Continued use of the Service after the notice period constitutes acceptance of new fees.
            </p>
            <p>
              All fees are exclusive of applicable taxes unless otherwise stated.
            </p>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Refund Policy</h2>
            <p className="mb-4">
              Refunds are available under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>If you request a refund before submitting your application to government authorities, you may be eligible for a partial or full refund</li>
              <li>Refund requests must be submitted within 14 days of payment</li>
              <li>Government fees and certain service charges may be non-refundable</li>
              <li>We reserve the right to deny refunds for applications submitted with inaccurate information</li>
            </ul>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="mb-4">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
              OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or completeness of information</li>
              <li>Warranties that your visa application will be approved</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              IN NO EVENT SHALL OUR COMPANY, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Loss of profits or revenue</li>
              <li>Loss of data or information</li>
              <li>Visa application denial or delay</li>
              <li>Any other business interruption</li>
            </ul>
            <p>
              Even if we have been advised of the possibility of such damages.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless our Company from any and all claims, damages, losses, and expenses 
              arising from your use of the Service, your violation of these Terms of Service, or your violation of any law 
              or the rights of a third party.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. User Content</h2>
            <p className="mb-4">
              You retain all rights to any content you submit to our Service. By submitting content, you grant us a 
              non-exclusive, royalty-free, perpetual license to use, reproduce, modify, and distribute your content 
              as necessary to provide the Service.
            </p>
            <p>
              You represent and warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>You own or have the right to submit all content</li>
              <li>Your content does not infringe on any third-party rights</li>
              <li>Your content complies with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Prohibited Activities</h2>
            <p className="mb-4">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Submitting false or fraudulent information</li>
              <li>Harassing, abusing, or threatening other users or staff</li>
              <li>Attempting to gain unauthorized access to the Service</li>
              <li>Downloading or distributing any content in violation of intellectual property rights</li>
              <li>Using the Service for any illegal purpose</li>
              <li>Interfering with or disrupting the integrity or performance of the Service</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
              for any reason whatsoever, including if you breach any provision of these Terms of Service.
            </p>
            <p>
              Upon termination, you agree to cease all use of the Service and to comply with any data handling obligations.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which 
              our Company is located, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting. 
              Your continued use of the Service following any such change constitutes your agreement to the new Terms of Service.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded mt-4">
              <p><strong>Visa Application Platform</strong></p>
              <p>Email: legal@clearevisa.com</p>
              <p>Address: B1109 - Graffiti Glover Commercial, Pune, Maharashtra, 411036, India</p>
              {/* <p>Phone: [Your Phone Number]</p> */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
