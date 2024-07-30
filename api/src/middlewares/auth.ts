import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Auth = {
  private: async (req: Request, res: Response, next: NextFunction) => {
    let success = false;
    const authorization = req.headers.authorization;

    if (authorization) {
      const [authType, token] = authorization.split(" ");

      if (authType === "Bearer" && token) {
        try {
          const decoded = JWT.verify(
            token,
            process.env.JWT_SECRET_KEY as string
          );

          success = !!decoded;
        } catch (error) {}
      }
    }

    if (success) {
      next();
    } else {
      res.status(403);
      res.json({ error: "Não autorizado." });
    }
  },
};
