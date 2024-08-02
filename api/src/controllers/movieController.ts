import { Request, Response } from "express";

import { getRandomNumber } from "../utils/getRandomNumber";
import { generateRandomTimes } from "../utils/generateRandomTimes";

import { ScheduleType, SentType } from "../types/movie";
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
            sents: Array.from(
              { length: 60 },
              (_, index): SentType => ({
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

export const sents = async (req: Request, res: Response) => {
  try {
    const { idMovie, hour } = req.body;

    if (idMovie && hour) {
      const movie = await Movie.findById(idMovie).select(
        "name schedules poster"
      );

      if (movie) {
        const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        const hourValidation = regex.test(hour);

        if (hourValidation) {
          const item = movie.schedules.find((item) => item.hour === hour);

          const data = {
            nameMovie: movie.name,
            poster: movie.poster,
            hour,
            room: item?.room,
            sents: item?.sents,
          };

          res.status(200).json({
            data,
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Horário inválido.",
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
