// Script to update mentor specializations
const updateMentor = async () => {
  try {
    console.log('🔄 Updating mentor specializations...')
    
    // First, let's get the mentor
    const response = await fetch('http://localhost:5000/api/mentors')
    const data = await response.json()
    console.log('📊 Mentors:', data)
    
    if (data.success && data.data.mentors.length > 0) {
      const mentor = data.data.mentors[0]
      console.log('👤 Found mentor:', mentor.name)
      
      // Update mentor specializations
      const updateResponse = await fetch(`http://localhost:5000/api/users/${mentor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          specializations: ['DSA'],
          isActive: true
        })
      })
      
      const updateData = await updateResponse.json()
      console.log('📊 Update Response:', updateData)
      
      if (updateData.success) {
        console.log('✅ Mentor updated successfully!')
      } else {
        console.log('❌ Failed to update mentor:', updateData.message)
      }
    } else {
      console.log('❌ No mentors found')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

// Run the update
updateMentor()
