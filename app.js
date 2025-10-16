const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { createUsersTable } = require("./models/userModel");

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api", userRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await createUsersTable();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
