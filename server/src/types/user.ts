export interface IUser {
  id: string;
  username?: string;
  profilePicture: string;
  phone: string;
  password: string;
  bio: string;
  // onboarding field
  onboardingDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}
