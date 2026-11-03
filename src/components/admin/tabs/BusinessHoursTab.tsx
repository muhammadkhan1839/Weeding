import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { BusinessHour } from '../../../types/database';
import { Clock, Check, AlertCircle, Save } from 'lucide-react';

const WEEKDAYS = [
  { index: 0, name: 'Sunday' },
  { index: 1, name: 'Monday' },
  { index: 2, name: 'Tuesday' },
  { index: 3, name: 'Wednesday' },
  { index: 4, name: 'Thursday' },
  { index: 5, name: 'Friday' },
  { index: 6, name: 'Saturday' },
];

export const BusinessHoursTab: React.FC = () => {
  const { businessHours, updateBusinessHours } = useApp();

  const [hoursState, setHoursState] = useState<BusinessHour[]>(businessHours);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setHoursState(businessHours);
  }, [businessHours]);

  const handleToggleOpen = (weekday: number) => {
    setHoursState((prev) =>
      prev.map((h) => (Number(h.weekday) === weekday ? { ...h, is_open: !h.is_open } : h))
    );
  };

  const handleTimeChange = (weekday: number, field: 'start_time' | 'end_time', value: string) => {
    const formatted = value.length === 5 ? `${value}:00` : value;
    setHoursState((prev) =>
      prev.map((h) => (Number(h.weekday) === weekday ? { ...h, [field]: formatted } : h))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg(false);
    const success = await updateBusinessHours(hoursState);
    setSaving(false);
    if (success) {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE5DD] gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
            Studio Schedule
          </span>
          <h2 className="font-serif text-3xl font-medium text-[#1F1D1B] mt-0.5">
            Weekly Consultation Business Hours
          </h2>
          <p className="text-xs text-[#6B6158] mt-1">
            Define daily operating hours. Adjustments immediately control available consultation slots for booking couples.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-[#D9C3AC]" />
          <span>{saving ? 'Updating Schedule...' : 'Save Studio Hours'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Business hours successfully updated in Supabase! Public slot generator is synced.</span>
        </div>
      )}

      {/* Weekday List */}
      <div className="bg-white rounded-xl border border-[#E6DFD6] shadow-sm divide-y divide-[#F2ECE5]">
        {WEEKDAYS.map((day) => {
          const hour = hoursState.find((h) => Number(h.weekday) === day.index) || {
            id: `temp-${day.index}`,
            weekday: day.index,
            is_open: day.index !== 0,
            start_time: '09:00:00',
            end_time: '18:00:00',
          };

          return (
            <div
              key={day.index}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                hour.is_open ? 'bg-white' : 'bg-[#FAF8F5]/80'
              }`}
            >
              <div className="flex items-center space-x-4 sm:w-48">
                <button
                  type="button"
                  onClick={() => handleToggleOpen(day.index)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hour.is_open ? 'bg-[#1F1D1B]' : 'bg-[#D9CFC4]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      hour.is_open ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>

                <div>
                  <h4 className="font-serif text-lg font-medium text-[#1F1D1B]">
                    {day.name}
                  </h4>
                  <span className={`text-[11px] uppercase tracking-wider font-semibold ${
                    hour.is_open ? 'text-emerald-700' : 'text-[#8C7A6B]'
                  }`}>
                    {hour.is_open ? 'Open for Bookings' : 'Closed / Studio Day'}
                  </span>
                </div>
              </div>

              {hour.is_open ? (
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#8C7A6B]">Opening:</span>
                    <input
                      type="time"
                      value={hour.start_time.slice(0, 5)}
                      onChange={(e) => handleTimeChange(day.index, 'start_time', e.target.value)}
                      className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D9CFC4] rounded text-sm text-[#1F1D1B] focus:bg-white"
                    />
                  </div>
                  <span className="text-[#8C7A6B]">—</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[#8C7A6B]">Closing:</span>
                    <input
                      type="time"
                      value={hour.end_time.slice(0, 5)}
                      onChange={(e) => handleTimeChange(day.index, 'end_time', e.target.value)}
                      className="px-2.5 py-1.5 bg-[#FAF8F5] border border-[#D9CFC4] rounded text-sm text-[#1F1D1B] focus:bg-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#8C7A6B] italic">
                  No public consultation slots generated on this day.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
