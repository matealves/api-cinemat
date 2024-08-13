import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";

export const Auth = {
  private: async (req: Request, res: Response, next: NextFunction) => {
    let success = false;
    const authorization = req.headers.authorization;

    if (authorization) {
      const [authType, token] = authorization.split(" ");

      if (authType === "Bearer" && token) {
        const decoded = verifyToken(token);
        success = !!decoded;
      }
    }

    if (success) {
      next();
    } else {
      res.status(401);
      res.json({ error: "401 - Unauthorized." });
    }
  },
};
