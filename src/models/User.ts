import { Schema, model, Model, connection } from "mongoose";
import { UserType } from "../types/user";

const schema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default connection && connection.models["User"]
  ? (connection.models["User"] as Model<UserType>)
  : model<UserType>("User", schema);
