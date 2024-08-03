import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await connect(process.env.DATABASE_URI as string);
    console.log("\x1b[32m✓ MongoDB connected.\x1b[0m\n");
  } catch (error) {
    console.log("\x1b[31mError connecting to the database:\x1b[0m", error);
  }
};

export default connectDB;
