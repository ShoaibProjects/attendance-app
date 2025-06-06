import { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';

const DatePicker = () => {
  const [date, setDate] = useState('');

  return (
    <div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <FiCalendar className="text-sky-400" />
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-4 py-3 bg-slate-900/70 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all
            [&::-webkit-calendar-picker-indicator]:bg-white 
            [&::-webkit-calendar-picker-indicator]:rounded-sm 
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
            [&::-webkit-calendar-picker-indicator]:hover:bg-slate-600
            [&::-webkit-calendar-picker-indicator]:transition-colors
            [&::-webkit-calendar-picker-indicator]:p-1
            [&::-webkit-calendar-picker-indicator]:ml-2
            [&::-webkit-date-and-time-value]:text-left
            dark:[&::-webkit-calendar-picker-indicator]:bg-transparent
            dark:[&::-webkit-calendar-picker-indicator]:hover:bg-slate-600"
        />
      </div>

      <style>{`
        input[type="date"] {
          color-scheme: dark;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }

        input[type="date"] {
          -moz-appearance: none;
        }
      `}</style>
    </div>
  );
};

export default DatePicker;
