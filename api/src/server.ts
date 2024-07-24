import express from "express";
import connectDB from "./database/mongodb";
import router from "./routes/routes";

const server = express();
const PORT = process.env.PORT || 4000;

server.use("/", router);

server.listen(PORT, () => {
  console.log(`[PORT:${PORT}] \x1b[32mServidor local iniciado.\x1b[0m\n`);
});

console.log("Conectando ao MongoDB...");
// connectDB();
