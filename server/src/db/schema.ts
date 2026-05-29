import { usersTable, type IUser, type NewUser } from "./schemas/Users.js";
import { postsTable, type IPost, type NewPost } from "./schemas/Posts.js";
import { followsTable, type IFollow, type NewFollow } from "./schemas/Follows.js";
import { likesTable, type ILike, type NewLike } from "./schemas/Likes.js";

export {
  usersTable,
  type IUser,
  type NewUser,
  
  postsTable, 
  type IPost,
  type NewPost,

  followsTable,
  type IFollow, 
  type NewFollow,

  likesTable,
  type ILike, 
  type NewLike,
}
