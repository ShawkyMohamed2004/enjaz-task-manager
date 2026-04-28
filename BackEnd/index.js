require("dotenv").config();
require("./passport");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

// Route Imports
const AuthRoutes = require("./Routes/AuthRoutes").router;
const TodoRoutes = require("./Routes/TodoRoutes");
const NoteRoutes = require("./Routes/NoteRoutes");
const TaskRoutes = require("./Routes/TaskRoutes");

const PORT = process.env.PORT || 8080;
const app = express();

// Standard Middlewares
app.set("trust proxy", 1); // Required for secure cookies on Render/Heroku

app.use(cors({ 
  origin: process.env.CLIENT_URL || "http://localhost:3000", 
  credentials: true, 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"] 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Configuration
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "session",
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.json({ status: "Enjaz API is Running", version: "2.0.0" }));

app.use("/", AuthRoutes);
app.use("/todo", TodoRoutes);
app.use("/note", NoteRoutes);
app.use("/task", TaskRoutes);

const { startCronJobs } = require('./cronService');

app.listen(PORT, () => {
  console.log(`Server Running On Port : ${PORT} `);
  startCronJobs(); // Start background cron tasks
});

module.exports = app;
