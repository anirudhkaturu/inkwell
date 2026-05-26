import mongoose from "mongoose";
import { type IUser } from "../types/user.js";

const userSchema = new mongoose.Schema<IUser>(
  {
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

    profilePicture: {
      type: String,
      default: "",
    },

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

    bio: {
      type: String,
      maxLength: 150,
      default: "",
      trim: true
    },

    onboardingDone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
