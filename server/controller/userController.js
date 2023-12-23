import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

//API for creating a user
export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user...");

  let { email } = req.body;

  console.log(email);

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });

    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else {
    res.status(201).send({
      message: "User already registered",
    });
  }
});

//function to book a visit to residency
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res.status(400).json({ message: "This resi is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("Your visit booked successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to cancel a booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);

      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });

      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to add residency to favorites
export const addFavorite = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { resiId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user.favResidenciesId.includes(resiId)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesId: {
            set: user.favResidenciesId.filter((id) => id !== resiId),
          },
        },
      });

      res.send({ message: "Removed from favourites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesId: {
            push: resiId,
          },
        },
      });

      res.send({ message: "Updated favourites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

//function to get all the favorite residencies
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const favResi = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesId: true },
    });
    res.status(200).send(favResi);
  } catch (err) {
    throw new Error(err.message);
  }
});
