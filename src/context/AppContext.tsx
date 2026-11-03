import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Service,
  BusinessSettings,
  BusinessHour,
  BlockedDate,
  Appointment,
  AppointmentStatus,
  TimeSlot,
} from '../types/database';
import {
  DEFAULT_SERVICES,
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_BLOCKED_DATES,
  DEFAULT_SAMPLE_APPOINTMENTS,
} from '../data/defaultData';
import { generateAvailableTimeSlots } from '../lib/availability';

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceId: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  notes?: string;
}

interface AppContextType {
  // Data
  services: Service[];
  activeServices: Service[];
  businessSettings: BusinessSettings;
  businessHours: BusinessHour[];
  blockedDates: BlockedDate[];
  appointments: Appointment[];
  isLoadingData: boolean;
  dataError: string | null;

  // Actions
  refreshAllData: () => Promise<void>;
  
  // Public Booking
  createAppointmentRequest: (formData: BookingFormData) => Promise<{ success: boolean; error?: string }>;
  getSlotsForDate: (dateStr: string, serviceId: string) => TimeSlot[];

  // Admin Actions
  updateAppointmentStatus: (id: string, newStatus: AppointmentStatus) => Promise<boolean>;
  addService: (newService: Omit<Service, 'id' | 'created_at'>) => Promise<boolean>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<boolean>;
  toggleServiceActive: (id: string, is_active: boolean) => Promise<boolean>;
  updateBusinessHours: (hoursList: BusinessHour[]) => Promise<boolean>;
  addBlockedDate: (blocked_date: string, reason: string) => Promise<boolean>;
  removeBlockedDate: (id: string) => Promise<boolean>;
  updateBusinessSettings: (settingsUpdate: Partial<BusinessSettings>) => Promise<boolean>;
  seedInitialDatabase: () => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(DEFAULT_BUSINESS_SETTINGS);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>(DEFAULT_BUSINESS_HOURS);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(DEFAULT_BLOCKED_DATES);
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_SAMPLE_APPOINTMENTS);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Fetch all data from Supabase if configured
  const refreshAllData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    setDataError(null);

    try {
      // 1. Fetch Services
      const { data: servicesData, error: servicesErr } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true });

      if (!servicesErr && servicesData && servicesData.length > 0) {
        setServices(servicesData);
      }

      // 2. Fetch Business Settings
      const { data: settingsData, error: settingsErr } = await supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!settingsErr && settingsData) {
        setBusinessSettings(settingsData);
      }

      // 3. Fetch Business Hours
      const { data: hoursData, error: hoursErr } = await supabase
        .from('business_hours')
        .select('*')
        .order('weekday', { ascending: true });

      if (!hoursErr && hoursData && hoursData.length > 0) {
        setBusinessHours(hoursData);
      }

      // 4. Fetch Blocked Dates
      const { data: blockedData, error: blockedErr } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('blocked_date', { ascending: true });

      if (!blockedErr && blockedData) {
        setBlockedDates(blockedData);
      }

      // 5. Fetch Appointments (Admin / booked slots)
      const { data: appsData, error: appsErr } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (!appsErr && appsData) {
        setAppointments(appsData);
      }
    } catch (err: unknown) {
      console.warn('Data sync notice:', err);
      // Keep existing memory data gracefully
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Filter active services for public website
  const activeServices = services.filter((s) => s.is_active);

  // Calculate available time slots for a given date and service
  const getSlotsForDate = useCallback(
    (dateStr: string, serviceId: string): TimeSlot[] => {
      const selectedService = services.find((s) => s.id === serviceId);
      if (!selectedService || !dateStr) return [];

      return generateAvailableTimeSlots({
        selectedDateStr: dateStr,
        service: selectedService,
        businessHours,
        settings: businessSettings,
        blockedDates,
        existingAppointments: appointments,
      });
    },
    [services, businessHours, businessSettings, blockedDates, appointments]
  );

  // Public Appointment Booking
  // CRITICAL RULE: When creating an appointment, do not use .insert(...).select() or .insert(...).select().single().
  // Public users are allowed to insert appointments, but they are not allowed to read all appointments.
  // Do not insert id or created_at manually.
  const createAppointmentRequest = async (
    formData: BookingFormData
  ): Promise<{ success: boolean; error?: string }> => {
    const payload = {
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service_id: formData.serviceId,
      appointment_date: formData.appointmentDate,
      start_time: formData.startTime,
      end_time: formData.endTime,
      status: 'pending' as const,
      notes: formData.notes?.trim() || null,
    };

    if (isSupabaseConfigured) {
      try {
        // Crucial: insert ONLY, NO .select()
        const { error } = await supabase.from('appointments').insert(payload);

        if (error) {
          console.error('Supabase appointment insert error:', error);
          return { success: false, error: error.message };
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Database communication failed';
        return { success: false, error: msg };
      }
    }

    // Keep local optimistic copy for immediate admin/calendar representation
    const newLocalApp: Appointment = {
      id: `local-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    };
    setAppointments((prev) => [newLocalApp, ...prev]);

    return { success: true };
  };

  // Admin: Update Appointment Status
  const updateAppointmentStatus = async (
    id: string,
    newStatus: AppointmentStatus
  ): Promise<boolean> => {
    if (isSupabaseConfigured && !id.startsWith('local-')) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          console.error('Failed to update appointment status:', error);
          return false;
        }
      } catch (err) {
        console.error('Appointment status update error:', err);
        return false;
      }
    }

    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    return true;
  };

  // Admin: Add Service
  const addService = async (
    newService: Omit<Service, 'id' | 'created_at'>
  ): Promise<boolean> => {
    const servicePayload = {
      name: newService.name,
      description: newService.description,
      duration_minutes: Number(newService.duration_minutes),
      price: Number(newService.price),
      is_active: Boolean(newService.is_active),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('services')
          .insert(servicePayload)
          .select()
          .single();

        if (error) {
          console.error('Failed to insert service in Supabase:', error);
          return false;
        }

        if (data) {
          setServices((prev) => [...prev, data]);
          return true;
        }
      } catch (err) {
        console.error('Add service error:', err);
        return false;
      }
    }

    // Local fallback
    const localId = `srv-${Date.now()}`;
    const createdLocal: Service = {
      ...servicePayload,
      id: localId,
      created_at: new Date().toISOString(),
    };
    setServices((prev) => [...prev, createdLocal]);
    return true;
  };

  // Admin: Update Service
  const updateService = async (
    id: string,
    serviceData: Partial<Service>
  ): Promise<boolean> => {
    const updatePayload: Partial<Service> = {};
    if (serviceData.name !== undefined) updatePayload.name = serviceData.name;
    if (serviceData.description !== undefined) updatePayload.description = serviceData.description;
    if (serviceData.duration_minutes !== undefined) updatePayload.duration_minutes = Number(serviceData.duration_minutes);
    if (serviceData.price !== undefined) updatePayload.price = Number(serviceData.price);
    if (serviceData.is_active !== undefined) updatePayload.is_active = Boolean(serviceData.is_active);

    if (isSupabaseConfigured && !id.startsWith('srv-')) {
      try {
        const { error } = await supabase
          .from('services')
          .update(updatePayload)
          .eq('id', id);

        if (error) {
          console.error('Failed to update service in Supabase:', error);
          return false;
        }
      } catch (err) {
        console.error('Update service error:', err);
        return false;
      }
    }

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatePayload } : s))
    );
    return true;
  };

  // Admin: Toggle Service is_active
  const toggleServiceActive = async (
    id: string,
    is_active: boolean
  ): Promise<boolean> => {
    return updateService(id, { is_active });
  };

  // Admin: Update Business Hours
  const updateBusinessHours = async (hoursList: BusinessHour[]): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        for (const hour of hoursList) {
          await supabase
            .from('business_hours')
            .upsert({
              weekday: hour.weekday,
              is_open: hour.is_open,
              start_time: hour.start_time,
              end_time: hour.end_time,
            }, { onConflict: 'weekday' });
        }
      } catch (err) {
        console.error('Failed to persist business hours to Supabase:', err);
        return false;
      }
    }

    setBusinessHours(hoursList);
    return true;
  };

  // Admin: Add Blocked Date
  const addBlockedDate = async (
    blocked_date: string,
    reason: string
  ): Promise<boolean> => {
    const payload = {
      blocked_date,
      reason: reason.trim() || 'Studio Closed',
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('blocked_dates')
          .insert(payload)
          .select()
          .single();

        if (error) {
          console.error('Failed to add blocked date in Supabase:', error);
          return false;
        }

        if (data) {
          setBlockedDates((prev) => [...prev, data]);
          return true;
        }
      } catch (err) {
        console.error('Blocked date insert error:', err);
        return false;
      }
    }

    const localBlocked: BlockedDate = {
      id: `block-${Date.now()}`,
      blocked_date,
      reason: payload.reason,
      created_at: new Date().toISOString(),
    };
    setBlockedDates((prev) => [...prev, localBlocked]);
    return true;
  };

  // Admin: Remove Blocked Date
  const removeBlockedDate = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured && !id.startsWith('block-')) {
      try {
        const { error } = await supabase
          .from('blocked_dates')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Failed to delete blocked date in Supabase:', error);
          return false;
        }
      } catch (err) {
        console.error('Delete blocked date error:', err);
        return false;
      }
    }

    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    return true;
  };

  // Admin: Update Business Settings
  const updateBusinessSettings = async (
    settingsUpdate: Partial<BusinessSettings>
  ): Promise<boolean> => {
    const payload: Partial<BusinessSettings> = {};
    if (settingsUpdate.business_name !== undefined) payload.business_name = settingsUpdate.business_name;
    if (settingsUpdate.business_email !== undefined) payload.business_email = settingsUpdate.business_email;
    if (settingsUpdate.business_phone !== undefined) payload.business_phone = settingsUpdate.business_phone;
    if (settingsUpdate.business_address !== undefined) payload.business_address = settingsUpdate.business_address;
    if (settingsUpdate.slot_interval_minutes !== undefined) payload.slot_interval_minutes = Number(settingsUpdate.slot_interval_minutes);
    if (settingsUpdate.booking_notice_hours !== undefined) payload.booking_notice_hours = Number(settingsUpdate.booking_notice_hours);

    if (isSupabaseConfigured) {
      try {
        if (businessSettings.id) {
          const { error } = await supabase
            .from('business_settings')
            .update(payload)
            .eq('id', businessSettings.id);

          if (error) {
            console.error('Failed to update business_settings in Supabase:', error);
            return false;
          }
        }
      } catch (err) {
        console.error('Business settings update error:', err);
        return false;
      }
    }

    setBusinessSettings((prev) => ({ ...prev, ...payload }));
    return true;
  };

  // Seed Initial Database if empty
  const seedInitialDatabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        message: 'Please set your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.',
      };
    }

    try {
      // 1. Seed business_settings if none
      const { data: existingSettings } = await supabase
        .from('business_settings')
        .select('id')
        .limit(1);

      if (!existingSettings || existingSettings.length === 0) {
        await supabase.from('business_settings').insert({
          business_name: 'Étoile Wedding Planning & Design Studio',
          business_email: 'concierge@etoilestudio.com',
          business_phone: '(415) 890-3421',
          business_address: '450 Sutter Street, Suite 800, San Francisco, CA 94108',
          slot_interval_minutes: 30,
          booking_notice_hours: 24,
        });
      }

      // 2. Seed business_hours
      const { data: existingHours } = await supabase
        .from('business_hours')
        .select('id')
        .limit(1);

      if (!existingHours || existingHours.length === 0) {
        await supabase.from('business_hours').insert([
          { weekday: 0, is_open: false, start_time: '10:00:00', end_time: '16:00:00' },
          { weekday: 1, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' },
          { weekday: 2, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' },
          { weekday: 3, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' },
          { weekday: 4, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' },
          { weekday: 5, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' },
          { weekday: 6, is_open: true,  start_time: '10:00:00', end_time: '16:00:00' },
        ]);
      }

      // 3. Seed services
      const { data: existingServices } = await supabase
        .from('services')
        .select('id')
        .limit(1);

      if (!existingServices || existingServices.length === 0) {
        await supabase.from('services').insert(
          DEFAULT_SERVICES.map((s) => ({
            name: s.name,
            description: s.description,
            duration_minutes: s.duration_minutes,
            price: s.price,
            is_active: s.is_active,
          }))
        );
      }

      await refreshAllData();
      return { success: true, message: 'Database tables populated with initial studio records!' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Seeding encountered an error.';
      return { success: false, message: msg };
    }
  };

  return (
    <AppContext.Provider
      value={{
        services,
        activeServices,
        businessSettings,
        businessHours,
        blockedDates,
        appointments,
        isLoadingData,
        dataError,
        refreshAllData,
        createAppointmentRequest,
        getSlotsForDate,
        updateAppointmentStatus,
        addService,
        updateService,
        toggleServiceActive,
        updateBusinessHours,
        addBlockedDate,
        removeBlockedDate,
        updateBusinessSettings,
        seedInitialDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
