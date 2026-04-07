require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const vinRoutes = require("./routes/vin.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const app = express();
app.use(cors());
// Trust proxy is required if you are hosting behind a load balancer (like Vercel/Render) to get the real IP
app.set("trust proxy", true);
const corsOptions = {
  origin: "https://ethiovin.netlify.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

connectDB();

app.use("/api/vin", vinRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
