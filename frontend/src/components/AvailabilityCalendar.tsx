import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { sessionAPI } from '../services/api';

interface AvailabilityCalendarProps {
  mentorId: string;
  onTimeSlotSelect: (slot: any) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ 
  mentorId, 
  onTimeSlotSelect 
}) => {
  const [availability, setAvailability] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get availability for next 30 days
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        
        const response = await sessionAPI.getMentorAvailability(mentorId, {
          startDate,
          endDate: endDate.toISOString().split('T')[0]
        });
        
        setAvailability(response.availability);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      }
    };

    fetchAvailability();
  }, [mentorId]);

  // Get available time slots for selected date
  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setLoading(true);
    
    try {
      const response = await sessionAPI.getAvailableTimeSlots(mentorId, date);
      setAvailableSlots(response.availableSlots);
    } catch (error) {
      console.error('Failed to fetch time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Select Date
        </h3>
        
        <div className="grid grid-cols-7 gap-1">
          {/* Calendar header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
          
          {/* Calendar dates */}
          {availability.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateSelect(day.date)}
              className={`
                p-2 text-sm rounded-lg transition-colors
                ${day.isAvailable 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : day.hasPartialAvailability
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-red-100 text-red-800 cursor-not-allowed'
                }
                ${selectedDate === day.date ? 'ring-2 ring-blue-500' : ''}
              `}
              disabled={!day.isAvailable && !day.hasPartialAvailability}
            >
              {new Date(day.date).getDate()}
            </button>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
            Available
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
            Partial Availability
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
            Unavailable
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Available Time Slots
          {selectedDate && (
            <span className="ml-2 text-sm text-gray-500">
              for {new Date(selectedDate).toLocaleDateString()}
            </span>
          )}
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : selectedDate ? (
          <div className="space-y-2">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => onTimeSlotSelect(slot)}
                  className="w-full p-3 text-left bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{slot.time}</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-600">
                    60 minutes
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <XCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No available time slots for this date</p>
                <p className="text-sm">Try selecting another date</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Select a date to see available time slots</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
