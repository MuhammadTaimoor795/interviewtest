const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process with a non-zero status code
  }
};

module.exports = connectToDB;
