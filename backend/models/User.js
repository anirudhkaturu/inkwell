import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  }, 
  email: {
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid Email"]
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    maxlength: 150,
    trim: true,
    default: ""
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  pfp: {
    type: String,
    default: ""
  }
}, { timestamps: true });

// autohash passwords
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// check password
userSchema.methods.comparePassword = async function(pwd) {
  return bcrypt.compare(pwd, this.password);
};

// setting email as index
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
