import React from 'react'
import { Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Careers: React.FC = () => {
  const openPositions = [
    {
      id: 1,
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote / Bangalore',
      type: 'Full-time',
      experience: '5+ years',
      salary: '₹20L - ₹35L',
      description: 'We are looking for an experienced Full Stack Engineer to join our team and help build the next generation of interview preparation tools.',
      requirements: [
        '5+ years of experience in full-stack development',
        'Expertise in React, Node.js, TypeScript',
        'Experience with cloud platforms (AWS/GCP)',
        'Strong problem-solving and communication skills'
      ]
    },
    {
      id: 2,
      title: 'Technical Interview Mentor',
      department: 'Mentorship',
      location: 'Remote',
      type: 'Part-time / Contract',
      experience: '3+ years',
      salary: 'Competitive',
      description: 'Join our network of expert mentors and help candidates prepare for technical interviews at top tech companies.',
      requirements: [
        '3+ years of industry experience at top tech companies',
        'Strong coding and problem-solving skills',
        'Excellent communication and teaching abilities',
        'Passion for helping others succeed'
      ]
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      location: 'Hybrid / Bangalore',
      type: 'Full-time',
      experience: '4+ years',
      salary: '₹18L - ₹30L',
      description: 'Lead product strategy and execution for our interview preparation platform, working closely with engineering and design teams.',
      requirements: [
        '4+ years of product management experience',
        'Experience with B2C SaaS products',
        'Strong analytical and strategic thinking',
        'Excellent cross-functional collaboration skills'
      ]
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote / Bangalore',
      type: 'Full-time',
      experience: '3+ years',
      salary: '₹12L - ₹20L',
      description: 'Design beautiful and intuitive user experiences for our platform, making interview preparation accessible and engaging.',
      requirements: [
        '3+ years of UX/UI design experience',
        'Proficiency in Figma, Sketch, or Adobe XD',
        'Strong portfolio showcasing user-centered design',
        'Experience with design systems and prototyping'
      ]
    }
  ]

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Competitive Salary',
      description: 'We offer competitive compensation packages based on your experience and skills.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Work Hours',
      description: 'Work-life balance is important to us. We offer flexible working hours and remote work options.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Career Growth',
      description: 'Opportunities for professional development, mentorship, and career advancement.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Great Team',
      description: 'Collaborate with talented individuals who are passionate about making a difference.'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building the future of interview preparation. Join us in helping thousands of candidates
            achieve their career dreams.
          </p>
        </div>

        {/* Why Work With Us Section */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position) => (
              <div key={position.id} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{position.type}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        <span>{position.experience}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{position.salary}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{position.description}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        {position.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Apply Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg shadow-lg p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See a Role That Fits?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. 
            Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Careers

