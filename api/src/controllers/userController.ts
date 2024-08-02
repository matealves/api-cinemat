import { Request, Response } from "express";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User";
import { generateToken, verifyToken } from "../utils/token";
import * as UserService from "../services/UserService";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, lastName, email, password } = req.body;

    if (name && lastName && email && password) {
      const hasUser = await UserService.findByEmail(email);

      if (!hasUser) {
        const newUser = await UserService.createUser(
          name,
          lastName,
          email,
          password
        );

        const token = generateToken({
          id: newUser.id,
          name,
          lastName,
          email,
        });

        res.status(201).json({
          status: true,
          message: "User registered successfully!",
          email,
          id: newUser.id,
          token,
        });
      } else {
        res.status(400).json({
          status: false,
          error: "User already exists.",
        });
      }
    } else {
      res.status(400).json({
        status: false,
        error: "Incomplete data.",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "An error occurred while registering the user.",
      error: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
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

        res.json({
          status: true,
          userLogged: {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
          },
          token,
        });
        return;
      } else {
        res.status(404).json({
          status: false,
          message: "Usuário e/ou senha inválidos.",
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
      message: "Ocorreu algum erro ao fazer login.",
      error: err.message,
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const data = await User.find().select("name lastName email");

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao listar os usuários.",
      error: err.message,
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = await User.findById(id);

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao buscar o usuário.",
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

    const userUpdated = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(201).json({
      message: "Dados atualizados com sucesso!",
      userUpdated,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao atualizar dados do usuário.",
      error: err.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await User.deleteOne({ _id: id });

    res.status(200).json({
      message: "Usuário removido com sucesso!",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Ocorreu algum erro ao remover o usuário.",
      error: err.message,
    });
  }
};
