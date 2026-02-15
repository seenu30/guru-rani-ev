import { z } from 'zod';

// Indian phone number regex (10 digits starting with 6-9)
const indianPhoneRegex = /^[6-9]\d{9}$/;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .regex(indianPhoneRegex, 'Invalid Indian phone number')
    .transform((val) => val.replace(/\s/g, '')),
  city: z.string().min(2, 'City is required').max(100),
  modelId: z.union([z.string().regex(uuidRegex), z.literal('')]).optional().transform(val => val === '' ? undefined : val),
  message: z.string().max(500).optional(),
  source: z.string().max(50).optional(),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']),
  notes: z.string().max(1000).optional(),
});

export const queryLeadsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['created_at', 'name', 'status']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type QueryLeadsInput = z.infer<typeof queryLeadsSchema>;
