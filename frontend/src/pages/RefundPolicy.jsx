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
              You can get a full refund if our document review and preparation work has not yet commenced. Once work
              has begun, we can consider a partial return of funds depending on the stage reached. We incur costs from
              our review team, third-party vendors, and payment gateways that cannot be recovered once committed.
            </p>
            <p>
              The Government of India eVisa fee is paid directly by you on the official portal at the time of your
              own submission. This fee is entirely outside our control and cannot be refunded once your application
              has been formally lodged with the Indian immigration authority.
            </p>
          </section>

          {/* Eligibility for Refund */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Refund Eligibility</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Full Refund</h3>
            <p className="mb-4">
              A full refund is available if you cancel before our document review and preparation work has begun
              and before you have submitted your application on India's official eVisa portal.
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
              These costs are fixed and cannot be recovered by us once they have been committed.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">1.3 No Refund</h3>
            <p className="mb-4">
              No refund of any kind is available in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Our document review and preparation work has been fully completed</li>
              <li>You have formally submitted your application on India's official eVisa portal</li>
              <li>Your eVisa application has been approved, denied, or cancelled after your submission</li>
              <li>You voluntarily chose to withdraw your application after submission</li>
            </ul>
          </section>

          {/* Application Fee */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Application Fee</h2>
            <p className="mb-4">
              The consultancy fee covers the costs incurred by our team, including document verification, expert
              review of your information against India's eVisa requirements, preparation of a complete documentation
              package, and translation services where applicable.
            </p>
            <p>
              This fee cannot be returned once our review and preparation work is complete. If you have already
              submitted your application on the official portal, our work has been completed and the fee is
              non-refundable regardless of the outcome of your eVisa application.
            </p>
          </section>

          {/* Government Levy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Government Levy</h2>
            <p>
              The Government of India eVisa fee is a mandatory charge set by the Indian immigration authority.
              This fee is paid directly by you when you submit your application on the official portal
              (indianvisaonline.gov.in). It is entirely outside our control and cannot be returned under any
              circumstances once your application has been formally lodged, irrespective of the outcome.
            </p>
          </section>

          {/* Our Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Our Services</h2>
            <p className="mb-4">
              Clear eVisa Services provides Indian eVisa consultancy. Our team verifies all your required documents
              and information against India's eVisa requirements and prepares a complete, accurate documentation
              package. We also offer translation services where required. You are responsible for submitting your
              own application on India's official portal (indianvisaonline.gov.in).
            </p>
            <p className="mb-4">
              We do not submit applications on your behalf. We do not provide immigration counsel, legal immigration
              advice, or migration advisory services. The final decision on any eVisa application rests entirely with
              the Government of India. We have no influence over approval or rejection decisions.
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
