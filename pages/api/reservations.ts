import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  if (req.method === "POST") {
    const { name, startTime, endTime } = req.body;

    // Check if the requested reservation time is valid
    if (
      new Date(startTime).getHours() < 9 ||
      new Date(startTime).getHours() >= 17 ||
      new Date(endTime).getHours() >= 12 ||
      new Date(startTime) >= new Date(endTime)
    ) {
      return res.status(400).json({ message: "Invalid reservation time" });
    }

    // Check if the requested reservation collides with an existing reservation
    const collidingReservation = await prisma.reservation.findFirst({
      where: {
        NOT: [
          { endTime: { lte: new Date(startTime) } },
          { startTime: { gte: new Date(endTime) } },
        ],
      },
    });

    if (collidingReservation) {
      return res.status(409).json({
        message: "Reservation time conflicts with an existing reservation",
      });
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        name,
        startTime,
        endTime,
      },
    });

    return res.status(201).json(reservation);
  } else if (req.method === "GET") {
    const reservations = await prisma.reservation.findMany();

    return res.status(200).json(reservations);
  } else if (req.method === "PUT") {
    const { id, name, start, end } = req.body;
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { name, start, end },
    });
    res.status(200).json(reservation);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    await prisma.reservation.delete({ where: { id } });
    res.status(204).end();
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

