const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error); // <-- print full error
    process.exit(1);
  }
};

module.exports = connectDB;
