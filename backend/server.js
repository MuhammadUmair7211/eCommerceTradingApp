const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// DB + seed
const connectDB = require("./config/db");
const createLeader = require("./seed/createLeader");

const app = express();

// ========================
// MIDDLEWARE
// ========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mercadolibreonline.shop",
      "https://www.mercadolibreonline.shop",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ========================
// ROUTES
// ========================

// Auth & Users
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Payments
const paymentRoutes = require("./routes/paymentRoutes");

// Leader
const leaderRoutes = require("./routes/leaderRoutes");

// Admin
const adminRoutes = require("./routes/adminRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");

// Others
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const injectionRoutes = require("./routes/injectionRoutes");
const supportRoutes = require("./routes/supportRoutes");

// ========================
// ROUTE MOUNTING
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/leader", leaderRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/injections", injectionRoutes);
app.use("/api/support", supportRoutes);

// ========================
// TEST ROUTE
// ========================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

// ========================
// DB CONNECT + SEED
// ========================
connectDB()
  .then(async () => {
    console.log("MongoDB Connected");

    // safer seed (should ideally check if exists inside function)
    await createLeader("admin", "mypassword123");
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err.message);
  });

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
