import express from "express";
import {
  addFavorite,
  bookVisit,
  cancelBooking,
  createUser,
  getAllBookings,
  getAllFavorites,
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/bookVisit/:id", bookVisit);
router.post("/allBookings", getAllBookings);
router.post("/removeBooking/:id", cancelBooking);
router.post("/toFavorite/:resiId", addFavorite);
router.post("/allFavorites", getAllFavorites);

export { router as userRoute };
