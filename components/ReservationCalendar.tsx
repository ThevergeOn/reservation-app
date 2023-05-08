import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { set, add, differenceInHours, isAfter, isBefore } from 'date-fns';
import { useForm } from 'react-hook-form';

interface Reservation {
  name: string;
  from: Date;
  to: Date;
}

interface ReservationFormData {
  name: string;
  from: number;
  to: number;
}

const workDays = [1, 2, 3, 4, 5]; // Workdays are Monday to Friday
const workStartHour = 9; // Workday starts at 9 AM
const workEndHour = 17; // Workday ends at 5 PM
const maxReservationEndHour = 11; // Maximum reservation end hour is 11 AM next workday

const ReservationForm = () => {
  const { register, handleSubmit, formState } = useForm<ReservationFormData>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const onSubmit = (data: ReservationFormData) => {
    const { name, from, to } = data;
    const fromTime = new Date(selectedDate!.setHours(from));
    const toTime = new Date(selectedDate!.setHours(to));
    const reservation = { name, from: fromTime, to: toTime };
    setReservations([...reservations, reservation]);
    setSelectedDate(null);
  };

  const isWorkday = (date: Date) => workDays.includes(date.getDay());

  const isPastDate = (date: Date) => isBefore(date, new Date());

  const isReservationColliding = (from: Date, to: Date) =>
    reservations.some(
      (reservation) =>
        reservation.from <= from &&
        reservation.to >= from &&
        reservation.from <= to &&
        reservation.to >= to
    );

  const isReservationValid = (from: Date, to: Date) => {
    const reservationDuration = differenceInHours(to, from);
    const isDurationValid = reservationDuration > 0 && reservationDuration % 1 === 0;
    const isWithinWorkday = from.getHours() >= workStartHour && to.getHours() <= workEndHour;
    const isNotPast = !isPastDate(from) && !isPastDate(to);
    const isNotColliding = !isReservationColliding(from, to);
    const isWithinMaxEndHour =
      to.getHours() < maxReservationEndHour ||
      (to.getHours() === maxReservationEndHour && to.getMinutes() === 0 && to.getSeconds() === 0);
    return isDurationValid && isWithinWorkday && isNotPast && isNotColliding && isWithinMaxEndHour;
  };

  const getReservationsForDate = (date: Date) =>
    reservations.filter(
      (reservation) =>
        reservation.from.getFullYear() === date.getFullYear() &&
        reservation.from.getMonth() === date.getMonth() &&
        reservation.from.getDate() === date.getDate()
    );

  const onDateClick = (date: Date) => {
    if (isWorkday(date) && !isPastDate(date)) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? '12' : `${hours % 12}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-2/3">
        <h1 className="mb-4 text-2xl font-bold">Car Rental Reservation</h1>
        <div className="flex flex-col md:flex-row">
          <div className="mb-8 md:mb-0 md:mr-8">
            <Calendar
              onClickDay={onDateClick}
              tileContent={({ date, view }) => {
                if (view === 'month' && isWorkday(date)) {
                  const reservationsForDate = getReservationsForDate(date);
                  return (
                    <div className="text-center text-sm">
                      {reservationsForDate.map((reservation, index) => (
                        <div key={index}>{`${reservation.name} - ${formatDate(
                          reservation.from
                        )} → ${formatDate(reservation.to)}`}</div>
                      ))}
                    </div>
                  );
                }
              }}
            />
          </div>
          <div className="flex-grow">
            <form onSubmit={handleSubmit(onSubmit)} disabled={formState.isSubmitting}>
              <div className="mb-4">
                <label className="block font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  {...register('name', { required: true })}
                  disabled={!selectedDate}
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" htmlFor="from">
                  From
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  {...register('from', { required: true })}
                  disabled={!selectedDate}
                >
                  {Array.from({ length: workEndHour - workStartHour + 1 }, (_, i) => i + workStartHour).map(
                    (hour) => (
                      <option key={hour} value={hour}>
                        {formatDate(set(selectedDate!, { hours: hour }))}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" htmlFor="to">
                  To
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  {...register('to', { required: true })}
                  disabled={!selectedDate}
                >
                  {Array.from(
                    { length: workEndHour - workStartHour + 2 },
                    (_, i) => i + workStartHour - 1
                  ).map((hour) => {
                    const date = set(selectedDate!, { hours: hour });
                    return isReservationValid(add(date, { hours: 1 }), date) ? (
                      <option key={hour} value={hour}>
                        {formatDate(date)}
                      </option>
                    ) : null;
                  })}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={!selectedDate || formState.isSubmitting}
                >
                  Reserve
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;