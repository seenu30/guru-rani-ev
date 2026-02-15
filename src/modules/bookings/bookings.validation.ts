import { z } from 'zod';

const indianPhoneRegex = /^[6-9]\d{9}$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createBookingSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(indianPhoneRegex, 'Invalid Indian phone number')
    .transform((val) => val.replace(/\s/g, '')),
  dealerId: z.string().regex(uuidRegex, 'Please select a dealer'),
  modelId: z.union([z.string().regex(uuidRegex), z.literal('')]).optional().transform(val => val === '' ? undefined : val),
  bookingDate: z.string().refine((date) => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  }, 'Booking date must be today or later'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']),
  notes: z.string().max(500).optional(),
});

export const queryBookingsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']).optional(),
  dealerId: z.string().uuid().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type QueryBookingsInput = z.infer<typeof queryBookingsSchema>;

// Available time slots
export const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
];
