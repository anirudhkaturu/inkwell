import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    minlength: 1,
    maxlength: 5000,
    required: true,
    trim: true
  },
  likes: {
    type: Number,
    min: 0,
    default: 0,
  }
}, { timestamps: true });

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model("Post", postSchema);
