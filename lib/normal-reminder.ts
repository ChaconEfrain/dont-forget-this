import { NormalReminder } from "@/types/reminder";

interface NormalReminderParams {
  title: string;
  datetime: Date;
  reminder: string;
  userEmail: string;
}

const FETCH_URL = '/api/normal-reminder';

export async function createNormalReminder({ title, datetime, reminder, userEmail }: NormalReminderParams) {
 
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

export async function getNormalReminders(userEmail: string) {
  const url = `${FETCH_URL}?userEmail=${userEmail}`

  console.log('url --> ', url)
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error('Error getting location reminders');

    const {reminders} = await response.json()
    return reminders as NormalReminder[]
  } catch (error) {
    console.error(error)
    return null
  }
}