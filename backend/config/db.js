const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("connecting....");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
