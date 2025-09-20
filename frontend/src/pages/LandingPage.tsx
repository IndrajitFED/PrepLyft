import React from 'react'
import { Link } from 'react-router-dom'
import { 
  CheckCircle, 
  Play, 
  Star, 
  Users, 
  MessageSquare, 
  Calendar, 
  Code,
  BarChart3, 
  Database,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react'
import Header from '../components/Header'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mb-6">
                ⭐ 500+ Students Placed in Top Companies
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Ace Your <span className="text-primary-600">Technical</span> Interviews
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Practice with industry experts, get personalized feedback, and land your dream job in DSA, Data Science, and Analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Book Free Mock Interview →
                </Link>
                <button className="btn-secondary text-lg px-8 py-4">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No Credit Card Required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Money Back Guarantee
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Mock Interview Session</h3>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">Live</span>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-green-400 text-sm">
{`def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`}
                  </pre>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Interviewer: Sarah Chen, Google</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Problem Solving</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Communication</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Code Quality</span>
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-600 mb-8">Trusted by students from top universities</p>
          <div className="flex justify-center items-center space-x-12 opacity-50">
            <div className="w-24 h-12 bg-gray-300 rounded"></div>
            <div className="w-24 h-12 bg-gray-300 rounded"></div>
            <div className="w-24 h-12 bg-gray-300 rounded"></div>
            <div className="w-24 h-12 bg-gray-300 rounded"></div>
            <div className="w-24 h-12 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose MockAce?</h2>
            <p className="text-xl text-gray-600">Get the competitive edge with our comprehensive mock interview platform designed for technical roles</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-primary-600" />,
                title: "Expert Mentors",
                description: "Learn from industry professionals at Google, Microsoft, Amazon, and other top companies.",
                features: ["5+ years experience", "Top company backgrounds"]
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-primary-600" />,
                title: "Personalized Feedback",
                description: "Get detailed feedback on your performance with actionable improvement suggestions.",
                features: ["Written reports", "Video recordings"]
              },
              {
                icon: <Calendar className="w-8 h-8 text-primary-600" />,
                title: "Flexible Scheduling",
                description: "Book sessions at your convenience with 24/7 availability.",
                features: ["Weekend slots", "Easy rescheduling"]
              },
              {
                icon: <Code className="w-8 h-8 text-primary-600" />,
                title: "DSA Mastery",
                description: "Master data structures and algorithms with real interview questions.",
                features: ["500+ problems", "Live coding"]
              },
              {
                icon: <Database className="w-8 h-8 text-primary-600" />,
                title: "Data Science Focus",
                description: "Practice ML, statistics, and data analysis interviews.",
                features: ["Case studies", "SQL practice"]
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-primary-600" />,
                title: "Analytics Training",
                description: "Excel in business analytics and data interpretation.",
                features: ["Business cases", "Dashboard creation"]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Start free and upgrade as you grow</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">₹0</div>
              <p className="text-gray-600 mb-6">Perfect to get started</p>
              <ul className="space-y-3 mb-8">
                {["2 Mock Interviews", "Basic Feedback", "Free Resources", "Community Access"].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="w-full btn-secondary block text-center">Get Started Free</Link>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-primary-600 rounded-2xl p-8 text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <div className="text-4xl font-bold mb-2">₹999</div>
              <p className="text-primary-100 mb-6">Per month</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited Mock Interviews", "Detailed Feedback", "Priority Booking", "Video Recordings", "Progress Tracking"].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="w-full bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 block text-center">Start Premium Trial</Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Custom</p>
              <p className="text-gray-600 mb-6">For institutions</p>
              <ul className="space-y-3 mb-8">
                {["Bulk Sessions", "Custom Dashboard", "Analytics Reports", "Dedicated Support"].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full btn-secondary">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="reviews" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from students who landed their dream jobs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Software Engineer at Google",
                quote: "MockAce helped me crack Google's interview! The DSA practice sessions were incredibly realistic and the feedback was spot-on.",
                rating: 5
              },
              {
                name: "Rahul Kumar",
                role: "Data Scientist at Microsoft",
                quote: "The data science mock interviews prepared me perfectly for real scenarios. Got offers from 3 top companies!",
                rating: 5
              },
              {
                name: "Ananya Singh",
                role: "Analytics Manager at Amazon",
                quote: "Amazing platform! The analytics case studies were exactly what I faced in my Amazon interview. Highly recommended!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-xl text-primary-100 mb-8">Join thousands of students who have successfully landed their dream jobs with MockAce</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Start Free Trial - No Credit Card Required
            </Link>
            <button className="btn-secondary text-white border-white hover:bg-white hover:text-primary-600">
              Book Demo Call
            </button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-primary-100">
            <div className="flex items-center">
              <span className="mr-2">🔒</span> SSL Secured
            </div>
            <div className="flex items-center">
              <span className="mr-2">💰</span> Money Back Guarantee
            </div>
            <div className="flex items-center">
              <span className="mr-2">📞</span> 24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MockAce</span>
              </div>
              <p className="text-gray-400 mb-6">Empowering students to ace technical interviews and land their dream jobs</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">DSA Interviews</a></li>
                <li><a href="#" className="hover:text-white">Data Science</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
                <li><a href="#" className="hover:text-white">Free Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2024 MockAce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 