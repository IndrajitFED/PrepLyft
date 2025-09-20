export const formatAvailability = (
  calendarAvailability: any,
  existingBookings: any[],
  workingHours: any
) => {
  const availability = [];
  const startDate = new Date(calendarAvailability.timeMin);
  const endDate = new Date(calendarAvailability.timeMax);

  // Generate dates for the range
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if date has any conflicts
    const hasConflicts = calendarAvailability.busy.some((busy: any) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return date >= busyStart && date <= busyEnd;
    });

    // Check existing bookings
    const dayBookings = existingBookings.filter(booking => 
      booking.date === dateStr
    );

    availability.push({
      date: dateStr,
      isAvailable: !hasConflicts && dayBookings.length === 0,
      hasPartialAvailability: hasConflicts || dayBookings.length > 0,
      conflicts: hasConflicts ? 'Calendar blocked' : null,
      existingBookings: dayBookings.length
    });
  }

  return availability;
};

export const generateAvailableTimeSlots = (
  date: string,
  workingHours: any,
  calendarEvents: any[],
  existingBookings: any[]
) => {
  const slots = [];
  const startHour = workingHours?.start || 9; // 9 AM
  const endHour = workingHours?.end || 17; // 5 PM
  const slotDuration = 60; // 60 minutes

  // Generate time slots for the day
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);
      
      const slotEnd = new Date(slotTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

      // Check if slot conflicts with Google Calendar
      const hasCalendarConflict = calendarEvents.some(event => {
        const eventStart = new Date(event.start.dateTime);
        const eventEnd = new Date(event.end.dateTime);
        return slotTime < eventEnd && slotEnd > eventStart;
      });

      // Check if slot conflicts with existing bookings
      const hasBookingConflict = existingBookings.some(booking => {
        const bookingStart = new Date(`${date}T${booking.time}`);
        const bookingEnd = new Date(bookingStart.getTime() + (booking.duration * 60000));
        return slotTime < bookingEnd && slotEnd > bookingStart;
      });

      if (!hasCalendarConflict && !hasBookingConflict) {
        slots.push({
          time: slotTime.toTimeString().slice(0, 5),
          startTime: slotTime.toISOString(),
          endTime: slotEnd.toISOString(),
          isAvailable: true
        });
      }
    }
  }

  return slots;
};

export const checkSessionAvailability = async (Session: any, sessionData: any) => {
  const existingSession = await Session.findOne({
    mentorId: sessionData.mentorId,
    date: sessionData.date,
    time: sessionData.time,
    status: { $in: ['confirmed', 'pending'] }
  });
  
  return !existingSession; // Available if no existing session
};
