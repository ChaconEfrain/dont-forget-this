import { LocationReminder } from '@/types/reminder';
import * as Linking from 'expo-linking'

interface LocationReminderParams {
  title: string;
  latitude: number;
  longitude: number;
  location: string;
  reminder: string;
  userEmail: string;
}

const FETCH_URL = '/api/location-reminder';

export async function createLocationReminder({title, latitude, longitude, reminder, userEmail, location}: LocationReminderParams) {
  const body = JSON.stringify({
    title,
    latitude,
    longitude,
    location,
    reminder,
    userEmail
  })

  
  try {
    console.log('body --> ', body)
    const response = await fetch(FETCH_URL, {
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

export async function getLocationsReminders(userEmail: string) {
  const url = `${FETCH_URL}?userEmail=${userEmail}`

  console.log('url --> ', url)
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error('Error getting location reminders');

    const {reminders} = await response.json()
    return reminders as LocationReminder[]
  } catch (error) {
    console.error(error)
    return null
  }
}