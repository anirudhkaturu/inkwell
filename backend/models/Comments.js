import mongoose, { mongo } from "mongoose";

const commentsSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    trim: true, 
    minlength: 1, 
    maxlenght: 300,
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
    default: null
  }
}, { timestamps: true });

commentsSchema.index({post: 1, createdAt: -1});
commentsSchema.index({parentComment: 1, createdAt: 1});

export default mongoose.model("Comments", commentsSchema);
