import { Client, Databases } from 'react-native-appwrite';

export const config = {
  platform: 'com.efrain.dontforgetthis',
  apiKey: process.env.EXPO_PUBLIC_APPWRITE_API_KEY,
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  normalRemindersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_NORMAL_REMINDERS_COLLECTION_ID,
  locationRemindersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_LOCATION_REMINDERS_COLLECTION_ID,
}

const client = new Client()
  .setProject(config.projectId!)
  .setPlatform(config.platform)
  .setEndpoint(config.endpoint!)

export const databases = new Databases(client);