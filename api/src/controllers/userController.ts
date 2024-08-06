import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { generateToken } from "../utils/token";
import * as UserService from "../services/UserService";

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
      message: "Error logging in.",
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
      message: "Error searching for the user.",
      error: err.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const userUpdated = await UserService.updateUser(req.params.id, req.body);

    res.status(201).json({
      message: "Data updated successfully!",
      userUpdated,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error updating user data.",
      error: err.message,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.params.id);

    res.status(200).json({
      message: "User removed successfully!",
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error removing user.",
      error: err.message,
    });
  }
};
