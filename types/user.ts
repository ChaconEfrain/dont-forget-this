import { Models } from "react-native-appwrite";

export type User = Models.Document & {
  name: string;
  email: string;
}