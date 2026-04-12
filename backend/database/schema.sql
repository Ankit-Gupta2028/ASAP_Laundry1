-- Copy and paste this script directly into your Supabase SQL Editor to create all necessary tables.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    is_email_verified BOOLEAN DEFAULT FALSE,
    enrollment_number TEXT,
    bag_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- OTPs Table
CREATE TABLE public.otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL REFERENCES public.users(username) ON DELETE CASCADE,
    otp TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE public.orders (
    order_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    username TEXT,
    user_email TEXT,
    enrollment_number TEXT,
    items JSONB,
    preferred_pickup_date TEXT,
    preferred_pickup_time TEXT,
    special_instructions TEXT,
    pickup_date TEXT,
    pickup_time TEXT,
    status TEXT DEFAULT 'Unpack',
    user_pickup_confirmed BOOLEAN DEFAULT FALSE,
    is_confirmed BOOLEAN DEFAULT FALSE,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
