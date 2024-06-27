export interface Room {
  id: string;
  name: string;
  isApproved: boolean;
  startLocation: number[];  // Array to match expected format
  endLocation: number[]; 
  tripLength: number;
  dateTime: string;
  information: string;
}
