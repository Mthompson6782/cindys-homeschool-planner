-- schema.sql
-- Run this in your Supabase SQL Editor to create the necessary tables for Cindy's Home School App

-- Create Users Table (for Leo, Alex, and Cindy)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default users
INSERT INTO users (name, role) VALUES ('Leo', 'student');
INSERT INTO users (name, role) VALUES ('Alex', 'student');
INSERT INTO users (name, role) VALUES ('Cindy', 'parent');

-- Create Assignments/Activities Table
CREATE TABLE assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  series_id UUID, -- Useful for "bumping forward" a series of connected assignments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Blackout Dates Table
CREATE TABLE blackout_dates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) to allow public access for this specific app (since it's a private homeschool app)
-- Note: In a production app with auth, you'd restrict this. For ease of use, we are allowing anon access right now.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read/write access to users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read/write access to assignments" ON assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anonymous read/write access to blackout_dates" ON blackout_dates FOR ALL USING (true) WITH CHECK (true);
