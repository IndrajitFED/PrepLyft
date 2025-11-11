import React from 'react'
import { Users, Heart, Award, Target, Lightbulb, TrendingUp, Users as UsersIcon } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About MockAce</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering aspiring professionals to ace their technical interviews and land their dream jobs
            through personalized mentorship and comprehensive preparation.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                MockAce was born from a simple observation: thousands of talented candidates struggle to 
                showcase their skills in technical interviews, not because they lack the knowledge, but 
                because they lack the right preparation and guidance.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Founded by a team of experienced engineers and interview experts from top tech companies, 
                we've witnessed first-hand how proper mock interview practice can transform a candidate's 
                performance and confidence.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, MockAce connects candidates with industry experts who provide personalized feedback, 
                real-world interview scenarios, and actionable insights to help everyone achieve their 
                career goals.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              <img
                src="https://res.cloudinary.com/dtnx5ar9j/image/upload/v1762392094/Gemini_Generated_Image_uhsaoouhsaoouhsa_1_yn7oee.png"
                alt="MockAce Company Story"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center">
                        <Target class="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <p class="text-gray-500">Company Story Image Placeholder</p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16 p-8 md:p-12 bg-white rounded-lg shadow-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="w-8 h-8 text-primary-600" />
              <h2 className="text-3xl font-bold text-gray-900">
                Meet Our Team
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're a passionate team dedicated to helping you ace your
              interviews and achieve your career goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dtnx5ar9j/image/upload/v1762364961/Gemini_Generated_Image_itce75itce75itce_1_1_yitiyy.png"
                  alt="MockAce Team"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Our Mission
                    </h3>
                    <p className="text-gray-700">
                      We believe in empowering every candidate with the
                      confidence and skills needed to succeed in their dream job
                      interviews. Our team of experienced mentors and engineers
                      work tirelessly to provide you with the best interview
                      preparation experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Our Expertise
                    </h3>
                    <p className="text-gray-700 mb-3">
                      With years of combined experience in:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>
                        Technical interviews (DSA, System Design, Frontend, Backend, DataScience, DataAnalytics, Behavioral)
                      </li>
                      <li>Behavioral interviews and communication skills</li>
                      <li>Industry best practices and hiring trends</li>
                      <li>Personalized mentorship and feedback</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Why Choose Us
                    </h3>
                    <p className="text-gray-700">
                      We're not just another interview prep platform. We're your
                      partners in success. Our team is committed to
                      understanding your unique needs and providing personalized
                      guidance every step of the way. We celebrate your
                      victories and support you through challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                Join thousands of successful candidates
              </span>{" "}
              who have landed their dream jobs with MockAce. Your success story
              starts here!
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously innovate our platform with the latest interview trends and technologies
              to give you the best preparation experience.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
            <p className="text-gray-600">
              We maintain the highest standards in mentorship quality, ensuring every session
              provides maximum value and actionable feedback.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Empowerment</h3>
            <p className="text-gray-600">
              We believe in empowering every candidate, regardless of their background,
              to achieve their career aspirations through quality preparation.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white  rounded-lg shadow-lg p-12 text-white mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Candidates Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Expert Mentors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Companies</div>
            </div>
          </div>
        </div>

        {/* Future Vision Section */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
              <img
                src="https://res.cloudinary.com/dtnx5ar9j/image/upload/v1762391116/1762391102980_q2vmyy.png"
                alt="MockAce Vision"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center">
                        <Rocket class="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <p class="text-gray-500">Vision Image Placeholder</p>
                      </div>
                    `;
                  }
                }}
              />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-8 h-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We envision a world where every candidate has access to quality interview preparation 
                and mentorship, regardless of their background or location. Our platform bridges the 
                gap between talent and opportunity.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We're building the most comprehensive interview preparation ecosystem that combines 
                personalized mentorship, AI-powered practice, and real-world interview simulations 
                to help candidates succeed.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Join us on this journey to transform how technical interviews are prepared for, 
                making the process more accessible, fair, and effective for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutUs

