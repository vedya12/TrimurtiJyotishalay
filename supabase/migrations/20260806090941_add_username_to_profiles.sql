/*
# Add username column to profiles table

## Purpose
Allows users to log in with a username instead of an email. Supabase Auth still
requires an email internally, so the frontend constructs a synthetic email of
the form `<username>@trimurti.app` for every signup/sign-in. The username column
on profiles stores the real, human-readable username so the UI can display it
and so we can enforce uniqueness.

## Changes
1. Adds `username` (text, UNIQUE) column to `profiles`.
2. Updates `handle_new_user()` trigger to also store the username from
   `raw_user_meta_data->>'username'`.
3. Adds an index on `username` for fast lookups.
*/

-- Add username column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username text;
  END IF;
END $$;

-- Unique constraint on username (only enforced for non-null values)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_username_unique'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
  END IF;
END $$;

-- Update trigger to include username
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
