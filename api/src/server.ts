import express from "express";
import path from "path";
import dotenv from "dotenv";

import connectDB from "./database/mongodb";
import userRoutes from "./routes/user.routes";
import moviesRoutes from "./routes/movies.routes";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 4000;

server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());

// Test route
server.use("/ping", (req, res) => {
  return res.json({ pong: true });
});
// Routes
server.use("/users", userRoutes);
server.use("/movies", moviesRoutes);

server.listen(PORT, () => {
  console.log(`[PORT:${PORT}] \x1b[32mServer running...\x1b[0m`);
});

console.log("Connecting to MongoDB...");
connectDB();
