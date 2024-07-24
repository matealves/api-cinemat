import { Router } from "express";

import { Auth } from "../middlewares/auth";
import * as UserController from "../controllers/userController";

const router = Router();

// test
router.get("/ping", (req, res) => {
  return res.json({ pong: true });
});

// router.post("/register", userController.register);
// router.post("/login", userController.login);

// router.get("/home", Auth.private, userController.list);

export default router;
