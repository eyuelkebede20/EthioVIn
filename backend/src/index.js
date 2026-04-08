require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const vinRoutes = require("./routes/vin.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// 1. Allowed Origins (Strictly NO trailing slashes)
const allowedOrigins = [
  "https://ethiovin.senaycreatives.com",
  "http://localhost:5173", // For local Vite frontend testing
  "http://localhost:3000", // For other local frontend setups
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // DO NOT return new Error(). It causes a 500 status code.
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200, // Explicitly force 200 for preflight
};
// 2. Apply Middleware
// Best practice: Apply CORS before any other routing or body parsing
app.use(cors(corsOptions));
app.use(express.json());

// 3. Connect to Database
connectDB();

// 4. Routes
app.get("/", (req, res) => {
  res.send("EthioVIN API is running 🚀");
});

app.use("/api/vin", vinRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// 5. Start Server
// Added a fallback port (5000) just in case process.env.PORT is undefined
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
