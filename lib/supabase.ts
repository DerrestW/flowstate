import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

// Shared types
export type Inquiry = {
  id: string; name: string; email: string; phone?: string; organization?: string;
  city: string; state: string; event_date?: string; expected_attendance?: number;
  budget_range?: string; message?: string; experience_interest?: string[];
  status: string; created_at: string; notes?: string;
};

export type City = {
  id: string; name: string; state: string; country: string;
  description?: string; image_url?: string; featured: boolean; published: boolean;
  sort_order: number; created_at: string;
  events_count?: number; participants_count?: number;
};

export type Experience = {
  id: string; slug: string; title: string; tagline?: string; description?: string;
  long_description?: string; category: string; hero_image?: string;
  gallery_images?: string[]; capacity_min?: number; capacity_max?: number;
  duration?: string; price_starting?: number; price_unit?: string;
  featured: boolean; published: boolean; sort_order: number;
  created_at: string; updated_at: string;
};

export type Testimonial = {
  id: string; quote: string; author: string; title?: string;
  org?: string; organization?: string; city?: string; experience?: string; featured?: boolean; published: boolean; sort_order: number; created_at: string;
};
