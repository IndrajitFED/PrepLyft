// Simple script to add a test mentor
const addTestMentor = async () => {
  try {
    console.log('🧪 Adding test mentor...')
    
    const mentorData = {
      name: 'Test Mentor',
      email: 'test.mentor@example.com',
      password: 'Password123',
      role: 'mentor',
      specializations: ['DSA'],
      averageRating: 4.5,
      experience: 3,
      company: 'Test Company',
      isActive: true,
      isVerified: true
    }
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mentorData)
    })
    
    const data = await response.json()
    console.log('📊 Register Response:', data)
    
    if (data.success) {
      console.log('✅ Test mentor added successfully!')
    } else {
      console.log('❌ Failed to add mentor:', data.message)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run the test
addTestMentor()
