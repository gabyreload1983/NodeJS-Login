const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/auth");
const config = require("config");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection

if (!config.get("db")) {
  console.log("FATAL ERROR: db is not defined...");
  process.exit(1);
}

const db = config.get("db");
const dbURI = `mongodb+srv://${db}@cluster0.4hbz9.mongodb.net/node-auth`;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("Connected to mongoDB...");

    if (!config.get("jwtPrivateKey")) {
      console.log("FATAL ERROR: jwtPrivateKey is not defined...");
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
require("./prod")(app);
