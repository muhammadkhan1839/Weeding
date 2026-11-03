import {
  BusinessHour,
  BusinessSettings,
  BlockedDate,
  Appointment,
  Service,
  TimeSlot,
} from '../types/database';

/**
 * Normalizes time string (e.g. "09:00", "09:00:00", "9:00") into { hours, minutes }
 */
export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  if (!timeStr) return { hours: 9, minutes: 0 };
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  return {
    hours: isNaN(parts[0]) ? 9 : parts[0],
    minutes: isNaN(parts[1]) ? 0 : parts[1],
  };
}

/**
 * Creates a valid Date object combining a date string 'YYYY-MM-DD' and time string 'HH:mm' or 'HH:mm:ss'.
 */
export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed in JS
  const day = parseInt(dayStr, 10);

  const { hours, minutes } = parseTimeString(timeStr);
  const date = new Date(year, month, day, hours, minutes, 0, 0);
  return date;
}

/**
 * Formats a Date object to 12-hour AM/PM label (e.g. "10:30 AM")
 */
export function formatTimeLabel(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Formats a Date object to 24-hour time string "HH:mm:ss" for database storage
 */
export function formatTimeForDb(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}:00`;
}

/**
 * Formats a Date object to YYYY-MM-DD string
 */
export function formatDateForDb(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if two date ranges overlap.
 * Overlap rule: new_start < existing_end AND new_end > existing_start
 */
export function isOverlapping(
  slotStart: Date,
  slotEnd: Date,
  appStart: Date,
  appEnd: Date
): boolean {
  return slotStart.getTime() < appEnd.getTime() && slotEnd.getTime() > appStart.getTime();
}

/**
 * Generates available time slots for a specific date given the business rules.
 */
export function generateAvailableTimeSlots(params: {
  selectedDateStr: string; // 'YYYY-MM-DD'
  service: Service;
  businessHours: BusinessHour[];
  settings: BusinessSettings;
  blockedDates: BlockedDate[];
  existingAppointments: Appointment[];
}): TimeSlot[] {
  const {
    selectedDateStr,
    service,
    businessHours,
    settings,
    blockedDates,
    existingAppointments,
  } = params;

  // 1. Check if date is blocked
  const isDateBlocked = blockedDates.some(
    (b) => b.blocked_date === selectedDateStr
  );
  if (isDateBlocked) {
    return [];
  }

  // 2. Determine day of week for selected date (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const [yearStr, monthStr, dayStr] = selectedDateStr.split('-');
  const testDate = new Date(
    parseInt(yearStr, 10),
    parseInt(monthStr, 10) - 1,
    parseInt(dayStr, 10)
  );
  const weekday = testDate.getDay();

  // Find business hours for this weekday
  const dayHours = businessHours.find((h) => Number(h.weekday) === weekday);
  if (!dayHours || !dayHours.is_open) {
    return [];
  }

  // 3. Parse working hours
  const openTime = combineDateAndTime(selectedDateStr, dayHours.start_time);
  const closeTime = combineDateAndTime(selectedDateStr, dayHours.end_time);

  // 4. Booking notice restriction: slots must be after (now + booking_notice_hours)
  const now = new Date();
  const noticeHours = settings.booking_notice_hours || 24;
  const minimumBookingTime = new Date(now.getTime() + noticeHours * 60 * 60 * 1000);

  // 5. Existing appointments on this date, ignoring cancelled ones
  const activeExistingOnDate = existingAppointments.filter((app) => {
    if (app.appointment_date !== selectedDateStr) return false;
    if (app.status === 'cancelled') return false;
    return true;
  });

  const parsedExisting = activeExistingOnDate.map((app) => {
    const appStart = combineDateAndTime(app.appointment_date, app.start_time);
    const appEnd = combineDateAndTime(app.appointment_date, app.end_time);
    return { start: appStart, end: appEnd };
  });

  const slotIntervalMinutes = settings.slot_interval_minutes || 30;
  const serviceDurationMinutes = service.duration_minutes || 60;
  const stepMs = slotIntervalMinutes * 60 * 1000;
  const durationMs = serviceDurationMinutes * 60 * 1000;

  const availableSlots: TimeSlot[] = [];

  let currentCursor = new Date(openTime.getTime());

  while (currentCursor.getTime() + durationMs <= closeTime.getTime()) {
    const slotStart = new Date(currentCursor.getTime());
    const slotEnd = new Date(currentCursor.getTime() + durationMs);

    // Check minimum booking notice
    if (slotStart.getTime() > minimumBookingTime.getTime()) {
      // Check collision with existing appointments
      // Overlap rule: new_start < existing_end AND new_end > existing_start
      const hasOverlap = parsedExisting.some((existing) =>
        isOverlapping(slotStart, slotEnd, existing.start, existing.end)
      );

      if (!hasOverlap) {
        const startH = String(slotStart.getHours()).padStart(2, '0');
        const startM = String(slotStart.getMinutes()).padStart(2, '0');
        const endH = String(slotEnd.getHours()).padStart(2, '0');
        const endM = String(slotEnd.getMinutes()).padStart(2, '0');

        availableSlots.push({
          start: slotStart,
          end: slotEnd,
          label: formatTimeLabel(slotStart),
          startString: `${startH}:${startM}:00`,
          endString: `${endH}:${endM}:00`,
        });
      }
    }

    // Advance by slot_interval_minutes
    currentCursor = new Date(currentCursor.getTime() + stepMs);
  }

  return availableSlots;
}
