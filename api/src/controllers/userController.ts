import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (name && lastName && email && password) {
      const hasUser = await User.findOne({ email: email });

      if (!hasUser) {
        const newUser = await User.create({
          name,
          lastName,
          email,
          password,
        });

        const token = JWT.sign(
          {
            id: newUser.id,
            name: newUser.name,
            lastName: newUser.lastName,
            email: newUser.email,
          },
          process.env.JWT_SECRET_KEY as string,
          { expiresIn: "2h" }
        );

        res.status(201);
        res.json({
          status: true,
          message: "Usuário cadastrado com sucesso!",
          email,
          id: newUser.id,
          token,
        });
      } else {
        res.status(400).json({ error: "Usuário já existe." });
      }
    } else {
      res.status(400).json({ error: "Dados obrigatórios não enviados." });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao registrar usuário.",
      error: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  if (req.body.email && req.body.password) {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await User.findOne({ email, password });

    if (user) {
      const token = JWT.sign(
        {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "2h" }
      );

      res.json({ status: true, token });
      return;
    }
  }

  res.json({ status: false });
};
