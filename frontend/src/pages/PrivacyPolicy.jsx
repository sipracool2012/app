import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: March 20, 2026</p>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to our Visa Application Platform ("we," "us," "our," or "Company"). 
              We are committed to protecting your privacy and ensuring you have a positive experience on our platform.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              and use our visa application services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
            <p className="mb-4">We collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Full name and contact information (email, phone number)</li>
              <li>Passport and identification details</li>
              <li>Date of birth and citizenship information</li>
              <li>Address and residence history</li>
              <li>Employment and educational background</li>
              <li>Family and relationship information</li>
              <li>Travel history and visa information</li>
              <li>Payment information for visa application fees</li>
              <li>Document uploads (photographs, certificates, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
            <p className="mb-4">When you use our platform, we automatically collect:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Device information (browser type, IP address, operating system)</li>
              <li>Usage data (pages visited, time spent, actions taken)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Log data and analytics information</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Process your visa applications and maintain your account</li>
              <li>Communicate with you about your applications and services</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Process payments and prevent fraudulent transactions</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Improve our services and user experience</li>
              <li>Send updates and notifications about your application status</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Conduct research and analytics</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement comprehensive security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Secure password hashing and storage</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure data centers and backup systems</li>
            </ul>
            <p>
              However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, 
              we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Government immigration authorities and embassies as required for visa processing</li>
              <li>Payment processors and financial institutions for transaction processing</li>
              <li>Service providers who assist us in operating our platform (under confidentiality agreements)</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Other parties with your explicit consent</li>
            </ul>
            <p>
              We do not sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your experience, remember your preferences, 
              and analyze usage patterns. You can control cookie settings in your browser preferences.
            </p>
            <p>
              Types of cookies we use:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information as long as necessary to provide our services and comply with legal obligations. 
              Generally:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Account data is retained while your account is active and for 3 years afterward</li>
              <li>Application data is retained as required by immigration authorities</li>
              <li>Payment records are retained for 7 years for compliance purposes</li>
            </ul>
            <p>
              You may request deletion of your data subject to legal requirements.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of certain processing activities</li>
              <li>Data portability (receive your data in a portable format)</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at the information provided below.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age, and we do not knowingly collect personal 
              information from children under 13. If we become aware that we have collected information from a child under 13, 
              we will delete such information immediately.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites. This Privacy Policy applies only to our website. 
              We are not responsible for the privacy practices of other websites, and we encourage you to review their privacy policies.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, 
              or other factors. We will notify you of any significant changes by updating the "Last updated" date above.
            </p>
            <p>
              Your continued use of our platform after changes become effective constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Visa Application Platform</strong></p>
              <p>Email: privacy@clearevisa.com</p>
              <p>Address: B1109 - Graffiti Glover Commercial, Pune, Maharashtra, 411036, India</p>
              {/* <p>Phone: [Your Phone Number]</p> */}
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Legal Compliance</h2>
            <p>
              This Privacy Policy complies with applicable data protection laws including GDPR, CCPA, and other 
              regional privacy regulations. For more information about your rights under these regulations, 
              please visit the respective regulatory websites.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
