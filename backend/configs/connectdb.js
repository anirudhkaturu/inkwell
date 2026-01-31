import mongoose from "mongoose";

export default async function connectDB(connection_string) {
  if (!connection_string) {
    return null;
  }
  
  return mongoose.connect(connection_string)
}
