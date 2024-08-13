import { Router } from "express";

import * as UserController from "../controllers/userController";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.get("/", UserController.list);
router.get("/:id", UserController.getOne);

router.put("/:id", UserController.update);

router.delete("/:id", UserController.remove);

export default router;
