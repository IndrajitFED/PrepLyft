import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Code, Database, BarChart3, Cpu, Users, CreditCard, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import SmartBookingCalendar from '../components/SmartBookingCalendar'

// TypeScript interfaces
declare global {
  interface Window {
    Razorpay: any
  }
}

interface FieldOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  price?: number
}

interface SessionConfig {
  field: string
  name: string
  price: number
  description: string
}

interface AssignedMentor {
  mentorId: string
  mentorName: string
  mentorEmail: string
  currentLoad: number
  specialization: string[]
}

interface AvailableSlot {
  id: string
  date: string
  time: string
}

const BookingPage: React.FC = () => {
  const [selectedField, setSelectedField] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<'field' | 'payment' | 'booking'>('field')
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false)
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null)
  const [assignedMentor, setAssignedMentor] = useState<AssignedMentor | null>(null)
  const [fieldOptions, setFieldOptions] = useState<FieldOption[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [bookingLoading, setBookingLoading] = useState<boolean>(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false)
  const navigate = useNavigate()

  // Icon mapping for different fields
  const getFieldIcon = (fieldId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'DSA': <Code className="w-8 h-8" />,
      'Data Science': <Database className="w-8 h-8" />,
      'Analytics': <BarChart3 className="w-8 h-8" />,
      'System Design': <Cpu className="w-8 h-8" />,
      'Behavioral': <Users className="w-8 h-8" />
    }
    return iconMap[fieldId] || <Code className="w-8 h-8" />
  }

  const getFieldColor = (fieldId: string) => {
    const colorMap: { [key: string]: string } = {
      'DSA': 'bg-blue-500',
      'Data Science': 'bg-green-500',
      'Analytics': 'bg-purple-500',
      'System Design': 'bg-orange-500',
      'Behavioral': 'bg-pink-500'
    }
    return colorMap[fieldId] || 'bg-blue-500'
  }

  // Fetch session types and pricing from backend
  const fetchSessionTypes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pricing/sessions')
      const data = await response.json()
      
      if (data.success) {
        const options: FieldOption[] = data.data.sessionTypes.map((session: any) => ({
          id: session.id,
          name: session.name,
          description: session.description,
          icon: getFieldIcon(session.id),
          color: getFieldColor(session.id),
          price: session.price
        }))
        setFieldOptions(options)
      }
    } catch (error) {
      console.error('Error fetching session types:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch available mentors for a field
  const fetchAvailableMentors = async (field: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mentor-assignment/available/${field}`)
      const data = await response.json()
      
      if (data.success && data.data.mentors.length > 0) {
        // Get the first available mentor (load balanced)
        const mentor = data.data.mentors[0]
        setAssignedMentor({
          mentorId: mentor.mentorId,
          mentorName: mentor.mentorName,
          mentorEmail: mentor.mentorEmail,
          currentLoad: mentor.currentLoad,
          specialization: mentor.specialization
        })
      }
    } catch (error) {
      console.error('Error fetching available mentors:', error)
    }
  }

  const handleFieldSelect = async (fieldId: string) => {
    setSelectedField(fieldId)
    setCurrentStep('payment')
    // Fetch available mentors for this field
    await fetchAvailableMentors(fieldId)
  }

  // Handle slot selection from smart calendar
  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot)
    // Mentor will be assigned automatically by backend
    setAssignedMentor(null)
  }

  // Book session with selected slot
  const handleBookSession = async () => {
    if (!selectedSlot) return

    setBookingLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/smart-booking/book-smart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          field: selectedField,
          scheduledDate: selectedSlot.date,
          time: selectedSlot.time,
          duration: 60, // Default 60 minutes
          price: sessionConfig?.price || 999
        })
      })

      const data = await response.json()
      
      if (data.success) {
        console.log('Session booked successfully:', data)
        // Redirect to candidate dashboard with success message
        navigate('/dashboard', { 
          state: { 
            bookingSuccess: true,
            sessionId: data.data.sessionId,
            mentorName: data.data.session.mentorName,
            scheduledDate: selectedSlot.date,
            time: selectedSlot.time
          }
        })
      } else {
        console.error('Failed to book session:', data.message)
        alert('Failed to book session. Please try again.')
      }
    } catch (error) {
      console.error('Error booking session:', error)
      alert('Error booking session. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  // Fetch session types on component mount
  useEffect(() => {
    fetchSessionTypes()
  }, [])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully')
      console.log('Razorpay object available:', !!window.Razorpay)
      setRazorpayLoaded(true)
    }
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script')
    }
    
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Create payment order
  const createPaymentOrder = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currency: 'INR',
          field: selectedField
        })
      })
      
      const data = await response.json()
      console.log('Payment order response:', data)
      
      // Store session config for later use
      if (data.data.sessionConfig) {
        setSessionConfig(data.data.sessionConfig)
      }
      
      return data.data.orderId
    } catch (error) {
      console.error('Error creating payment order:', error)
      throw error
    }
  }

  // Handle payment
  const handlePayment = async () => {
    try {
      setPaymentLoading(true)
      
      console.log('Starting payment process...')
      console.log('Razorpay available:', !!window.Razorpay)
      
      // Wait for Razorpay to be available
      if (!razorpayLoaded || !window.Razorpay) {
        console.error('Razorpay not loaded yet, please wait...')
        alert('Payment system is loading, please try again in a moment.')
        setPaymentLoading(false)
        return
      }
      
      const orderId = await createPaymentOrder()
      console.log('Order ID received:', orderId)
      
      const options = {
        key: "rzp_test_RCoLR9QellVUtF", // Your Razorpay Key ID
        amount: sessionConfig?.price ? sessionConfig.price * 100 : 99900, // Amount in paise
        currency: 'INR',
        name: 'Interview Booking',
        description: `${sessionConfig?.name || selectedField} Session Booking`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyResponse.json()
            
            if (verifyData.success) {
              console.log('Payment verified successfully:', verifyData)
              setPaymentSuccess(true)
              setCurrentStep('booking')
            } else {
              console.error('Payment verification failed:', verifyData)
              alert('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            console.error('Error verifying payment:', error)
            alert('Payment verification failed. Please contact support.')
          } finally {
            setPaymentLoading(false)
          }
        },
        prefill: {
          name: 'User Name', // You can get this from user context
          email: 'user@example.com', // You can get this from user context
          contact: '9999999999'
        },
        theme: {
          color: '#039BE5'
        },
        modal: {
          ondismiss: function() {
            setPaymentLoading(false)
          }
        }
      }

      console.log('Payment options:', options)
      
      if (!window.Razorpay) {
        throw new Error('Razorpay not loaded')
      }
      
      const razorpay = new window.Razorpay(options)
      console.log('Opening Razorpay modal...')
      razorpay.open()
      
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
              </button>
            <h1 className="text-xl font-semibold text-gray-900">Book a Session</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Field Selection */}
        {currentStep === 'field' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Select Your Area of Interest</h2>
            <p className="text-gray-600 mb-6">
              Choose the field you'd like to focus on during your session. Our expert mentors will be assigned based on your selection.
            </p>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading session types...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldOptions.map((field) => (
                  <div
                    key={field.id}
                    onClick={() => handleFieldSelect(field.id)}
                    className="bg-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${field.color} text-white p-3 rounded-lg flex-shrink-0`}>
                        {field.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{field.name}</h3>
                          <span className="text-lg font-bold text-green-600">₹{field.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{field.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
        )}

        {/* Step 2: Payment */}
        {currentStep === 'payment' && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Complete Payment</h2>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <CreditCard className="w-12 h-12 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {sessionConfig?.name || selectedField} Session
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete your payment to proceed with booking
                </p>
                  </div>
                  
              {/* Session Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{sessionConfig?.name || selectedField} Session</h4>
                    <p className="text-sm text-gray-600">{sessionConfig?.description || '1-on-1 mentoring session'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₹{sessionConfig?.price || 999}</p>
                    <p className="text-sm text-gray-600">per session</p>
                  </div>
                </div>
                  </div>
                  
              {/* Assigned Mentor Info */}
              {assignedMentor && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Your Assigned Mentor</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {assignedMentor.mentorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{assignedMentor.mentorName}</p>
                      <p className="text-sm text-gray-600">
                        Specializes in: {assignedMentor.specialization.join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Current load: {assignedMentor.currentLoad} sessions
                      </p>
                  </div>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <div className="text-center">
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading || !razorpayLoaded}
                  className={`
                    bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg
                    transition-colors duration-200 flex items-center justify-center mx-auto
                    ${paymentLoading || !razorpayLoaded ? 'opacity-75 cursor-not-allowed' : ''}
                  `}
                >
                  {paymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : !razorpayLoaded ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Loading Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ₹{sessionConfig?.price || 999} & Continue
                    </>
                  )}
                </button>
              </div>

              {/* Payment Methods Info */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Supports UPI, Cards, Net Banking, Wallets</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Smart Booking Calendar */}
        {currentStep === 'booking' && paymentSuccess && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Choose Your Time Slot</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Payment Successful! 🎉
                </h3>
                <p className="text-gray-600 mb-4">
                  Your {selectedField} session is confirmed. Now choose your preferred time slot and mentor.
                </p>
              </div>
              
              {/* Smart Booking Calendar */}
              <SmartBookingCalendar
                field={selectedField}
                onSlotSelect={handleSlotSelect}
                loading={bookingLoading}
              />
              
              {/* Selected Slot Summary and Book Button */}
              {selectedSlot && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Selected Session Details</h4>
                  <div className="text-sm text-blue-800">
                    <p><strong>Date:</strong> {new Date(selectedSlot.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p><strong>Time:</strong> {selectedSlot.time}</p>
                    <p><strong>Field:</strong> {selectedField}</p>
                    <p className="text-xs text-blue-600 mt-2">
                      A qualified mentor will be automatically assigned to your session
                    </p>
                  </div>
                  
                  <div className="mt-4 flex justify-center space-x-4">
                    <button
                      onClick={handleBookSession}
                      disabled={bookingLoading}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      {bookingLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Booking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Change Selection
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-6 text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> Your session will be automatically confirmed with the selected mentor. 
                    You'll receive a meeting link and calendar invite once the booking is processed.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStep('field')
                      setSelectedField('')
                      setSessionConfig(null)
                      setPaymentSuccess(false)
                      setSelectedSlot(null)
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Book Another Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">How It Works</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Select your area of interest and complete payment</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Choose from available time slots with our expert mentors</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>View mentor profiles, ratings, and specializations before booking</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Confirm your booking and receive instant confirmation with meeting details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage