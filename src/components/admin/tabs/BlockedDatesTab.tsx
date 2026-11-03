import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, Trash2, Plus, AlertCircle, Check, X, ShieldAlert } from 'lucide-react';
import { formatDateForDb } from '../../../lib/availability';

export const BlockedDatesTab: React.FC = () => {
  const { blockedDates, addBlockedDate, removeBlockedDate } = useApp();

  const [newDate, setNewDate] = useState<string>('');
  const [newReason, setNewReason] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      setErrorMsg('Please select a date to block.');
      return;
    }

    if (blockedDates.some((b) => b.blocked_date === newDate)) {
      setErrorMsg('This date is already blocked.');
      return;
    }

    setAdding(true);
    setErrorMsg(null);

    const success = await addBlockedDate(newDate, newReason || 'Studio Closed / On-site Wedding Production');
    setAdding(false);

    if (success) {
      setNewDate('');
      setNewReason('');
    } else {
      setErrorMsg('Failed to add blocked date in Supabase.');
    }
  };

  const todayStr = formatDateForDb(new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#ECE5DD]">
        <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
          Calendar Restrictions
        </span>
        <h2 className="font-serif text-3xl font-medium text-[#1F1D1B] mt-0.5">
          Blocked Studio Dates &amp; Blackout Periods
        </h2>
        <p className="text-xs text-[#6B6158] mt-1">
          Block off national holidays, intensive on-site wedding execution weekends, or private retreat dates from public booking.
        </p>
      </div>

      {/* Add Blocked Date Form Card */}
      <div className="bg-white rounded-xl border border-[#E6DFD6] p-6 shadow-sm">
        <h3 className="font-serif text-lg font-medium text-[#1F1D1B] mb-4 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#A37E52]" />
          <span>Add Blocked Date</span>
        </h3>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
              Blackout Date *
            </label>
            <input
              type="date"
              min={todayStr}
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
              Reason / Occasion *
            </label>
            <input
              type="text"
              required
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="e.g. On-site Wedding Coordination / Private Studio Retreat"
              className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={adding}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-colors cursor-pointer disabled:opacity-50 h-[38px]"
            >
              <Plus className="w-3.5 h-3.5 text-[#D9C3AC]" />
              <span>{adding ? 'Blocking...' : 'Block Date'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Blocked Dates List */}
      <div className="bg-white rounded-xl border border-[#E6DFD6] shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 bg-[#FAF8F5] border-b border-[#ECE5DD] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
          <span>Currently Blocked Dates ({blockedDates.length})</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-[#F2ECE5]">
          {blockedDates.map((block) => (
            <div
              key={block.id}
              className="p-4 sm:px-6 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#A37E52]" />
                  <span className="font-serif text-base font-medium text-[#1F1D1B]">
                    {block.blocked_date}
                  </span>
                </div>
                <p className="text-xs text-[#6B6158] ml-6">
                  {block.reason}
                </p>
              </div>

              <button
                onClick={() => removeBlockedDate(block.id)}
                className="p-2 text-[#998B7F] hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                title="Remove block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {blockedDates.length === 0 && (
            <div className="p-8 text-center text-xs text-[#8C7A6B]">
              No dates currently blocked. All weekday business hours are open for booking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
