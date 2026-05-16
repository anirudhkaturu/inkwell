export interface IUser {
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
