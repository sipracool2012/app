import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: March 20, 2026</p>

        <div className="space-y-8 text-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit 
              a website. Cookies allow websites to remember information about your visit, such as your preferences and login information.
            </p>
            <p>
              This Cookie Policy explains how we use cookies and similar technologies on our visa application platform 
              ("Service"). By using our Service, you consent to our use of cookies as described in this policy.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Essential Cookies</h3>
            <p className="mb-4">
              These cookies are strictly necessary for the operation of our Service. They enable core functionality such as:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>User authentication and login functionality</li>
              <li>Session management</li>
              <li>Security features and fraud prevention</li>
              <li>Compliance with legal requirements</li>
            </ul>
            <p className="mb-4">
              Without these cookies, the Service cannot function properly. These cookies cannot be disabled without preventing 
              you from using the Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Performance Cookies</h3>
            <p className="mb-4">
              These cookies collect information about how you use our Service, such as:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Pages you visit and time spent on each page</li>
              <li>Links you click</li>
              <li>Errors you encounter</li>
              <li>Device and browser information</li>
            </ul>
            <p className="mb-4">
              This information helps us improve the Service, identify technical issues, and optimize performance. 
              The data collected is aggregated and does not identify you personally.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Preference Cookies</h3>
            <p className="mb-4">
              These cookies remember your preferences and settings, such as:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Language preferences</li>
              <li>Display preferences (light/dark mode)</li>
              <li>Saved form information</li>
              <li>Application preferences</li>
            </ul>
            <p className="mb-4">
              These cookies allow us to provide you with a personalized experience without requiring you to re-enter 
              your preferences on each visit.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Marketing Cookies</h3>
            <p className="mb-4">
              These cookies are used to track your activity across websites and deliver personalized advertising. 
              We only use marketing cookies if you have opted in to receive promotional communications.
            </p>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h2>
            <p className="mb-4">
              We may also allow third-party service providers to place cookies on your device. These providers include:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li><strong>Analytics providers:</strong> Help us understand how users interact with our Service</li>
              <li><strong>Payment processors:</strong> Facilitate secure payment transactions</li>
              <li><strong>Customer support tools:</strong> Enable live chat and support functionality</li>
              <li><strong>Cloud providers:</strong> Help us host and deliver our Service</li>
            </ul>
            <p>
              These third parties have their own cookie policies and privacy practices. We encourage you to review their 
              policies for more information about how they use cookies.
            </p>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Authentication:</strong> To verify your identity and keep you securely logged in</li>
              <li><strong>Functionality:</strong> To remember your preferences and provide personalized features</li>
              <li><strong>Analytics:</strong> To understand how users interact with our Service and identify improvements</li>
              <li><strong>Performance:</strong> To optimize our Service performance and identify technical issues</li>
              <li><strong>Security:</strong> To detect and prevent fraudulent activity</li>
              <li><strong>Compliance:</strong> To comply with legal and regulatory requirements</li>
            </ul>
          </section>

          {/* How Long Cookies Last */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookie Duration</h2>
            <p className="mb-4">
              Cookies have different lifespans:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a specified period (typically 1-2 years)</li>
            </ul>
            <p>
              You can check the specific expiration date for each cookie in your browser settings.
            </p>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Managing Your Cookies</h2>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can typically:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>View which cookies are stored on your device</li>
              <li>Delete individual cookies or all cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Set your browser to block all cookies or alert you when cookies are being set</li>
            </ul>
            <p className="mb-4">
              To manage cookies, look for privacy or security settings in your browser menu. Popular browsers include:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Google Chrome: Settings → Privacy and Security → Cookies and other site data</li>
              <li>Mozilla Firefox: Preferences → Privacy & Security → Cookies and Site Data</li>
              <li>Safari: Preferences → Privacy</li>
              <li>Microsoft Edge: Settings → Privacy, search, and services → Cookies and other site data</li>
            </ul>
          </section>

          {/* Disabling Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disabling Cookies</h2>
            <p className="mb-4">
              While you can disable non-essential cookies, please note that disabling essential cookies may:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Prevent you from logging in to your account</li>
              <li>Impact the functionality of our Service</li>
              <li>Prevent your application progress from being saved</li>
            </ul>
            <p>
              We recommend keeping essential cookies enabled for the full functionality of our Service.
            </p>
          </section>

          {/* Tracking Technologies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Similar Tracking Technologies</h2>
            <p className="mb-4">
              In addition to cookies, we may use other similar technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li><strong>Pixels and beacons:</strong> Transparent images used to track user activity</li>
              <li><strong>Local storage:</strong> Browser storage similar to cookies but with larger capacity</li>
              <li><strong>Session storage:</strong> Temporary storage that clears when you close your browser</li>
            </ul>
          </section>

          {/* Privacy and Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy and Data Protection</h2>
            <p className="mb-4">
              Information collected through cookies is subject to our Privacy Policy. While cookies themselves don't collect 
              personal information directly, the data they collect may be combined with other information to identify you.
            </p>
            <p>
              For more details about how we collect, use, and protect your information, please review our Privacy Policy.
            </p>
          </section>

          {/* Do Not Track */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Do Not Track Signals</h2>
            <p className="mb-4">
              Some browsers include a Do Not Track (DNT) feature. Currently, there is no widely accepted standard for how 
              websites should respond to DNT signals. At this time, our Service does not change its data collection practices 
              in response to DNT signals.
            </p>
            <p>
              You can instead control cookies and tracking technologies through your browser settings as described in Section 6.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Users</h2>
            <p>
              If you are located in the European Union or other jurisdictions with specific cookie consent requirements, 
              we will provide you with options to accept or reject non-essential cookies before they are set. You can change 
              these preferences at any time through our cookie consent manager.
            </p>
          </section>

          {/* Cookie List */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Our Cookie List</h2>
            <p className="mb-4">
              The following is a non-exhaustive list of cookies we use:
            </p>
            <div className="bg-gray-50 p-4 rounded mb-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">Cookie Name</th>
                    <th className="text-left font-semibold">Type</th>
                    <th className="text-left font-semibold">Purpose</th>
                    <th className="text-left font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-t">
                    <td className="py-2">session_id</td>
                    <td>Essential</td>
                    <td>Session management</td>
                    <td>Session</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">auth_token</td>
                    <td>Essential</td>
                    <td>Authentication</td>
                    <td>1 month</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">user_preferences</td>
                    <td>Preference</td>
                    <td>Store user preferences</td>
                    <td>1 year</td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2">_ga</td>
                    <td>Analytics</td>
                    <td>Google Analytics tracking</td>
                    <td>2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this Cookie Policy periodically to reflect changes in our practices or technology. 
              The updated policy will be posted on this page with a new "Last updated" date.
            </p>
            <p>
              Your continued use of our Service following these changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Us</h2>
            <p className="mb-4">
              If you have questions about our use of cookies, please contact us at:
            </p>
            <div className="bg-gray-100 p-4 rounded">
              <p><strong>Visa Application Platform</strong></p>
              <p>Email: privacy@clearevisa.com</p>
              <p>Address: B1109 - Graffiti Glover Commercial, Pune, Maharashtra, 411036, India</p>
              {/* <p>Phone: [Your Phone Number]</p> */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
