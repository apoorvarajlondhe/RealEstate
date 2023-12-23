import express from "express";
import {
  createResidency,
  getAllResidencies,
  getResidency,
} from "../controller/resiController.js";

const router = express.Router();

router.post("/create", createResidency);
router.get("/allresi", getAllResidencies);
router.get("/:id", getResidency);

export { router as residencyRoute };
