import { ScheduleType, SeatType } from "../types/movie";

import { getRandomNumber } from "../utils/getRandomNumber";
import { generateRandomTimes } from "../utils/generateRandomTimes";

import Movie from "../models/Movie";
// .lean() converte os documentos em objetos JavaScript puros

export const findById = async (id: string) => {
  return await Movie.findById(id).lean();
};

export const getAll = async () => {
  return await Movie.find().select("name description poster").lean();
};

export const getSchedulesById = async (id: string) => {
  return await Movie.findById(id).select("name schedules poster");
};

export const getMoviesByUserEmail = async (email: string) => {
  const movies = await Movie.find().lean();

  const filteredMovies = movies
    .map((movie) => {
      const filteredSchedules = movie.schedules
        .map((schedule) => {
          const filteredSeats = schedule.seats.filter(
            (seat) => seat.reserved && seat.user === email
          );
          return filteredSeats.length
            ? { ...schedule, seats: filteredSeats }
            : null;
        })
        .filter((schedule) => schedule !== null);

      return filteredSchedules.length
        ? { ...movie, schedules: filteredSchedules }
        : null;
    })
    .filter((movie) => movie !== null);

  return filteredMovies ?? [];
};

export const deleteMovie = async (id: string) => {
  return await Movie.deleteOne({ _id: id });
};

export const createMovie = async (
  name: string,
  description: string,
  poster: string
) => {
  const newMovie = new Movie();
  newMovie.name = name;
  newMovie.description = description;
  newMovie.poster = poster;

  const schedules = (count: number): ScheduleType[] => {
    const items = [];
    const hours = generateRandomTimes(count);

    while (items.length < count) {
      items.push({
        hour: hours[items.length],
        room: getRandomNumber(1, 12),
        seats: Array.from(
          { length: 60 },
          (_, index): SeatType => ({
            number: index + 1,
            reserved: false,
            user: null,
          })
        ),
      });
    }

    return items;
  };

  newMovie.schedules = schedules(3);
  await newMovie.save();

  return newMovie;
};

export const updateMovie = async (id: string, data: object) => {
  const updateData = {
    ...data,
    $inc: { __v: 1 },
  };

  return await Movie.findByIdAndUpdate(id, updateData, {
    new: true,
  });
};
