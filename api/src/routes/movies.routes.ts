import { Router } from "express";

import { Auth } from "../middlewares/auth";
import * as MovieController from "../controllers/movieController";

const router = Router();

router.post("/", MovieController.create);

router.get("/", Auth.private, MovieController.list);

// router.put("/:id", MovieController.update);

// router.delete("/:id", MovieController.remove);


export default router;