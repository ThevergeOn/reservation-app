import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type FormValues = {
  date: Date;
  time: string;
};

const schema = yup.object().shape({
  date: yup.date().required(),
  time: yup.string().required(),
});

export default function CalendarForm() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [time, setTime] = useState<Date>(new Date());

  const registerTime = ({ onChange, ...rest }) => {
    return (
      <input
        {...rest}
        type="time"
        value={time.toISOString().slice(0, -8)}
        onChange={(e) => {
          const [hour, minute] = e.target.value.split(':');
          const newTime = new Date();
          newTime.setHours(parseInt(hour), parseInt(minute));
          setTime(newTime);
          onChange(newTime);
        }}
      />
    );
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="date">Date</label>
        <Controller
          name="date"
          control={control}
          defaultValue={selectedDate}
          render={({ field }) => (
            <Calendar
              onChange={(date) => {
                field.onChange(date);
                setSelectedDate(date as Date);
              }}
              value={selectedDate}
            />
          )}
        />
        {errors.date && <span>This field is required</span>}
      </div>
      <div>
        <label htmlFor="time">Time</label>
        <Controller name="time" control={control} defaultValue={time} render={({ field }) => registerTime(field)} />
        {errors.time && <span>This field is required</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
