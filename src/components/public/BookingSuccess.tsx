import React from 'react';
import { Service, BusinessSettings } from '../../types/database';
import { WEDDING_IMAGES } from '../../data/weddingImages';
import { CheckCircle2, Calendar, Clock, MapPin, Mail, Phone, ArrowLeft, Download } from 'lucide-react';

interface BookingSuccessProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    timeLabel: string;
    notes?: string;
  };
  service: Service;
  businessSettings: BusinessSettings;
  onReset: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
  formData,
  service,
  businessSettings,
  onReset,
}) => {
  // Format the date for friendly display
  const [yearStr, monthStr, dayStr] = formData.appointmentDate.split('-');
  const dateObj = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10)
  );

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Generate calendar invite URL (.ics or google calendar link)
  const googleCalendarUrl = () => {
    const title = encodeURIComponent(`${service.name} - ${businessSettings.business_name}`);
    const details = encodeURIComponent(
      `Wedding Planning Consultation with ${businessSettings.business_name}.\nClient: ${formData.fullName}\nPhone: ${formData.phone}\nNotes: ${formData.notes || 'None'}`
    );
    const location = encodeURIComponent(businessSettings.business_address);

    const startIso = `${formData.appointmentDate.replace(/-/g, '')}T${formData.startTime.replace(/:/g, '').slice(0, 4)}00`;
    const endIso = `${formData.appointmentDate.replace(/-/g, '')}T${formData.endTime.replace(/:/g, '').slice(0, 4)}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-2xl overflow-hidden max-w-3xl mx-auto">
      {/* Top Celebration Visual Banner */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-[#24211E]">
        <img
          src={WEDDING_IMAGES.bookingBackdrop.url}
          alt="Wedding celebration atmosphere"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 text-white flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#EBD9C7] font-semibold block">
              Reservation Confirmed
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium">
              We look forward to meeting you.
            </h3>
          </div>
        </div>
      </div>

      {/* Appointment Summary Details */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#ECE5DC] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6DFD6] gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
                Selected Consultation
              </span>
              <h4 className="font-serif text-xl sm:text-2xl text-[#1F1D1B] font-medium mt-0.5">
                {service.name}
              </h4>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
                Investment
              </span>
              <span className="font-serif text-2xl font-semibold text-[#8A6740]">
                ${Number(service.price).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#47413B]">
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-[#A37E52] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8C7A6B] font-medium uppercase tracking-wider">Date</p>
                <p className="font-medium text-[#1F1D1B] mt-0.5">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 text-[#A37E52] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8C7A6B] font-medium uppercase tracking-wider">Scheduled Time</p>
                <p className="font-medium text-[#1F1D1B] mt-0.5">
                  {formData.timeLabel} ({service.duration_minutes} Minutes)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-[#A37E52] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8C7A6B] font-medium uppercase tracking-wider">Client &amp; Contact</p>
                <p className="font-medium text-[#1F1D1B] mt-0.5">{formData.fullName}</p>
                <p className="text-xs text-[#6B6158]">{formData.email} · {formData.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-[#A37E52] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8C7A6B] font-medium uppercase tracking-wider">Studio Location</p>
                <p className="font-medium text-[#1F1D1B] mt-0.5">{businessSettings.business_name}</p>
                <p className="text-xs text-[#6B6158]">{businessSettings.business_address}</p>
              </div>
            </div>
          </div>

          {formData.notes && (
            <div className="pt-3 border-t border-[#EAE3DC] text-xs text-[#6B6158]">
              <span className="font-medium text-[#38332E]">Celebration Vision &amp; Notes:</span> {formData.notes}
            </div>
          )}
        </div>

        {/* Studio Follow-up note */}
        <p className="text-xs text-[#7A7067] leading-relaxed text-center max-w-lg mx-auto">
          A calendar invitation and studio preparation packet have been scheduled. For immediate itinerary updates or venue revisions, reach our concierge at{' '}
          <span className="font-medium text-[#1F1D1B]">{businessSettings.business_phone}</span> or{' '}
          <span className="font-medium text-[#1F1D1B]">{businessSettings.business_email}</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={googleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-all shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#D9C3AC]" />
            <span>Add to Google Calendar</span>
          </a>

          <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 text-sm font-medium text-[#38332E] hover:text-[#1F1D1B] bg-white rounded-md border border-[#E0D7CE] hover:border-[#B8A89A] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Book Another Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
