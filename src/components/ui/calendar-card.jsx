import React from "react";
import { Typography, IconButton } from "@/components/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export function CalendarCard() {
  const [activeDate, setActiveDate] = React.useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
  const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });

  const today = new Date();
  const startOfMonth = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1);
  const endOfMonth = new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startWeekday = (startOfMonth.getDay() + 6) % 7; // Monday=0

  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(activeDate.getFullYear(), activeDate.getMonth(), d));

  const goPrev = () => {
    const d = new Date(activeDate);
    d.setMonth(d.getMonth() - 1);
    setActiveDate(d);
  };
  const goNext = () => {
    const d = new Date(activeDate);
    d.setMonth(d.getMonth() + 1);
    setActiveDate(d);
  };

  const weekdays = Array.from({ length: 7 }).map((_, i) => {
    const base = new Date(2024, 0, 1 + i);
    const label = weekdayFormatter.format(base);
    return label.slice(0, 2);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Typography variant="small" color="blue-gray" className="font-semibold">
          {monthFormatter.format(activeDate)}
        </Typography>
        <div className="flex items-center gap-1">
          <IconButton variant="text" color="blue-gray" onClick={goPrev}>
            <ChevronLeftIcon className="h-4 w-4" />
          </IconButton>
          <IconButton variant="text" color="blue-gray" onClick={goNext}>
            <ChevronRightIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekdays.map((w) => (
          <Typography key={w} variant="small" className="text-[11px] font-medium text-blue-gray-500">
            {w}
          </Typography>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} className="h-8" />;
          const isToday =
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
          return (
            <div
              key={date.toISOString()}
              className={`h-8 grid place-items-center rounded-md text-sm ${
                isToday ? "bg-blue-gray-900 text-white" : "hover:bg-blue-gray-50 text-blue-gray-700"
              }`}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarCard;

