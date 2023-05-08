import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Calendar from "react-calendar";
import { isWeekend, addHours, isAfter } from "date-fns";
import "react-calendar/dist/Calendar.css";

interface ReservationFormData {
  name: string;
  date: Date;
  fromTime: Date;
  toTime: Date;
}

const MINIMUM_RESERVATION_HOURS = 1;
const MAXIMUM_RESERVATION_HOURS = 14;
const WORKDAY_START_HOUR = 9;
const WORKDAY_END_HOUR = 17;
const DISABLED_DAYS = [0, 6]; // Sunday and Saturday are disabled
const MAX_RESERVATIONS_PER_DAY = 1;

export default function ReservationForm() {
  const { register, handleSubmit } = useForm<ReservationFormData>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reservedDates, setReservedDates] = useState<Date[]>([]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const isDisabledDate = (date: Date) => {
    return (
      isWeekend(date) ||
      isAfter(date, addHours(new Date(), MAXIMUM_RESERVATION_HOURS))
    );
  };

  const isDisabledTime = (date: Date) => {
    const hour = date.getHours();
    return hour < WORKDAY_START_HOUR || hour >= WORKDAY_END_HOUR;
  };

  const isReservationValid = (formData: ReservationFormData) => {
    const reservationsForSelectedDate = reservedDates.filter(
      (date) =>
        date.getFullYear() === selectedDate.getFullYear() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getDate() === selectedDate.getDate()
    );

    if (reservationsForSelectedDate.length >= MAX_RESERVATIONS_PER_DAY) {
      return false;
    }

    const reservationStartTime = formData.fromTime.getTime();
    const reservationEndTime = formData.toTime.getTime();

    if (
      reservationStartTime < new Date().getTime() ||
      reservationStartTime >= reservationEndTime
    ) {
      return false;
    }

    const reservationDurationInHours =
      (reservationEndTime - reservationStartTime) / 3600000;

    return (
      reservationDurationInHours >= MINIMUM_RESERVATION_HOURS &&
      reservationDurationInHours % MINIMUM_RESERVATION_HOURS === 0 &&
      reservationEndTime <= addHours(selectedDate, WORKDAY_END_HOUR - reservationEndTime.getHours())
    );
  };

  const onSubmit = (formData: ReservationFormData) => {
    if (isReservationValid(formData)) {
      const { name, date, fromTime, toTime } = formData;
      const reservationDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        fromTime.getHours(),
        0,
        0,
        0
      );
      setReservedDates([...reservedDates, reservationDate]);
      console.log({ name, date: reservationDate, fromTime, toTime });
    }
  };
 
