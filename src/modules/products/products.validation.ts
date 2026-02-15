import { z } from 'zod';

export const getProductBySlugSchema = z.object({
  slug: z.string().min(1).max(100),
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  tagline: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional(),
  status: z.enum(['active', 'draft', 'archived']).default('draft'),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  modelId: z.string().uuid(),
  name: z.string().min(2).max(50),
  price: z.number().positive(),
  rangeKm: z.number().positive().max(500),
  topSpeed: z.number().positive().max(200),
  battery: z.string().min(1).max(50),
  chargingTime: z.string().min(1).max(50),
  motorPower: z.string().min(1).max(50),
  bootSpace: z.number().positive().optional(),
  specs: z.record(z.string(), z.unknown()).optional(),
});

export const createColorSchema = z.object({
  variantId: z.string().uuid(),
  name: z.string().min(2).max(50),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  imageUrl: z.string().url().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type CreateColorInput = z.infer<typeof createColorSchema>;
