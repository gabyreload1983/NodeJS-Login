import express from "express";
import mongoose from "mongoose";
import authRoutes from "../routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { requireAuth, checkUser } from "../middleware/auth.js";

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection

if (!process.env.MONGO_URL) {
  console.log("FATAL ERROR: MONGO_URL is not defined...");
  process.exit(1);
}

const MONGO_URL = process.env.MONGO_URL;
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Connected to mongoDB...");

    if (!process.env.JWT) {
      console.log("FATAL ERROR: JWT is not defined...");
      process.exit(1);
    } else {
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`Listening on port ${port}...`));
    }
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/gallery", requireAuth, (req, res) => res.render("gallery"));
app.use(authRoutes);

// Production
import "../prod.js";
