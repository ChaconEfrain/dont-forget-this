export async function createLocationReminder(title: string, latitude: number, longitude: number, reminder: string, userEmail: string) {
  const body = JSON.stringify({
    title,
    latitude,
    longitude,
    reminder,
    userEmail
  })

  
  try {
    console.log('body --> ', body)
    const response = await fetch('/api/location-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body
    })

    if (!response.ok) throw new Error('Error creating location reminder');

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}