-- Mentora Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    unique_filename TEXT NOT NULL,
    s3_url TEXT NOT NULL,
    s3_key TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    content_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
    id TEXT PRIMARY KEY,
    video_id TEXT NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    syllabus_text TEXT NOT NULL,
    engagement_score DECIMAL(3,1) NOT NULL,
    clarity_score DECIMAL(3,1) NOT NULL,
    concept_coverage_score DECIMAL(3,1) NOT NULL,
    pedagogy_score DECIMAL(3,1) NOT NULL,
    overall_score DECIMAL(3,1) NOT NULL,
    summary TEXT NOT NULL,
    recommendations TEXT[] NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_user_id ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_video_id ON evaluations(video_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluated_at ON evaluations(evaluated_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Videos policies
CREATE POLICY "Users can view own videos" ON videos
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own videos" ON videos
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own videos" ON videos
    FOR DELETE USING (auth.uid()::text = user_id);

-- Evaluations policies
CREATE POLICY "Users can view own evaluations" ON evaluations
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own evaluations" ON evaluations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own evaluations" ON evaluations
    FOR DELETE USING (auth.uid()::text = user_id);