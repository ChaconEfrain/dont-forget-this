import { User } from "./user";

export interface LocationReminder {
  $id: string;
  title: string;
  latitude: number;
  longitude: number;
  location_name: string;
  reminder: string;
  user: User;
}

export interface NormalReminder {
  $id: string;
  title: string;
  datetime: Date;
  reminder: string;
  user: User;
}