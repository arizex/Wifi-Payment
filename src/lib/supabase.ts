import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  monthly_fee: number;
  is_active: boolean;
  payment_day: number;
  created_at: string;
}

export interface Payment {
  id: string;
  customer_id: string;
  payment_date: string;
  month: number;
  year: number;
  amount: number;
  notes: string;
  created_at: string;

  customer?: {
    name: string;
  }
}
