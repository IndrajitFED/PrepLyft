import React from 'react'
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                At MockAce, we are committed to protecting your privacy and ensuring the security of your personal 
                information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-primary-600" />
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Account credentials (username, password)</li>
                    <li>Profile information (bio, skills, experience)</li>
                    <li>Payment information (processed securely through payment gateways)</li>
                    <li>Resume and portfolio information (if uploaded)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    We automatically collect information about how you use our platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Session history and bookings</li>
                    <li>Platform interaction data</li>
                    <li>Device information and IP address</li>
                    <li>Browser type and version</li>
                    <li>Log files and access times</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-primary-600" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Match candidates with appropriate mentors</li>
                <li>Facilitate communication between mentors and candidates</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>With Mentors/Candidates:</strong> Basic profile information to facilitate session matching</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in platform operations</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger or acquisition</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-primary-600" />
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the 
                Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our platform</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve platform functionality</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling them may limit platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-2 text-primary-600" />
                7. Your Rights and Choices
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@mockace.com" className="text-primary-600 underline">privacy@mockace.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                Privacy Policy, unless a longer retention period is required or permitted by law. When you delete your 
                account, we will delete or anonymize your personal information, except where we are required to retain 
                it for legal or legitimate business purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform is not intended for users under the age of 18. We do not knowingly collect personal 
                information from children. If you are a parent or guardian and believe your child has provided us with 
                personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. 
                These countries may have data protection laws that differ from those in your country. We ensure appropriate 
                safeguards are in place to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Third-Party Links</h2>
              <p className="text-gray-700 leading-relaxed">
                Our platform may contain links to third-party websites or services. We are not responsible for the privacy 
                practices of these third parties. We encourage you to read their privacy policies before providing any 
                personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:privacy@mockace.com" className="text-primary-600 underline">privacy@mockace.com</a><br />
                  <strong>Address:</strong> 123 Tech Street, Bangalore, Karnataka 560001, India<br />
                  <strong>Phone:</strong> +91 1234567890
                </p>
              </div>
            </section>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Your Privacy Matters:</strong> We are committed to protecting your privacy and being transparent 
                    about our data practices. If you have concerns or questions, please don't hesitate to contact us.
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

export default PrivacyPolicy

