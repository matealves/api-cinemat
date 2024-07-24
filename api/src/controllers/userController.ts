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
          id: newUser.id,
          message: "Usuário cadastrado com sucesso!",
          token,
        });
      } else {
        // res.json({ error: "E-mail já existe." });
        // res.json({ error: "E-mail já existe." });
        throw new Error("Usuário já existe.");
      }
    } else {
      // res.json({ error: "Dados obrigatórios não enviados." });
      throw new Error("Dados obrigatórios não enviados.");
    }
  } catch (err) {
    res.json({ error: err ? err : "Ocorreu algum erro ao registrar usuário." });
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
