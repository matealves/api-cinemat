import { Schema, model, Model, connection } from "mongoose";
import { MovieType } from "../types/movie";

const SentsSchema = new Schema(
  {
    number: { type: Number, required: true },
    reserved: { type: Boolean, required: true, default: false },
  },
  { _id: false } // Define como esquemas de subdocumentos, sem um campo _id
);

const SchedulesSchema = new Schema(
  {
    hour: { type: String, required: true },
    room: { type: Number, required: true },
    sents: { type: [SentsSchema], required: true },
  },
  { _id: false }
);

const MovieSchema = new Schema<MovieType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    schedules: { type: [SchedulesSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export default connection && connection.models["Movie"]
  ? (connection.models["Movie"] as Model<MovieType>)
  : model<MovieType>("Movie", MovieSchema);