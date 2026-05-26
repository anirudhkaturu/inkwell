import { type IOnboardingPending } from "../types/onboardingPending.js";
import mongoose from "mongoose";

const OnboardingPendingSchema = new mongoose.Schema<IOnboardingPending>({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
    index: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 24,
    match: [
      /^[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, dots and underscores",
    ],
  },

  bio: {
    type: String,
    maxLength: 150,
    default: "",
    trim: true,
  },

  profilePicture: {
    type: String,
    default: "",
  },

  onboardingStage: {
    type: String,
    enum: ["", "username", "bio", "pfp"],
    default: ""
  }
}, { timestamps: true });

export const OnboardingPending = mongoose.model<IOnboardingPending>("OnboardingPending", OnboardingPendingSchema);
