import { Router } from "express";

import { Auth } from "../middlewares/auth";
import * as MovieController from "../controllers/movieController";

const router = Router();

router.post("/", MovieController.create);
router.post("/seats/:id", Auth.private, MovieController.seats);
// router.post("/seats/:id", MovieController.seats);

router.get("/", MovieController.list);
router.get("/:id", MovieController.getOne);
router.get("/schedules/:id", MovieController.schedules);
router.get("/shopping/:email", Auth.private, MovieController.shopping);
// router.get("/shopping/:email", MovieController.shopping);

router.put("/:id", MovieController.update);
router.put("/tickets/:id", Auth.private, MovieController.buyTickets);
// router.put("/tickets/:id", MovieController.buyTickets);

router.delete("/:id", MovieController.remove);

export default router;
