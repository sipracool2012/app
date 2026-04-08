import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: April 7, 2026</p>

        <div className="space-y-8 text-gray-700">

          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="mb-4">
              You can get a full refund for an incomplete application. We can consider a partial return of funds to your
              Bank or Card contingent upon the stage that your application is at. We incur fees from the Government
              Department, Vendor, and Payment Gateway that are not refundable for us — this fixed cost cannot be
              refunded if your application has already been lodged with the relevant Government department.
            </p>
            <p>
              The Government Levy cannot be returned once the application has been formally submitted on the relevant
              immigration authority site, regardless of the outcome of your eVisa application.
            </p>
          </section>

          {/* Eligibility for Refund */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Refund Eligibility</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Full Refund</h3>
            <p className="mb-4">
              A full refund is available if your application has not yet been submitted to the Government immigration
              portal. This includes applications that are incomplete, have not been reviewed by our team, or where
              payment was made in error before any processing began.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.2 Partial Refund</h3>
            <p className="mb-4">
              A partial refund may be considered depending on the stage your application has reached. The following
              non-refundable costs will be deducted from any partial refund:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Government Department fees already incurred</li>
              <li>Third-party Vendor processing fees</li>
              <li>Payment Gateway transaction charges</li>
            </ul>
            <p>
              These costs are fixed and cannot be recovered by us once they have been committed on your behalf.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3 No Refund</h3>
            <p className="mb-4">
              No refund of any kind is available in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Your application has been formally lodged with the relevant immigration authority</li>
              <li>Your eVisa application has been approved, denied, or cancelled after formal submission</li>
              <li>The Government Levy has already been forwarded to the immigration authority</li>
              <li>You voluntarily chose to withdraw your application after Government submission</li>
            </ul>
          </section>

          {/* Application Fee */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Application Fee</h2>
            <p className="mb-4">
              The application fee covers the administrative processing costs incurred by our team, including document
              review, expert review of your submission, translation services where applicable, and liaison with the
              relevant Government immigration department.
            </p>
            <p>
              This fee cannot be returned if your application has been rejected or if it has already been submitted
              on the Government website, as the processing costs have already been incurred at that point.
            </p>
          </section>

          {/* Government Levy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Government Levy</h2>
            <p>
              The Government Levy is a mandatory fee charged by the relevant immigration authority as part of the
              eVisa application process. This levy is forwarded directly to the Government on your behalf and is
              entirely outside our control. It cannot be returned under any circumstances once your application has
              been formally lodged, irrespective of the outcome of that application.
            </p>
          </section>

          {/* Our Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Our Services</h2>
            <p className="mb-4">
              We provide administrative assistance and expert review services. Our team helps you prepare, complete,
              and submit your eVisa application accurately. We also offer translation services to convert supporting
              documents from other languages into English where required.
            </p>
            <p className="mb-4">
              We do not provide immigration counsel, legal immigration advice, or migration advisory services.
              The final decision on any eVisa application rests entirely with the relevant Government immigration
              authority. We have no influence over approval or rejection decisions.
            </p>
            <p>
              Our service fee is charged for the administrative work performed by our team and is not contingent on
              the outcome of your visa application.
            </p>
          </section>

          {/* How to Request a Refund */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How to Request a Refund</h2>
            <p className="mb-4">
              To request a refund, please contact our support team as soon as possible with the following details:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Your full name and email address used during application</li>
              <li>Your application reference number</li>
              <li>The reason for your refund request</li>
              <li>Your preferred refund method (original payment card or bank account)</li>
            </ul>
            <p className="mb-4">
              Refund requests are reviewed within 5–7 business days. If approved, the refund will be processed back
              to your original payment method within 10–14 business days, depending on your bank or card provider.
            </p>
            <p>
              We reserve the right to decline refund requests that do not meet the eligibility criteria outlined in
              this policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Refund Policy or wish to submit a refund request, please reach
              out to our support team via the{' '}
              <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a> page.
            </p>
            <p>
              You may also wish to review our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              {' '}for further information about how we handle your data and the terms governing your use of our platform.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
