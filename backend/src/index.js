require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const vinRoutes = require("./routes/vin.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const app = express();

app.use(express.json());

const allowedOrigins = ["https://ethiovin.senaycreatives.com/", "https://ethiovin.netlify.app/"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // The origin is in the allowlist!
    } else {
      callback(new Error("Not allowed by CORS")); // Block it
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 3. Apply the middleware to your app
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

connectDB();

app.use("/api/vin", vinRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
