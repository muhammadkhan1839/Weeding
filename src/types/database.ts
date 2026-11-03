export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at?: string;
  image_url?: string; // Optional visual asset helper
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:mm:ss or HH:mm
  end_time: string; // HH:mm:ss or HH:mm
  status: AppointmentStatus;
  notes: string | null;
  created_at?: string;
  // joined service
  service?: Service;
}

export interface BusinessHour {
  id: string;
  weekday: number; // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  is_open: boolean;
  start_time: string; // HH:mm:ss or HH:mm
  end_time: string; // HH:mm:ss or HH:mm
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string;
  created_at?: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
  startString: string; // HH:mm
  endString: string; // HH:mm
}
