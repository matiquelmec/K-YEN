-- SQL Script to add Mercado Pago integration columns to public.orders table
-- Copy and paste this script in your Supabase SQL Editor (https://supabase.com/dashboard -> SQL Editor)

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
