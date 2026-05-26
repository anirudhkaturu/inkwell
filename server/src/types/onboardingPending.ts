import mongoose from "mongoose";

export interface IOnboardingPending {
  id: string;
  phone: string;
  password: string;
  username: string;
  bio: string;
  profilePicture: string;
  onboardingStage: string;
  createdAt: Date;
  updatedAt: Date;
}
