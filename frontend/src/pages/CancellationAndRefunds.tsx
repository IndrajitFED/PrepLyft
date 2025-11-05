import React from 'react'
import { RotateCcw, XCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CancellationAndRefunds: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-8">
            <RotateCcw className="w-8 h-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">Cancellation and Refund Policy</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Overview</h2>
              <p className="text-gray-700 leading-relaxed">
                At MockAce, we understand that circumstances may arise that require you to cancel a session. This policy 
                outlines our cancellation and refund procedures to ensure transparency and fairness for all users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-primary-600" />
                2. Cancellation Timeframes
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h3 className="font-semibold text-green-900 mb-2">More than 24 hours before session:</h3>
                  <p className="text-green-800">
                    Full refund will be processed to your original payment method within 5-7 business days.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Between 12-24 hours before session:</h3>
                  <p className="text-yellow-800">
                    50% refund will be processed, or you can reschedule to another available time slot free of charge.
                  </p>
                </div>
                
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h3 className="font-semibold text-red-900 mb-2">Less than 12 hours before session:</h3>
                  <p className="text-red-800">
                    No refund will be provided. However, you may reschedule subject to mentor availability and a rescheduling fee.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How to Cancel</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To cancel a session, you can:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Log in to your dashboard and navigate to "My Sessions"</li>
                <li>Click on the session you want to cancel</li>
                <li>Select "Cancel Session"</li>
                <li>Confirm your cancellation</li>
                <li>Or contact our support team at <a href="mailto:support@mockace.com" className="text-primary-600 underline">support@mockace.com</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Refund Processing</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Timeframe</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Refunds will be processed within 5-7 business days from the date of cancellation approval. The refund 
                    will be credited to your original payment method.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Refund Method</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Refunds will be processed using the same payment method you used for the original transaction. For 
                    credit/debit card payments, refunds may take 5-10 business days to appear on your statement.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-6 h-6 mr-2 text-primary-600" />
                5. Mentor Cancellations
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If a mentor cancels a session:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>You will receive a full refund automatically</li>
                <li>You will be notified via email immediately</li>
                <li>You can book another session with any available mentor</li>
                <li>We will assist you in finding an alternative mentor if needed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. No-Show Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you fail to attend a scheduled session without prior cancellation:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>No refund will be provided</li>
                <li>The session will be marked as "No-Show"</li>
                <li>Repeated no-shows may result in restrictions on future bookings</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-primary-600" />
                7. Rescheduling
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can reschedule sessions:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>More than 24 hours before: Free rescheduling</li>
                <li>Between 12-24 hours before: Free rescheduling (limited to once per session)</li>
                <li>Less than 12 hours before: Subject to a rescheduling fee of ₹100</li>
                <li>Rescheduling is subject to mentor availability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Special Circumstances</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We understand that emergencies and special circumstances can occur. In such cases, please contact our 
                support team at <a href="mailto:support@mockace.com" className="text-primary-600 underline">support@mockace.com</a> 
                with details, and we will review your request on a case-by-case basis.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Acceptable circumstances may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Medical emergencies</li>
                <li>Family emergencies</li>
                <li>Technical issues preventing session access</li>
                <li>Mentor unavailability due to technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Subscription and Package Refunds</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For subscription plans and package purchases:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Monthly subscriptions: Can be cancelled anytime; no refund for the current billing period</li>
                <li>Annual subscriptions: Pro-rated refunds available if cancelled within 30 days</li>
                <li>Package purchases: Refunds calculated based on used sessions</li>
                <li>All refunds subject to review and approval</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                If you are not satisfied with our refund decision, you can:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-2">
                <li>Contact our support team for a review</li>
                <li>Escalate to our management team</li>
                <li>All disputes will be handled fairly and transparently</li>
              </ul>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Questions?</strong> If you have any questions about cancellations or refunds, please contact 
                    us at <a href="mailto:support@mockace.com" className="underline">support@mockace.com</a> or call us at +91 1234567890
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

export default CancellationAndRefunds

