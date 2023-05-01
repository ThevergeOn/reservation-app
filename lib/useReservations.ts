import { useState, useEffect } from "react";
import { Reservation as ReservationType } from "./types";

type UseReservationsReturnType = {
  reservations: ReservationType[];
  createReservation: (reservation: ReservationType) => void;
  updateReservation: (reservation: ReservationType) => void;
  deleteReservation: (reservation: ReservationType) => void;
};

export default function useReservations(): UseReservationsReturnType {
  const [reservations, setReservations] = useState<ReservationType[]>([]);

  const fetchReservations = async () => {
    const res = await fetch("/api/reservations");
    const data = await res.json();
    setReservations(data);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const createReservation = async (reservation: ReservationType) => {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });
    const data = await res.json();
    setReservations([...reservations, data]);
  };

  const updateReservation = async (reservation: ReservationType) => {
    const res = await fetch("/api/reservations", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });
    const data = await res.json();
    setReservations(reservations.map((r) => (r.id === data.id ? data : r)));
  };

  const deleteReservation = async (reservation: ReservationType) => {
    const res = await fetch("/api/reservations", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: reservation.id }),
    });
    if (res.status === 204) {
      setReservations(reservations.filter((r) => r.id !== reservation.id));
    }
  };

  return {
    reservations,
    createReservation,
    updateReservation,
    deleteReservation,
  };
}
