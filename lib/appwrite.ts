import { Client, Account, Avatars, Databases, OAuthProvider, ID, Query } from 'react-native-appwrite';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';

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

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success") throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    // Create user on users collection
    const user = await account.get();
    const userExists = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.equal("email", user.email)]
    );

    if (userExists.documents.length === 0) {
      const newUser = await databases.createDocument(
        config.databaseId!,
        config.usersCollectionId!,
        ID.unique(),
        {
          name: user.name,
          email: user.email,
        }
      );
  
      if (!newUser) throw new Error("Failed to create user on users collection");
    }


    return session;
  } catch (error) {
    console.error(error);
    return false;
  }
}
  
export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    console.log('result --> ', result)
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}