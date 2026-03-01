-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor)
-- This creates the tables needed for LearnWall

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    task TEXT NOT NULL,
    subtask TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'medium',
    category TEXT DEFAULT '',
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Preferences table
CREATE TABLE IF NOT EXISTS preferences (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    theme TEXT DEFAULT 'dark',
    avatar_type TEXT DEFAULT 'boy',
    avatar_style TEXT DEFAULT 'casual',
    custom_message TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users can read own schedules" ON schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules" ON schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules" ON schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules" ON schedules
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own preferences" ON preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own preferences" ON preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow the wallpaper API to read data via service role or anon key
-- (The wallpaper API uses uid param, not auth session)
CREATE POLICY "Wallpaper API can read schedules by uid" ON schedules
    FOR SELECT USING (true);

CREATE POLICY "Wallpaper API can read preferences by uid" ON preferences
    FOR SELECT USING (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_schedules_user_date ON schedules(user_id, date);
