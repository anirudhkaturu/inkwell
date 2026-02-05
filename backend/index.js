import express from "express";
import dotenv from "dotenv";
import connectDB from "./configs/connectdb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import checkLogin from "./middlewares/auth.middleware.js";

// routers
import authRouter from "./routes/auth.route.js";
import postsRouter from "./routes/posts.route.js"
import profileRouter from "./routes/profile.route.js"

dotenv.config();
const PORT = process.env.PORT;
const app = express();

// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser())
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({"message": "welcome to inkwell"});
});

app.use("/api/auth", authRouter);
app.use("/api/posts", checkLogin, postsRouter);
app.use("/api/profile", checkLogin, profileRouter);

connectDB(process.env.MONGODB_URI)
.then(() => {
  console.log("MongoDB Successfully Connected");
  app.listen(PORT, () => {
    console.log(`Server as started on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.log("Error ", err);
});
