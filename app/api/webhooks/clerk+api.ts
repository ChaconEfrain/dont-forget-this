import { config, databases } from '@/lib/appwrite';
import { UserEvent } from '@/types/clerk';
import { ID, Query } from 'react-native-appwrite';
import { Webhook } from 'svix';

const WEBHOOK_SECRET = process.env.EXPO_PUBLIC_CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = new Headers(req.headers);
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  console.log('headers -->', headerPayload);

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET!);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as UserEvent;
  } catch (err) {
    console.error('Error verificando el webhook:', err);
    return Response.json({ message: 'Firma inválida' }, { status: 400 });
  }

  // Maneja el evento según su tipo
  if (evt.type === 'user.created') {
    const user = evt.data;
    console.log('Usuario creado:', user)
    console.log('Usuario creado:', user.email_addresses?.[0]?.email_address)
    const userExists = await databases.listDocuments(
      config.databaseId!,
      config.usersCollectionId!,
      [Query.equal("email", user.email_addresses?.[0]?.email_address)]
    );

    if (userExists.documents.length === 0) {
      const email = user.email_addresses?.[0]?.email_address;
      const name = `${user.first_name} ${user.last_name}`;
      const newUser = await databases.createDocument(
        config.databaseId!,
        config.usersCollectionId!,
        ID.unique(),
        {
          name,
          email
        }
      );
  
      if (!newUser) throw new Error("Failed to create user on users collection");
    }
  }

  return Response.json({ message: 'Webhook procesado correctamente' });
}