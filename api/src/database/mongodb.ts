import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await connect(process.env.DATABASE_URI as string);
    console.log("\x1b[32m✓ Conexão com o banco de dados.\x1b[0m");
  } catch (error) {
    console.log("\x1b[31mErro na conexão com o banco:\x1b[0m", error);
  }
};

export default connectDB;
