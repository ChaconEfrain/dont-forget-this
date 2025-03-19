import { config, databases } from "@/lib/appwrite";
import { ID, Query } from "react-native-appwrite";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, reminder, latitude, longitude, userEmail, location } = body;

  if (!title || !latitude || !reminder || !longitude || !location) {
    console.log("Missing required fields");
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!userEmail) {
    console.log("User not logged in --> ", userEmail)
    return Response.json({ error: "User not logged in" }, { status: 401 });
  }
  
  const {documents: users} = await databases.listDocuments(
    config.databaseId!,
    config.usersCollectionId!,
    [Query.equal("email", userEmail)]
  );

  if (users.length === 0) {
    console.log("User not found");
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const newReminder = await databases.createDocument(
    config.databaseId!,
    config.locationRemindersCollectionId!,
    ID.unique(),
    {
      title,
      latitude,
      longitude,
      reminder,
      location_name: location,
      user: users[0].$id,
    }
  );

  if (!newReminder) {
    console.log("Failed to create reminder");
    return Response.json({ error: "Failed to create reminder" }, { status: 500 });
  }

  return Response.json({ reminder: newReminder }, { status: 200 });
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const userEmail = params.get("userEmail");

  if (!userEmail) {
    console.log("Missing userEmail");
    return Response.json({ error: "Missing userEmail" }, { status: 400 });
  }

  try {
    const user = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.equal("email", userEmail)]
    );
    
    if (user.documents.length === 0) {
      console.log("User not found");
      return Response.json({ error: "User not found" }, { status: 404 });
    }
  
    const { documents: reminders } = await databases.listDocuments(
      config.databaseId!,
      config.locationRemindersCollectionId!,
      [Query.equal("user", user.documents[0].$id)]
    );
  
    return Response.json({ reminders }, { status: 200 });
  } catch (error) {
    console.log("Error getting normal reminders: ", error);
    return Response.json({ error: "Error getting location reminders" }, { status: 500 });
  }

}