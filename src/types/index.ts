// Re-export Supabase types
export * from './supabase';

// Common UI types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Button variants
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

// Form types
export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

// API response types
export interface ApiError {
  code: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

// Product types
export interface ProductWithVariants {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  variants: VariantWithColors[];
}

export interface VariantWithColors {
  id: string;
  name: string;
  price: number;
  range: number;
  top_speed: number;
  battery: string;
  charging_time: string;
  motor_power: string;
  boot_space: number | null;
  colors: ColorOption[];
}

export interface ColorOption {
  id: string;
  name: string;
  hex_code: string;
  image_url: string | null;
}

// Savings calculator types
export interface SavingsCalculation {
  dailyKm: number;
  daysPerMonth: number;
  petrolCostPerMonth: number;
  electricCostPerMonth: number;
  monthlySavings: number;
  annualSavings: number;
}

// Lead form types
export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  modelId?: string;
  message?: string;
  source?: string;
}

// Test ride booking types
export interface TestRideFormData {
  name: string;
  email: string;
  phone: string;
  dealerId: string;
  modelId?: string;
  date: string;
  timeSlot: string;
}

// Comparison types
export interface ComparisonModel {
  id: string;
  name: string;
  variantName: string;
  price: number;
  range: number;
  topSpeed: number;
  battery: string;
  chargingTime: string;
  motorPower: string;
  bootSpace: number | null;
  imageUrl: string | null;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image?: string;
}

// FAQ types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface FAQCategory {
  name: string;
  items: FAQItem[];
}
