// user.model.ts
export interface UserModel {
    id: string;
    userName: string;
    email: string;
    hashedPassword: string;
    isActive: boolean;
    height: number;
    sex: boolean;
    birthDate: Date;
    information: string;
    profilePicture: string; // Assume base64 string for simplicity
  }
  