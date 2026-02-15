import { z } from 'zod';

/**
 * Environment variable validation schema
 * All environment variables must be validated here
 */
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Guru Rani'),

  // Optional: Analytics, etc.
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

/**
 * Client-side environment variables (NEXT_PUBLIC_*)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Guru Rani'),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

/**
 * Type for the full config
 */
export type Config = z.infer<typeof envSchema>;

/**
 * Type for client-only config
 */
export type ClientConfig = z.infer<typeof clientEnvSchema>;

/**
 * Validated environment configuration
 * This will throw an error at build/startup if env vars are missing
 */
function getConfig(): Config {
  // In development, we might not have all env vars set
  // In production, we want to fail fast if env vars are missing
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);

    // In production, throw error. In development, return defaults for missing vars
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment variables');
    }

    // Return defaults for development
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dev-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: 'development',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_APP_NAME: 'Guru Rani',
      NEXT_PUBLIC_GA_ID: undefined,
    };
  }

  return parsed.data;
}

/**
 * Get client-safe configuration
 * Only includes NEXT_PUBLIC_* variables
 */
function getClientConfig(): ClientConfig {
  return {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dev-anon-key',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Guru Rani',
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  };
}

/**
 * Full configuration (server-side only)
 */
export const config = getConfig();

/**
 * Client-safe configuration
 */
export const clientConfig = getClientConfig();

/**
 * Helper to check if we're in production
 */
export const isProduction = config.NODE_ENV === 'production';

/**
 * Helper to check if we're in development
 */
export const isDevelopment = config.NODE_ENV === 'development';

/**
 * Helper to check if we're in test mode
 */
export const isTest = config.NODE_ENV === 'test';
