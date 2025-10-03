import React, { useMemo, useState } from "react";

type RangeItem = { start: string; end: string; label?: string };

interface Props {
  bookedRanges?: RangeItem[]; // highlighted as booked
  cancelledRanges?: RangeItem[]; // highlighted as cancelled
  bookedClass?: string; // tailwind classes for booked days (default blue)
  cancelledClass?: string; // tailwind classes for cancelled days (default red)
  onDayClick?: (dateISO: string) => void;
  initialMonth?: string; // "YYYY-MM" or ISO Date string
}

const toDate = (isoOrStr: string | Date) => {
  const d =
    typeof isoOrStr === "string" ? new Date(isoOrStr + "T00:00:00") : isoOrStr;
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatISO = (d: Date) => d.toISOString().slice(0, 10);

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const isSameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

const inRange = (d: Date, start: Date, end: Date) => {
  return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
};

const normalizeRanges = (ranges?: RangeItem[]) =>
  (ranges || []).map((r) => {
    const s = toDate(r.start);
    const e = toDate(r.end);
    // ensure order
    return s <= e
      ? { start: s, end: e, label: r.label }
      : { start: e, end: s, label: r.label };
  });

const BookingCalendar: React.FC<Props> = ({
  bookedRanges,
  cancelledRanges,
  bookedClass = "bg-[#29ABE226] border-[1px] border-[#29ABE280]",
  cancelledClass = "bg-red-100 text-red-800",
  onDayClick,
  initialMonth,
}) => {
  const today = useMemo(() => {
    const d = initialMonth ? new Date(initialMonth + "-01") : new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [initialMonth]);

  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  const booked = useMemo(() => normalizeRanges(bookedRanges), [bookedRanges]);
  const cancelled = useMemo(
    () => normalizeRanges(cancelledRanges),
    [cancelledRanges]
  );

  const startOfMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
    [currentMonth]
  );
  const endOfMonth = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
    [currentMonth]
  );

  // calendar grid start from Monday (change offset if you prefer Sunday)
  const startDayOffset = (startOfMonth.getDay() + 6) % 7; // convert Sun(0) -> 6, Mon(1)->0
  const totalDays = endOfMonth.getDate();

  const gridDays = useMemo(() => {
    const days: Date[] = [];
    // include leading blanks by starting negative offset
    for (let i = -startDayOffset; i < totalDays; i++) {
      days.push(addDays(startOfMonth, i));
    }
    // ensure full weeks (fill to 7*n)
    while (days.length % 7 !== 0) days.push(addDays(startOfMonth, days.length));
    return days;
  }, [startOfMonth, startDayOffset, totalDays]);

  const findRange = (d: Date, ranges: { start: Date; end: Date }[]) => {
    for (const r of ranges) {
      if (inRange(d, r.start, r.end)) {
        const isStart = isSameDay(d, r.start);
        const isEnd = isSameDay(d, r.end);
        return { range: r, isStart, isEnd };
      }
    }
    return null;
  };

  const prevMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  return (
    <div className="w-full max-w-[480px] h-[420px] bg-white rounded-3xl p-4 shadow-custom-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {currentMonth.toLocaleString(undefined, { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            ◀
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm text-gray-500 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {gridDays.map((day, idx) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const bookedHit = findRange(day, booked);
          const cancelledHit = findRange(day, cancelled);

          // cancelled has priority visually
          const stateClass = cancelledHit
            ? cancelledClass
            : bookedHit
            ? bookedClass
            : "bg-transparent text-gray-700";

          // rounding for range ends
          const roundedLeft =
            (bookedHit && bookedHit.isStart) ||
            (cancelledHit && cancelledHit.isStart)
              ? "rounded-md"
              : "";
          const roundedRight =
            (bookedHit && bookedHit.isEnd) ||
            (cancelledHit && cancelledHit.isEnd)
              ? "rounded-md"
              : "";

          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={idx}
              onClick={() => onDayClick && onDayClick(formatISO(day))}
              className={`h-12 p-0 relative flex items-center justify-center text-sm ${
                isCurrentMonth ? "opacity-100" : "opacity-40"
              } ${isToday ? "ring-1 ring-blue-200 rounded-md" : ""}`}
              aria-pressed={!!(bookedHit || cancelledHit)}
            >
              <div
                className={`w-full h-full flex items-center justify-center ${stateClass} ${roundedLeft} ${roundedRight}`}
                title={formatISO(day)}
              >
                <span
                  className={`${
                    bookedHit || cancelledHit ? "font-medium" : ""
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
