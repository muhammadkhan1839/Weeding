import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, TimeSlot } from '../../types/database';
import { formatDateForDb } from '../../lib/availability';
import { BookingSuccess } from './BookingSuccess';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Lock,
} from 'lucide-react';

interface BookingSectionProps {
  initialService?: Service | null;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ initialService }) => {
  const {
    activeServices,
    businessSettings,
    businessHours,
    blockedDates,
    getSlotsForDate,
    createAppointmentRequest,
  } = useApp();

  // Wizard state: 1 = Service, 2 = Date & Time, 3 = Details, 4 = Success
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Date selection state
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Client Details Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<{
    fullName: string;
    email: string;
    phone: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    timeLabel: string;
    notes?: string;
  } | null>(null);

  // Sync initialService if passed from props
  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setCurrentStep(2);
    } else if (activeServices.length > 0 && !selectedService) {
      setSelectedService(activeServices[0]);
    }
  }, [initialService, activeServices]);

  // Set default initial date (tomorrow or next available open day)
  useEffect(() => {
    if (!selectedDateStr) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDateStr(formatDateForDb(tomorrow));
    }
  }, [selectedDateStr]);

  // Available slots for selected date & service
  const availableSlots = useMemo(() => {
    if (!selectedDateStr || !selectedService) return [];
    return getSlotsForDate(selectedDateStr, selectedService.id);
  }, [selectedDateStr, selectedService, getSlotsForDate]);

  // Clear selected slot if date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDateStr]);

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isBlocked: boolean;
      isClosedWeekday: boolean;
      isPast: boolean;
    }> = [];

    const todayStr = formatDateForDb(new Date());

    // Padding for days before start of month
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dateStr: '',
        dayNumber: 0,
        isCurrentMonth: false,
        isDisabled: true,
        isBlocked: false,
        isClosedWeekday: false,
        isPast: false,
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = formatDateForDb(dateObj);
      const weekday = dateObj.getDay();

      // Check if in past
      const isPast = dateStr < todayStr;

      // Check if blocked
      const isBlocked = blockedDates.some((b) => b.blocked_date === dateStr);

      // Check if closed on this weekday
      const hourSetting = businessHours.find((h) => Number(h.weekday) === weekday);
      const isClosedWeekday = hourSetting ? !hourSetting.is_open : false;

      const isDisabled = isPast || isBlocked || isClosedWeekday;

      days.push({
        dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        isDisabled,
        isBlocked,
        isClosedWeekday,
        isPast,
      });
    }

    return days;
  }, [currentMonth, blockedDates, businessHours]);

  // Handle appointment submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDateStr || !selectedSlot) return;

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setSubmitError('Please provide your full name, email address, and phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      fullName,
      email,
      phone,
      serviceId: selectedService.id,
      appointmentDate: selectedDateStr,
      startTime: selectedSlot.startString,
      endTime: selectedSlot.endString,
      notes,
    };

    const res = await createAppointmentRequest(payload);

    setIsSubmitting(false);

    if (res.success) {
      setSubmittedBooking({
        ...payload,
        timeLabel: selectedSlot.label,
      });
      setCurrentStep(4);
    } else {
      setSubmitError(res.error || 'Failed to reserve appointment. Please verify details and try again.');
    }
  };

  const handleResetForm = () => {
    setCurrentStep(1);
    setSelectedSlot(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setSubmittedBooking(null);
    setSubmitError(null);
  };

  return (
    <section id="booking" className="py-24 bg-[#FAF8F5] border-b border-[#ECE5DD] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8C7A6B]">
            <span className="w-5 h-px bg-[#A37E52]" />
            <span>Consultation Concierge</span>
            <span className="w-5 h-px bg-[#A37E52]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F1D1B] font-normal">
            Schedule Your Wedding Planning Consultation
          </h2>
          <p className="text-[#615850] text-base font-light">
            Reserve a private session with our principal planners to discuss your design aesthetic, venue architecture, and planning roadmap.
          </p>
        </div>

        {/* Step Indicator (Steps 1 to 3) */}
        {currentStep < 4 && (
          <div className="max-w-3xl mx-auto mb-10">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex items-center justify-center space-x-2 pb-3 border-b-2 transition-all cursor-pointer ${
                  currentStep === 1
                    ? 'border-[#1F1D1B] text-[#1F1D1B] font-semibold'
                    : currentStep > 1
                    ? 'border-[#C5A880] text-[#8A6740]'
                    : 'border-[#EAE3DC] text-[#A69B91]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 1
                    ? 'bg-[#1F1D1B] text-white'
                    : currentStep > 1
                    ? 'bg-[#8A6740] text-white'
                    : 'bg-[#EAE3DC] text-[#7A7067]'
                }`}>
                  {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
                </span>
                <span className="hidden sm:inline">1. Select Service</span>
              </button>

              <button
                onClick={() => selectedService && setCurrentStep(2)}
                disabled={!selectedService}
                className={`flex items-center justify-center space-x-2 pb-3 border-b-2 transition-all ${
                  !selectedService ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } ${
                  currentStep === 2
                    ? 'border-[#1F1D1B] text-[#1F1D1B] font-semibold'
                    : currentStep > 2
                    ? 'border-[#C5A880] text-[#8A6740]'
                    : 'border-[#EAE3DC] text-[#A69B91]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 2
                    ? 'bg-[#1F1D1B] text-white'
                    : currentStep > 2
                    ? 'bg-[#8A6740] text-white'
                    : 'bg-[#EAE3DC] text-[#7A7067]'
                }`}>
                  {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
                </span>
                <span className="hidden sm:inline">2. Date &amp; Time</span>
              </button>

              <button
                onClick={() => selectedService && selectedSlot && setCurrentStep(3)}
                disabled={!selectedService || !selectedSlot}
                className={`flex items-center justify-center space-x-2 pb-3 border-b-2 transition-all ${
                  !selectedSlot ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } ${
                  currentStep === 3
                    ? 'border-[#1F1D1B] text-[#1F1D1B] font-semibold'
                    : 'border-[#EAE3DC] text-[#A69B91]'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 3
                    ? 'bg-[#1F1D1B] text-white'
                    : 'bg-[#EAE3DC] text-[#7A7067]'
                }`}>
                  3
                </span>
                <span className="hidden sm:inline">3. Couple Details</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {currentStep === 4 && submittedBooking && selectedService && (
          <BookingSuccess
            formData={submittedBooking}
            service={selectedService}
            businessSettings={businessSettings}
            onReset={handleResetForm}
          />
        )}

        {/* STEP 1: SELECT SERVICE */}
        {currentStep === 1 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-6 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white border-[#1F1D1B] ring-2 ring-[#1F1D1B]/10 shadow-lg'
                        : 'bg-white/70 hover:bg-white border-[#E6DFD6] hover:border-[#C5A880]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-xl font-medium text-[#1F1D1B]">
                          {service.name}
                        </h4>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected ? 'border-[#1F1D1B] bg-[#1F1D1B] text-white' : 'border-[#D9CFC4]'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>

                      <p className="text-xs text-[#5C544E] mt-2 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#F2ECE5] flex items-center justify-between text-xs font-medium">
                      <span className="text-[#8C7A6B] flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.duration_minutes} Minutes</span>
                      </span>
                      <span className="font-serif text-lg font-semibold text-[#8A6740]">
                        ${Number(service.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedService}
                className="inline-flex items-center space-x-2 px-8 py-3.5 text-sm font-medium text-white bg-[#1F1D1B] hover:bg-[#34302C] active:scale-[0.99] rounded-md transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue to Date &amp; Time</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME */}
        {currentStep === 2 && selectedService && (
          <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-[#E8DFD8] shadow-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Interactive Month Calendar */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#ECE5DD]">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
                      Step 2 of 3
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-[#1F1D1B]">
                      Select Consultation Date
                    </h3>
                  </div>

                  {/* Month Switcher */}
                  <div className="flex items-center space-x-2">
                    <span className="font-serif text-base font-medium text-[#1F1D1B]">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={handlePrevMonth}
                        className="p-1.5 rounded hover:bg-[#F2ECE5] text-[#5C544E] cursor-pointer"
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-1.5 rounded hover:bg-[#F2ECE5] text-[#5C544E] cursor-pointer"
                        aria-label="Next month"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div>
                  {/* Day of Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] py-2">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* Day Cells */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((dayItem, idx) => {
                      if (!dayItem.isCurrentMonth) {
                        return <div key={`empty-${idx}`} className="h-10 sm:h-12" />;
                      }

                      const isSelected = selectedDateStr === dayItem.dateStr;

                      return (
                        <button
                          key={dayItem.dateStr}
                          disabled={dayItem.isDisabled}
                          onClick={() => setSelectedDateStr(dayItem.dateStr)}
                          className={`h-10 sm:h-12 rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all relative ${
                            isSelected
                              ? 'bg-[#1F1D1B] text-white shadow-md font-semibold'
                              : dayItem.isDisabled
                              ? 'text-[#C7BCB1] bg-[#FAF8F5] cursor-not-allowed line-through decoration-[#D9CFC4]'
                              : 'text-[#2B2724] hover:bg-[#F5EFEB] border border-transparent hover:border-[#D9CFC4] cursor-pointer'
                          }`}
                          title={
                            dayItem.isBlocked
                              ? 'Studio closed / Blocked date'
                              : dayItem.isClosedWeekday
                              ? 'Studio closed on this weekday'
                              : dayItem.isPast
                              ? 'Past date'
                              : ''
                          }
                        >
                          <span>{dayItem.dayNumber}</span>
                          {dayItem.isBlocked && (
                            <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 text-xs text-[#8C7A6B] flex items-center space-x-4">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#1F1D1B]" />
                    <span>Selected</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#FAF8F5] border border-[#D9CFC4]" />
                    <span>Available</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#FAF8F5] line-through text-[#C7BCB1]" />
                    <span>Unavailable</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Time Slots & Service Summary */}
              <div className="lg:col-span-5 bg-[#FAF8F5] rounded-xl p-5 border border-[#ECE5DD] flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-[#E6DFD6]">
                    <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
                      Consultation
                    </span>
                    <h4 className="font-serif text-lg font-medium text-[#1F1D1B]">
                      {selectedService.name}
                    </h4>
                    <p className="text-xs text-[#6B6158] mt-0.5">
                      {selectedService.duration_minutes} min · ${Number(selectedService.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-3 flex items-center justify-between">
                      <span>Available Time Slots</span>
                      {availableSlots.length > 0 && (
                        <span className="text-[#8C7A6B] font-normal">{availableSlots.length} available</span>
                      )}
                    </h4>

                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                        {availableSlots.map((slot) => {
                          const isSlotSelected = selectedSlot?.startString === slot.startString;
                          return (
                            <button
                              key={slot.startString}
                              onClick={() => setSelectedSlot(slot)}
                              className={`px-3 py-2.5 text-xs font-medium rounded-md border transition-all text-center cursor-pointer ${
                                isSlotSelected
                                  ? 'bg-[#1F1D1B] text-white border-[#1F1D1B] shadow-sm font-semibold'
                                  : 'bg-white hover:bg-[#F2ECE5] text-[#332E2B] border-[#D9CFC4]'
                              }`}
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 text-center bg-white/70 rounded-lg border border-[#E6DFD6] p-4">
                        <AlertCircle className="w-5 h-5 text-[#A37E52] mx-auto mb-1.5" />
                        <p className="text-xs font-medium text-[#1F1D1B]">No Open Consultation Slots</p>
                        <p className="text-[11px] text-[#7A7067] mt-1">
                          No available hours remain for this date. Please pick another date on the calendar.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Back / Next actions */}
                <div className="pt-6 border-t border-[#E6DFD6] mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-medium text-[#6B6158] hover:text-[#1F1D1B] cursor-pointer"
                  >
                    Change Service
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!selectedSlot}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1F1D1B] hover:bg-[#34302C] rounded-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <span>Couple Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* STEP 3: COUPLE INFORMATION & CONFIRMATION */}
        {currentStep === 3 && selectedService && selectedSlot && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E8DFD8] shadow-xl p-6 sm:p-8">
            <div className="pb-4 border-b border-[#ECE5DD] mb-6">
              <span className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium block">
                Final Step
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#1F1D1B]">
                Your Contact Information &amp; Celebration Vision
              </h3>
            </div>

            {/* Selected Booking Recap Card */}
            <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#ECE5DD] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#8C7A6B] font-medium">Selected Consultation</p>
                <p className="font-serif text-lg font-medium text-[#1F1D1B] mt-0.5">{selectedService.name}</p>
                <p className="text-xs text-[#5C544E] mt-0.5">
                  {selectedDateStr} · {selectedSlot.label} ({selectedService.duration_minutes} min)
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-semibold text-[#8A6740] hover:underline self-start sm:self-center cursor-pointer"
              >
                Modify Date/Time
              </button>
            </div>

            {submitError && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                    Full Name(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Genevieve &amp; Marcus"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. genevieve@example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. (415) 555-0192"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A433D] mb-1.5">
                  Celebration Vision &amp; Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your estimated guest count, target season, preferred venue style, or any specific styling ideas you love..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#D9CFC4] rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F1D1B]"
                />
              </div>

              <div className="pt-4 border-t border-[#ECE5DD] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-medium text-[#6B6158] hover:text-[#1F1D1B] cursor-pointer"
                >
                  Back to Calendar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 text-sm font-medium text-white bg-[#1F1D1B] hover:bg-[#34302C] active:scale-[0.99] rounded-md transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-[#D9C3AC]" />
                  <span>{isSubmitting ? 'Securing Consultation...' : 'Confirm Consultation Request'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </section>
  );
};
