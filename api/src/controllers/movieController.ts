import { Request, Response } from "express";

import { getRandomNumber } from "../utils/getRandomNumber";
import { generateRandomTimes } from "../utils/generateRandomTimes";

import { Schedules, Sents } from "../types/movie";
import Movie from "../models/Movie";

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description, poster } = req.body;

    if (name && description && poster) {
      const newMovie = new Movie();
      newMovie.name = name;
      newMovie.description = description;
      newMovie.poster = poster;

      const schedules = (count: number): Schedules[] => {
        const items = [];
        const hours = generateRandomTimes(count);

        while (items.length < count) {
          items.push({
            hour: hours[items.length],
            room: getRandomNumber(1, 12),
            sents: Array.from(
              { length: 60 },
              (_, index): Sents => ({
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
