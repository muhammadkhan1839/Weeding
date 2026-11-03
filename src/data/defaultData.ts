import {
  Service,
  BusinessSettings,
  BusinessHour,
  BlockedDate,
  Appointment,
} from '../types/database';
import { WEDDING_IMAGES } from './weddingImages';

export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  id: '00000000-0000-0000-0000-000000000001',
  business_name: 'Étoile Wedding Planning & Design Studio',
  business_email: 'concierge@etoilestudio.com',
  business_phone: '(415) 890-3421',
  business_address: '450 Sutter Street, Suite 800, San Francisco, CA 94108',
  slot_interval_minutes: 30,
  booking_notice_hours: 24,
  created_at: new Date().toISOString(),
};

export const DEFAULT_BUSINESS_HOURS: BusinessHour[] = [
  { id: 'bh-0', weekday: 0, is_open: false, start_time: '10:00:00', end_time: '16:00:00' }, // Sun: Closed
  { id: 'bh-1', weekday: 1, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' }, // Mon
  { id: 'bh-2', weekday: 2, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' }, // Tue
  { id: 'bh-3', weekday: 3, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' }, // Wed
  { id: 'bh-4', weekday: 4, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' }, // Thu
  { id: 'bh-5', weekday: 5, is_open: true,  start_time: '09:00:00', end_time: '18:00:00' }, // Fri
  { id: 'bh-6', weekday: 6, is_open: true,  start_time: '10:00:00', end_time: '16:00:00' }, // Sat
];

export const DEFAULT_SERVICES: Service[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Initial Wedding Vision & Concept Consultation',
    description: 'A bespoke 60-minute planning session exploring your aesthetic vision, color palettes, venue aspirations, and overall wedding budget framework with our principal creative director.',
    duration_minutes: 60,
    price: 150.00,
    is_active: true,
    created_at: '2026-01-10T12:00:00Z',
    image_url: WEDDING_IMAGES.services.consultation.url,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Full-Service Wedding Planning & Creative Direction',
    description: 'Comprehensive end-to-end wedding production consultation covering guest experience design, curated vendor procurement, architectural floor planning, and timeline orchestration.',
    duration_minutes: 90,
    price: 300.00,
    is_active: true,
    created_at: '2026-01-10T12:00:00Z',
    image_url: WEDDING_IMAGES.services.fullService.url,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Wedding Design, Florals & Tablescape Styling Session',
    description: 'A dedicated tactile styling consultation focused on bespoke floral artistry, tableware curation, custom linens, ambient lighting design, and stationery presentation.',
    duration_minutes: 60,
    price: 200.00,
    is_active: true,
    created_at: '2026-01-10T12:00:00Z',
    image_url: WEDDING_IMAGES.services.designStyling.url,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Day-of Wedding Coordination & Production Review',
    description: 'Detailed logistical alignment meeting 6-8 weeks prior to your celebration. We review vendor contracts, load-in schedules, ceremony choreography, and comprehensive minute-by-minute day timelines.',
    duration_minutes: 75,
    price: 225.00,
    is_active: true,
    created_at: '2026-01-10T12:00:00Z',
    image_url: WEDDING_IMAGES.services.coordination.url,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Curated Destination & Intimate Elopement Planning',
    description: 'Private consultation dedicated to micro-weddings and destination celebrations. Covering guest travel logistics, private villa sourcing, intimate ceremony pacing, and local vendor sourcing.',
    duration_minutes: 60,
    price: 180.00,
    is_active: true,
    created_at: '2026-01-10T12:00:00Z',
    image_url: WEDDING_IMAGES.services.elopement.url,
  },
];

export const DEFAULT_BLOCKED_DATES: BlockedDate[] = [
  {
    id: 'block-1',
    blocked_date: '2026-11-26', // Thanksgiving
    reason: 'National Holiday & Studio Closed',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'block-2',
    blocked_date: '2026-12-25', // Christmas
    reason: 'Studio Winter Holiday',
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const DEFAULT_SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    full_name: 'Genevieve Dupré & Marcus Vance',
    email: 'genevieve.dupre@example.com',
    phone: '(415) 555-0192',
    service_id: '11111111-1111-1111-1111-111111111111',
    appointment_date: '2026-11-05',
    start_time: '11:00:00',
    end_time: '12:00:00',
    status: 'confirmed',
    notes: 'Planning an autumn vineyard wedding in Napa Valley. Target guest count: 180.',
    created_at: '2026-10-25T14:20:00Z',
  },
  {
    id: 'app-2',
    full_name: 'Sophia Thorne & Liam Chen',
    email: 'sophia.thorne@example.com',
    phone: '(415) 555-0144',
    service_id: '22222222-2222-2222-2222-222222222222',
    appointment_date: '2026-11-06',
    start_time: '14:00:00',
    end_time: '15:30:00',
    status: 'pending',
    notes: 'Looking for full-service coordination for a historic conservatory celebration next spring.',
    created_at: '2026-10-28T09:15:00Z',
  },
  {
    id: 'app-3',
    full_name: 'Camille & Julien Laurent',
    email: 'camille.l@example.com',
    phone: '(415) 555-0188',
    service_id: '33333333-3333-3333-3333-333333333333',
    appointment_date: '2026-11-07',
    start_time: '10:00:00',
    end_time: '11:00:00',
    status: 'confirmed',
    notes: 'Need tactile floral and tablescape styling review with linen samples.',
    created_at: '2026-10-29T16:40:00Z',
  },
];
