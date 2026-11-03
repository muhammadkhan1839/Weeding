import React from 'react';
import { useApp } from '../../../context/AppContext';
import { AppointmentStatus } from '../../../types/database';
import { Calendar, Clock, CheckCircle2, AlertCircle, Sparkles, User, ArrowRight } from 'lucide-react';

interface OverviewTabProps {
  onNavigateToTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateToTab }) => {
  const { appointments, services, activeServices, updateAppointmentStatus, businessSettings } = useApp();

  // Metrics
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const activeServicesCount = activeServices.length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcomingAppointments = appointments
    .filter((a) => a.appointment_date >= todayStr && a.status !== 'cancelled')
    .slice(0, 6);

  const getServiceName = (serviceId: string) => {
    const s = services.find((srv) => srv.id === serviceId);
    return s ? s.name : 'Wedding Consultation';
  };

  return (
    <div className="space-y-8">
      {/* Studio Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#ECE5DD] gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#8C7A6B] font-medium block">
            Studio Command Center
          </span>
          <h2 className="font-serif text-3xl font-medium text-[#1F1D1B] mt-0.5">
            Welcome, Wedding Planning Team
          </h2>
          <p className="text-xs text-[#6B6158] mt-1">
            Real-time consultation bookings, schedule availability, and service configurations for {businessSettings.business_name}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateToTab('appointments')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-all shadow-sm cursor-pointer"
          >
            Review Appointments
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#E6DFD6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium">Pending Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-medium text-[#1F1D1B] mt-3">{pendingCount}</p>
          <span className="text-[11px] text-[#8C7A6B] mt-1 block">Requires confirmation</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6DFD6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium">Confirmed Consultations</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-medium text-[#1F1D1B] mt-3">{confirmedCount}</p>
          <span className="text-[11px] text-[#8C7A6B] mt-1 block">Scheduled on calendar</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6DFD6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium">Completed Sessions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-medium text-[#1F1D1B] mt-3">{completedCount}</p>
          <span className="text-[11px] text-[#8C7A6B] mt-1 block">Archived weddings</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6DFD6] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium">Active Services</span>
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-[#8A6740] flex items-center justify-center border border-[#ECE5DD]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-medium text-[#1F1D1B] mt-3">{activeServicesCount}</p>
          <span className="text-[11px] text-[#8C7A6B] mt-1 block">Bookable by clients</span>
        </div>
      </div>

      {/* Upcoming Consultations Table */}
      <div className="bg-white rounded-xl border border-[#E6DFD6] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#ECE5DD] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1F1D1B]">
              Upcoming Client Consultations
            </h3>
            <p className="text-xs text-[#7A7067] mt-0.5">
              Scheduled planning sessions and vision inquiries
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('appointments')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-[#8A6740] hover:text-[#1F1D1B] cursor-pointer"
          >
            <span>View All ({appointments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F2ECE5]">
          {upcomingAppointments.map((app) => (
            <div key={app.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-base font-medium text-[#1F1D1B]">{app.full_name}</span>
                  <span className="text-xs text-[#8C7A6B]">·</span>
                  <span className="text-xs text-[#6B6158] font-medium">{getServiceName(app.service_id)}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-[#7A7067]">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-[#A37E52]" />
                    <span>{app.appointment_date}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#A37E52]" />
                    <span>{app.start_time.slice(0, 5)} - {app.end_time.slice(0, 5)}</span>
                  </span>
                  <span>·</span>
                  <span>{app.email}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={app.status}
                  onChange={(e) => updateAppointmentStatus(app.id, e.target.value as AppointmentStatus)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-md border focus:outline-none cursor-pointer ${
                    app.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : app.status === 'pending'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : app.status === 'completed'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}

          {upcomingAppointments.length === 0 && (
            <div className="p-8 text-center text-sm text-[#8C7A6B]">
              No upcoming appointments found. New booking requests will appear here in real time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
