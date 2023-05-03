import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type CalendarFormData = {
  date: Date;
  time: string;
};

const schema = yup.object().shape({
  date: yup.date().required(),
  time: yup.string().required(),
});

export default function CalendarForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CalendarFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: CalendarFormData) => {
    console.log(data);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div>
        <p>Thank you for your submission!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
          Date
        </label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="date"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.date ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.date && (
          <p className="text-red-500 text-xs italic">{errors.date.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="time">
          Time
        </label>
        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="time"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.time ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.time && (
          <p className="text-red-500 text-xs italic">{errors.time.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  );
}