export async function createNormalReminder(title: string, datetime: Date, reminder: string, userEmail: string) {
  const body = JSON.stringify({
    title,
    datetime,
    reminder,
    userEmail
  })

  
  try {
    console.log('body --> ', body)
    const response = await fetch('/api/normal-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body
    })

    if (!response.ok) throw new Error('Error creating normal reminder');

    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}