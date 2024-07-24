import express from "express";
import path from "path";
import dotenv from "dotenv";

import connectDB from "./database/mongodb";
import routes from "./routes/routes";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 4000;

server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());

server.use("/", routes);


server.listen(PORT, () => {
  console.log(`[PORT:${PORT}] \x1b[32mServidor local iniciado.\x1b[0m\n`);
});

console.log("Conectando ao MongoDB...");
connectDB();
