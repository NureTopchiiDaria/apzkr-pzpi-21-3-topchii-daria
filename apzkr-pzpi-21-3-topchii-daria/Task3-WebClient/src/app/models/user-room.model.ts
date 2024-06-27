import { Room } from "./room";

export interface UserRoom {
  userId: string;
  roomId: string;
  isAdmin: boolean;
  joinDate: Date;
  room: Room;
}
