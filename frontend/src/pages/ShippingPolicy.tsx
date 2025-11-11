import React from 'react'
import { Package, Truck, Clock, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const ShippingPolicy: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-8">
            <Package className="w-8 h-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">Shipping Policy</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Truck className="w-6 h-6 mr-2 text-primary-600" />
                Digital Service Delivery
              </h2>
              <p className="text-gray-700 leading-relaxed">
                MockAce is a digital platform providing interview preparation services. We do not ship physical products. 
                All our services, including interview sessions, study materials, and platform access, are delivered 
                digitally through our online platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Service Delivery</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon successful booking and payment, you will receive immediate access to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Your user account dashboard</li>
                <li>Scheduled interview sessions (as per your booking)</li>
                <li>Access to study materials and resources</li>
                <li>Session confirmation emails and calendar invites</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-primary-600" />
                2. Delivery Timeframe
              </h2>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-blue-800">
                  <strong>Instant Access:</strong> Most services are available immediately after payment confirmation.
                </p>
              </div>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Account Access:</strong> Immediate upon registration and payment</li>
                <li><strong>Session Booking:</strong> Confirmed instantly upon booking</li>
                <li><strong>Calendar Invites:</strong> Sent within 24 hours of mentor approval</li>
                <li><strong>Study Materials:</strong> Available immediately in your dashboard</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Email Notifications</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You will receive email notifications for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Account creation confirmation</li>
                <li>Session booking confirmation</li>
                <li>Payment receipts</li>
                <li>Session reminders (24 hours and 1 hour before)</li>
                <li>Session completion notifications</li>
                <li>Calendar invites for approved sessions</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Please ensure your email address is correct and check your spam folder if you don't receive emails.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Platform Access</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your access to the MockAce platform includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>24/7 access to your dashboard</li>
                <li>Ability to book and manage sessions</li>
                <li>Access to study materials and resources</li>
                <li>Session history and feedback</li>
                <li>Profile management</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-primary-600" />
                5. Service Availability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform is available 24/7 for booking and accessing materials. However, live interview sessions are 
                scheduled based on mentor availability. We strive to maintain high availability but cannot guarantee 
                immediate session availability for all time slots.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Technical Requirements</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access and use our services, you need:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>A compatible device (computer, tablet, or smartphone)</li>
                <li>Stable internet connection</li>
                <li>An updated web browser (Chrome, Firefox, Safari, or Edge)</li>
                <li>For video sessions: a working camera and microphone</li>
                <li>A valid email address</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Support and Assistance</h2>
              <p className="text-gray-700 leading-relaxed">
                If you experience any issues accessing our services or have questions about service delivery, please contact 
                our support team at <a href="mailto:support@mockace.com" className="text-primary-600 underline">support@mockace.com</a>. 
                We aim to respond to all inquiries within 24-48 hours during business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Geographic Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                MockAce services are currently available to users worldwide. All services are delivered digitally, so there 
                are no geographic restrictions for accessing our platform. However, session times are displayed in IST (Indian 
                Standard Time) by default, and you can adjust based on your timezone.
              </p>
            </section>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800">
                    <strong>Need Help?</strong> If you have any questions about service delivery or accessing our platform, 
                    please don't hesitate to contact us at <a href="mailto:support@mockace.com" className="underline">support@mockace.com</a>
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

export default ShippingPolicy

