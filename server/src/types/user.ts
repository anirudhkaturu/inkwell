export interface IUser {
  id: string;
  username?: string;
  isProfileComplete: boolean;
  profilePicture: string;
  phone: string;
  password: string;
  isVerified: boolean;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
