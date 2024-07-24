import { Router } from "express";

// import * as SeatController from "../controllers/seatController";

const router = Router();

// test
router.get("/ping", (req, res) => {
  return res.json({ pong: true });
});

// router.get("/seats", SeatController.getSeats);

export default router;
