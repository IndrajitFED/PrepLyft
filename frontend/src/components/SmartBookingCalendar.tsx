import React, { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle } from 'lucide-react'

interface AvailableSlot {
  id: string
  date: string
  time: string
}

interface SmartBookingCalendarProps {
  field: string
  onSlotSelect: (slot: AvailableSlot) => void
  loading?: boolean
}

const SmartBookingCalendar: React.FC<SmartBookingCalendarProps> = ({
  field,
  onSlotSelect,
  loading = false
}) => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Filter slots for selected date
  const slotsForSelectedDate = availableSlots.filter(slot => slot.date === selectedDate)
  // Get next 7 days for date selection
  console.log("loading", loading);
  const getNext7Days = () => {
    const days = []
    const today = new Date()
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      })
    }
    return days
  }

  // Fetch available slots for selected date
  const fetchAvailableSlots = async (date: string) => {
    if (!date) return
    
    setFetchingSlots(true)
    setError(null)
    
    try {
      const response = await fetch(`http://localhost:5000/api/smart-booking/available-slots?field=${field}&date=${date}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAvailableSlots(data.data.slots || [])
      } else {
        setError(data.message || 'Failed to fetch available slots')
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      setError('Failed to fetch available slots')
    } finally {
      setFetchingSlots(false)
    }
  }

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    fetchAvailableSlots(date)
  }

  // Handle slot selection
  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot)
    onSlotSelect(slot)
  }

  // Auto-select first date on mount
  useEffect(() => {
    const firstDate = getNext7Days()[0].date
    setSelectedDate(firstDate)
    fetchAvailableSlots(firstDate)
  }, [field])

  const days = getNext7Days()

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Date</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => handleDateSelect(day.date)}
              className={`p-3 text-center border rounded-lg transition-colors ${
                selectedDate === day.date
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">{day.display}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Available Time Slots */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Time Slots</h3>
          
          {fetchingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading available slots...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">{error}</div>
              <button
                onClick={() => fetchAvailableSlots(selectedDate)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Try Again
              </button>
            </div>
          ) : slotsForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No available slots for this date</p>
              <p className="text-sm">Try selecting a different date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {slotsForSelectedDate.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all text-center ${
                    selectedSlot?.id === slot.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{slot.time}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Available
                  </div>
                  
                  {selectedSlot?.id === slot.id && (
                    <div className="flex items-center justify-center text-blue-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Selected Session</h4>
          <div className="text-sm text-blue-800">
            <p><strong>Date:</strong> {new Date(selectedSlot.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Time:</strong> {selectedSlot.time}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartBookingCalendar
