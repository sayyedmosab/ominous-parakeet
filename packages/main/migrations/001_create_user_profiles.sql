-- Migration: Create user_profiles table and enhance authentication system
-- This migration should be run in the Supabase SQL editor

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  bio TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one profile per user
  CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view user profiles" 
  ON public.user_profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster user lookups
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx 
  ON public.user_profiles(user_id);

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS user_profiles_role_idx 
  ON public.user_profiles(role);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add is_reported and is_moderated columns to forum_comments for moderation
ALTER TABLE public.forum_comments 
ADD COLUMN IF NOT EXISTS is_reported BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_moderated BOOLEAN DEFAULT false;

-- Update RLS policies for forum_comments to include moderation
DROP POLICY IF EXISTS "update_auth" ON public.forum_comments;
CREATE POLICY "Users can update own comments" 
  ON public.forum_comments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Moderators can moderate any comment" 
  ON public.forum_comments 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role IN ('moderator', 'admin')
    )
  );

-- Create index for moderation queries
CREATE INDEX IF NOT EXISTS forum_comments_is_reported_idx 
  ON public.forum_comments(is_reported);

CREATE INDEX IF NOT EXISTS forum_comments_is_moderated_idx 
  ON public.forum_comments(is_moderated);