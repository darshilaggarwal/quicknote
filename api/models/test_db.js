const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/quickchirp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout for debugging
});

mongoose.connection.on("connected", () => {
  console.log("✅ Connected to MongoDB");
  process.exit();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
  process.exit();
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});
