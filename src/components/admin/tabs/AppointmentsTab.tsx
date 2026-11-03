import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../../types/database';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Check,
  FileText,
  User,
  X,
} from 'lucide-react';

export const AppointmentsTab: React.FC = () => {
  const { appointments, services, updateAppointmentStatus } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getServiceName = (serviceId: string) => {
    const s = services.find((srv) => srv.id === serviceId);
    return s ? s.name : 'Wedding Consultation';
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.full_name.toLowerCase().includes(q);
      const matchEmail = app.email.toLowerCase().includes(q);
      const matchPhone = app.phone.toLowerCase().includes(q);
      const serviceName = getServiceName(app.service_id).toLowerCase();
      const matchService = serviceName.includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchService) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE5DD] gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
            Studio Management
          </span>
          <h2 className="font-serif text-3xl font-medium text-[#1F1D1B] mt-0.5">
            Client Appointments &amp; Consultations
          </h2>
          <p className="text-xs text-[#6B6158] mt-1">
            Total {appointments.length} recorded booking{appointments.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#9C8F84] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search couples, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3.5 py-2 text-xs bg-white border border-[#D9CFC4] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1F1D1B] w-56 sm:w-64"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-[#FAF8F5] rounded-md border border-[#E0D7CE] text-xs">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#1F1D1B] text-white shadow-xs'
                    : 'text-[#6B6158] hover:text-[#1F1D1B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-[#E6DFD6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#ECE5DD] text-[11px] uppercase tracking-wider text-[#8C7A6B] font-semibold">
                <th className="py-3 px-5">Couple / Client</th>
                <th className="py-3 px-5">Consultation Service</th>
                <th className="py-3 px-5">Date &amp; Time</th>
                <th className="py-3 px-5">Contact Details</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE5] text-xs text-[#3D3732]">
              {filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-[#FAF8F5] transition-colors">
                  {/* Name */}
                  <td className="py-4 px-5">
                    <p className="font-serif text-base font-medium text-[#1F1D1B] leading-snug">
                      {app.full_name}
                    </p>
                    {app.notes && (
                      <button
                        onClick={() => setSelectedAppointment(app)}
                        className="text-[11px] text-[#A37E52] hover:underline flex items-center space-x-1 mt-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>View Notes</span>
                      </button>
                    )}
                  </td>

                  {/* Service */}
                  <td className="py-4 px-5">
                    <span className="font-medium text-[#2E2925]">
                      {getServiceName(app.service_id)}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 text-[#1F1D1B] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#A37E52]" />
                      <span>{app.appointment_date}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[#7A7067] text-[11px] mt-0.5">
                      <Clock className="w-3 h-3 text-[#A37E52]" />
                      <span>{app.start_time.slice(0, 5)} - {app.end_time.slice(0, 5)}</span>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-5">
                    <div className="space-y-0.5">
                      <p className="text-[#1F1D1B] font-medium">{app.email}</p>
                      <p className="text-[#7A7067]">{app.phone}</p>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    <select
                      value={app.status}
                      onChange={(e) => updateAppointmentStatus(app.id, e.target.value as AppointmentStatus)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border focus:outline-none cursor-pointer ${
                        app.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : app.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : app.status === 'completed'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Quick Detail View Action */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedAppointment(app)}
                      className="px-3 py-1.5 text-xs font-medium text-[#4A433D] hover:text-[#1F1D1B] bg-[#FAF8F5] hover:bg-[#F2ECE5] border border-[#D9CFC4] rounded transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8C7A6B]">
                    No appointments found matching this criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE5DD]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
                  Appointment Dossier
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1F1D1B]">
                  {selectedAppointment.full_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 text-[#7A7067] hover:text-[#1F1D1B] rounded hover:bg-[#F2ECE5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#4A433D]">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DC]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block">Service</span>
                  <span className="font-medium text-[#1F1D1B] text-xs">
                    {getServiceName(selectedAppointment.service_id)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block">Status</span>
                  <span className="font-semibold uppercase tracking-wider text-xs">
                    {selectedAppointment.status}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block">Date</span>
                  <span className="font-medium text-[#1F1D1B] text-xs">{selectedAppointment.appointment_date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block">Time</span>
                  <span className="font-medium text-[#1F1D1B] text-xs">
                    {selectedAppointment.start_time.slice(0, 5)} - {selectedAppointment.end_time.slice(0, 5)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block mb-1">
                  Client Contact
                </span>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DC] space-y-1">
                  <p><span className="text-[#8C7A6B]">Email:</span> {selectedAppointment.email}</p>
                  <p><span className="text-[#8C7A6B]">Phone:</span> {selectedAppointment.phone}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] block mb-1">
                  Celebration Vision &amp; Notes
                </span>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3DC] text-xs text-[#332E2B] leading-relaxed">
                  {selectedAppointment.notes || 'No special notes entered during booking.'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ECE5DD] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#8C7A6B]">Update:</span>
                <select
                  value={selectedAppointment.status}
                  onChange={(e) => {
                    const next = e.target.value as AppointmentStatus;
                    updateAppointmentStatus(selectedAppointment.id, next);
                    setSelectedAppointment({ ...selectedAppointment, status: next });
                  }}
                  className="text-xs font-semibold px-2 py-1 bg-white border border-[#D9CFC4] rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1F1D1B] rounded hover:bg-[#34302C] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
