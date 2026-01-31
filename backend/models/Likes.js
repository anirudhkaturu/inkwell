import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
    post: {
        type: moongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

likesSchema.index({ user:1, post:1 }, { unique: true });
likesSchema.index({ post: 1});

export default moongoose.model("Likes", likesSchema);