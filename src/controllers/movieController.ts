import { Request, Response } from "express";

import * as MovieService from "../services/MovieService";
import * as UserService from "../services/UserService";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description, poster } = req.body;

    if (name && description && poster) {
      const newMovie = await MovieService.createMovie(
        name,
        description,
        poster
      );

      res.status(201).json({
        status: true,
        message: "Movie added successfully!",
        data: newMovie,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Incomplete data.",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Error inserting film.",
      error: err.message,
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const data = await MovieService.getAll();

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error listing films.",
      error: err.message,
    });
  }
};

export const schedules = async (req: Request, res: Response) => {
  try {
    const movie = await MovieService.getSchedulesById(req.params.id);

    if (movie) {
      type Data = {
        nameMovie: string;
        poster: string;
        schedules: string[];
      };

      const data: Data = {
        nameMovie: movie.name,
        poster: movie.poster,
        schedules: [],
      };

      movie.schedules.map((item) => {
        return data.schedules.push(item.hour);
      });

      res.status(200).json({
        data,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Error listing movie times.",
      error: err.message,
    });
  }
};

export const seats = async (req: Request, res: Response) => {
  try {
    const hour = req.body.hour;

    if (hour) {
      const movie = await MovieService.getSchedulesById(req.params.id);

      if (movie) {
        const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        const hourValidation = regex.test(hour);

        if (hourValidation) {
          const item = movie.schedules.find((item) => item.hour === hour);

          if (!item) {
            return res.status(404).json({
              status: false,
              message: "404 - time not found.",
            });
          }

          const data = {
            nameMovie: movie.name,
            poster: movie.poster,
            hour,
            room: item.room,
            seats: item.seats,
          };

          res.status(200).json({
            data,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Invalid time.",
          });
        }
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Incomplete data.",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Error listing the seats in the room.",
      error: err.message,
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const data = await MovieService.findById(req.params.id);

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error searching for the movie.",
      error: err.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const movieUpdated = await MovieService.updateMovie(
      req.params.id,
      req.body
    );

    res.status(201).json({
      message: "Data updated successfully!",
      movieUpdated,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error updating movie data.",
      error: err.message,
    });
  }
};

export const buyTickets = async (req: Request, res: Response) => {
  try {
    const { hour, seatTickets, user } = req.body;

    if (hour && seatTickets && user) {
      const findUser = UserService.findByEmail(user);

      if (!findUser) {
        return res.status(404).json({
          status: false,
          message: "404 - user not found.",
        });
      }

      const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
      const hourValidation = regex.test(hour);

      if (!hourValidation) {
        return res.status(400).json({
          status: false,
          message: "Invalid time.",
        });
      }

      const movie = await MovieService.getSchedulesById(req.params.id);

      if (movie) {
        const item = movie.schedules.find((item) => item.hour === hour);

        if (!item) {
          return res.status(404).json({
            status: false,
            message: "404 - time not found.",
          });
        }

        let shouldUpdate = false;

        // Validar disponibilidade dos assentos
        for (const ticket of seatTickets) {
          const findSeat = item.seats.find((seat) => seat.number === ticket);

          if (findSeat) {
            if (findSeat.reserved) {
              return res.status(409).json({
                status: false,
                message: "Seat unavailable!",
              });
            } else {
              shouldUpdate = true;
            }
          } else {
            return res.status(404).json({
              status: false,
              message: "404- seat not found.",
            });
          }
        }

        const reserved = [];

        // Reservar assentos após validação
        if (shouldUpdate) {
          for (const ticket of seatTickets) {
            const seat = item.seats.find((seat) => seat.number === ticket);

            if (seat) {
              seat.reserved = true;
              seat.user = user;
              reserved.push(seat);
            }
          }

          await movie.save();

          res.status(201).json({
            status: true,
            message: "Seats reserved successfully!",
            nameMovie: movie.name,
            hour: item.hour,
            room: item.room,
            seatsReserved: reserved,
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "404 - movie not found.",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Incomplete data.",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Error buy movie tickets.",
      error: err.message,
    });
  }
};

export const shopping = async (req: Request, res: Response) => {
  try {
    const findUser = await UserService.findByEmail(req.params.email);

    if (!findUser) {
      return res.status(404).json({
        status: false,
        message: "404 - user not found.",
      });
    }

    const data = await MovieService.getMoviesByUserEmail(req.params.email);

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error listing purchases from this user.",
      error: err.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await MovieService.deleteMovie(req.params.id);

    res.status(200).json({
      message: "Movie removed successfully!",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error removing the film.",
      error: err.message,
    });
  }
};
