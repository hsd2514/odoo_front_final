// DateRangePicker.jsx
// Lightweight inline date range picker (no external deps)

import React, { useMemo, useState } from 'react';

function startOfMonth(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toDate(value) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d;
}

const DayCell = ({ day, inCurrentMonth, isSelected, inRange, isStart, isEnd, onSelect }) => {
  const base = 'w-9 h-9 grid place-items-center rounded-md cursor-pointer select-none text-sm';
  const textClass = inCurrentMonth ? 'text-neutral-800' : 'text-neutral-400';
  let bg = 'hover:bg-neutral-100';
  if (inRange) bg = 'bg-neutral-100';
  if (isSelected) bg = 'bg-black text-white hover:bg-black';
  if (isStart || isEnd) bg = 'bg-black text-white';
  return (
    <button className={`${base} ${textClass} ${bg}`} onClick={() => onSelect(day)}>
      {day.getDate()}
    </button>
  );
};

const DateRangePicker = ({ start, end, onChange, className = '' }) => {
  const startDate = toDate(start);
  const endDate = toDate(end);
  const [view, setView] = useState(startOfMonth(startDate || new Date()));

  const weeks = useMemo(() => {
    const first = startOfMonth(view);
    const firstDayIdx = first.getDay(); // 0..6
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - firstDayIdx);
    const days = [];
    for (let i = 0; i < 42; i += 1) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }
    return Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7));
  }, [view]);

  const handleSelect = (d) => {
    if (!startDate || (startDate && endDate)) {
      // Starting new selection or resetting
      onChange({ start: d, end: undefined });
      return;
    }
    
    // Selecting end date - ensure it's after start date
    if (d <= startDate) {
      // If selected date is before or equal to start date, swap them
      onChange({ start: d, end: startDate });
    } else {
      // Normal case: end date after start date
      onChange({ start: startDate, end: d });
    }
  };

  const monthLabel = view.toLocaleString('default', { month: 'long', year: 'numeric' });
  const dow = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={`rounded-xl border border-neutral/200 bg-white shadow-sm p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <button className="w-8 h-8 rounded-lg border border-neutral/300 bg-white" onClick={() => setView(addMonths(view, -1))}>‹</button>
        <div className="font-medium">{monthLabel}</div>
        <button className="w-8 h-8 rounded-lg border border-neutral/300 bg-white" onClick={() => setView(addMonths(view, 1))}>›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[12px] text-neutral-500 mb-1">
        {dow.map((d) => (
          <div key={d} className="h-6 grid place-items-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-rows-6 gap-1 select-none">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((d, di) => {
              const inCurrent = d.getMonth() === view.getMonth();
              const selected = isSameDay(d, startDate) || isSameDay(d, endDate);
              const inRange = startDate && endDate && d > startDate && d < endDate;
              const isStart = isSameDay(d, startDate);
              const isEnd = isSameDay(d, endDate);
              return (
                <DayCell
                  key={`${wi}-${di}`}
                  day={d}
                  inCurrentMonth={inCurrent}
                  isSelected={selected}
                  inRange={inRange}
                  isStart={isStart}
                  isEnd={isEnd}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateRangePicker;


