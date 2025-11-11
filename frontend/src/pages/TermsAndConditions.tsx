import React from 'react'
import { FileText, Shield, AlertCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-8">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">Terms and Conditions</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-primary-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using MockAce ("the Platform"), you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily use MockAce for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without written consent</li>
                <li>Attempt to reverse engineer any software contained on the Platform</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current 
                at all times. You are responsible for safeguarding the password and for all activities that occur under 
                your account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree not to disclose your password to any third party and to take sole responsibility for any activities 
                or actions under your account, whether or not you have authorized such activities or actions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Session Booking and Cancellation</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sessions booked through MockAce are subject to availability. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate information when booking sessions</li>
                <li>Attend sessions at the scheduled time or cancel with at least 24 hours notice</li>
                <li>Respect the mentor's time and expertise</li>
                <li>Follow the Platform's cancellation and refund policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All payments for sessions are processed through secure payment gateways. By making a payment, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Pay the full amount as displayed at the time of booking</li>
                <li>Understand that refunds are subject to our Cancellation and Refund Policy</li>
                <li>Authorize us to charge your payment method for the services you purchase</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The Platform and its original content, features, and functionality are and will remain the exclusive property 
                of MockAce and its licensors. The Platform is protected by copyright, trademark, and other laws. Our 
                trademarks and trade dress may not be used in connection with any product or service without our prior written 
                consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to use the Platform to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Platform or servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall MockAce, nor its directors, employees, partners, agents, suppliers, or affiliates, be 
                liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or 
                liability, under our sole discretion, for any reason whatsoever and without limitation, including but not 
                limited to a breach of the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
                material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law 
                provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of 
                those rights.
              </p>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> If you have any questions about these Terms and Conditions, please contact us at 
                    <a href="mailto:legal@mockace.com" className="underline ml-1">legal@mockace.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default TermsAndConditions

