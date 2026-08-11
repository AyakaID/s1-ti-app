-- ============================================================
-- S1-TI Learning Platform - Phase 5 Migration
-- Tambahkan kolom discord_id ke tabel profiles & update trigger
-- ============================================================

-- 1. Tambahkan kolom discord_id jika belum ada
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS discord_id TEXT UNIQUE;

-- 2. Update fungsi trigger handle_new_user agar menyimpan provider_id saat user login via Discord OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    avatar_url, 
    discord_id, 
    is_admin, 
    points
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'user_name'),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'provider_id', new.raw_user_meta_data->>'sub'),
    false,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    discord_id = COALESCE(EXCLUDED.discord_id, profiles.discord_id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Query backfill untuk user yang sudah ada tetapi discord_id masih NULL
UPDATE public.profiles p
SET discord_id = u.raw_user_meta_data->>'provider_id'
FROM auth.users u
WHERE p.id = u.id AND p.discord_id IS NULL;
