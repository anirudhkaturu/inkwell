export interface IUser {
  id: string;
  username?: string;
  profilePicture: string;
  phone: string;
  password: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}
