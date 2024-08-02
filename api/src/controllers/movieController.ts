import { Request, Response } from "express";

import { getRandomNumber } from "../utils/getRandomNumber";
import { generateRandomTimes } from "../utils/generateRandomTimes";

import { ScheduleType, SeatType } from "../types/movie";
import Movie from "../models/Movie";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description, poster } = req.body;

    if (name && description && poster) {
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
              })
            ),
          });
        }

        return items;
      };

      newMovie.schedules = schedules(3);
      await newMovie.save();

      res.status(201).json({
        status: true,
        message: "Filme adicionado com sucesso!",
        data: newMovie,
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Dados obrigatórios não enviados.",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao insetir filme.",
      error: err.message,
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const data = await Movie.find().select("name description poster");

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao listar os filmes.",
      error: err.message,
    });
  }
};

export const schedules = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findById(id).select("name schedules poster");

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
      const schedules = movie.schedules;

      schedules.map((item) => {
        return data.schedules.push(item.hour);
      });

      res.status(200).json({
        data,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao listar os horários do filme.",
      error: err.message,
    });
  }
};

export const seats = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { hour } = req.body;

    if (hour) {
      const movie = await Movie.findById(id).select("name schedules poster");

      if (movie) {
        const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        const hourValidation = regex.test(hour);

        if (hourValidation) {
          const item = movie.schedules.find((item) => item.hour === hour);

          if (!item) {
            return res.status(404).json({
              status: false,
              message: "404 - horário não encontrado.",
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
            message: "Horário inválido.",
          });
        }
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Dados obrigatórios não enviados.",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao listar as poltronas da sala.",
      error: err.message,
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await Movie.findById(id);

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao buscar o filme.",
      error: err.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const updateData = {
      ...body,
      $inc: { __v: 1 },
    };

    const userUpdated = await Movie.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(201).json({
      message: "Dados atualizados com sucesso!",
      userUpdated,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao atualizar dados do filme.",
      error: err.message,
    });
  }
};

export const buyTickets = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { hour, seatTickets } = req.body;

    if (hour && seatTickets) {
      const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
      const hourValidation = regex.test(hour);

      if (!hourValidation) {
        return res.status(400).json({
          status: false,
          message: "Horário inválido.",
        });
      }

      const movie = await Movie.findById(id).select("name schedules");

      if (movie) {
        const item = movie.schedules.find((item) => item.hour === hour);

        if (!item) {
          return res.status(404).json({
            status: false,
            message: "404 - horário não encontrado.",
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
                message: "Assento indisponível!",
              });
            } else {
              shouldUpdate = true;
            }
          } else {
            return res.status(404).json({
              status: false,
              message: "404- assento não encontrado.",
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
              reserved.push(seat);
            }
          }

          await movie.save();

          res.status(201).json({
            status: true,
            message: "Assentos reservados com sucesso!",
            nameMovie: movie.name,
            hour: item.hour,
            room: item.room,
            seatsReserved: reserved,
          });
        }
      } else {
        res.status(404).json({
          status: false,
          message: "404 - filme não encontrado.",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: "Dados obrigatórios não enviados.",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao reservar entradas para o filme.",
      error: err.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Movie.deleteOne({ _id: id });

    res.status(200).json({
      message: "Filme removido com sucesso!",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao remover o filme.",
      error: err.message,
    });
  }
};
