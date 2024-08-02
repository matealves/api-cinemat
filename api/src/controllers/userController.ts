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
      message: "Error registering user.",
      error: err.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await UserService.authentication(email, password);

      if (user) {
        const token = generateToken({
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
        });

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
      } else {
        res.status(403).json({
          status: false,
          message: "Invalid username and/or password.",
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
      message: "Error when logging in.",
      error: err.message,
    });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const data = await UserService.getAll();

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error listing users.",
      error: err.message,
    });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const data = await UserService.findById(req.params.id);

    res.status(200).json({
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error when searching for the user.",
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
