import React, { useState } from "react";
import Calendar from "react-calendar";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

interface ReservationFormData {
  name: string;
  email: string;
  date: Date | null;
}

const ReservationCalendar: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<ReservationFormData>({
    mode: "onChange",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const onSubmit = (data: ReservationFormData) => {
    alert(
      `Reservation for ${data.name} (${data.email}) on ${format(
        selectedDate as Date,
        "MM/dd/yyyy"
      )} submitted!`
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Reservation Calendar</h1>
      <form
        className="flex flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mb-4">
          Name:
          <input
            type="text"
            className="border-gray-400 border-2 rounded-md p-2 ml-2"
            {...register("name", { required: true })}
          />
        </label>
        <label className="mb-4">
          Email:
          <input
            type="email"
            className="border-gray-400 border-2 rounded-md p-2 ml-2"
            {...register("email", { required: true })}
          />
        </label>
        <label className="mb-4">
          Date:
          <Calendar
            className="border-gray-400 border-2 rounded-md p-2 ml-2"
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!formState.isValid || !selectedDate}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReservationCalendar;