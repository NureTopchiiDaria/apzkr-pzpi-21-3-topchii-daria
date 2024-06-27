export interface CreateRoom {
  userId: string;
  name: string;
  isApproved: boolean;
  startLocation: number[];  // Array to match expected format
  endLocation: number[];    // Array to match expected format
  tripLength: number;
  dateTime: string;
  information: string;
}
