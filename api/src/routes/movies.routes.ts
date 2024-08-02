import { Router } from "express";

import { Auth } from "../middlewares/auth";
import * as MovieController from "../controllers/movieController";

const router = Router();

router.post("/", MovieController.create);
// router.post("/sents/:id", Auth.private, MovieController.sents);
router.post("/sents", MovieController.sents);

router.get("/", MovieController.list);
router.get("/:id", MovieController.getOne);
router.get("/schedules/:id", MovieController.schedules);

router.put("/:id", MovieController.update);

router.delete("/:id", MovieController.remove);

export default router;
