// Simple test script for smart booking API
const testSmartBooking = async () => {
  try {
    console.log('🧪 Testing Smart Booking API...')
    
    // Test available slots endpoint
    const response = await fetch('http://localhost:5000/api/smart-booking/available-slots?field=DSA&date=2025-09-15', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    })
    
    const data = await response.json()
    console.log('📊 Available Slots Response:', data)
    
    if (data.success) {
      console.log('✅ Available slots endpoint working!')
      console.log(`📅 Found ${data.data.slots.length} available slots`)
    } else {
      console.log('❌ Available slots endpoint failed:', data.message)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testSmartBooking()
