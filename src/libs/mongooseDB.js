// libs/mongooseDB.js
const mongoose = require("mongoose");

const connectToDB = async () => {
  if (mongoose.connection.readyState) {
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToDB;
