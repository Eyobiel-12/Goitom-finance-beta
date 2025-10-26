-- Fix user profile creation trigger
-- This ensures that when a new user signs up, a profile is automatically created

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a function to ensure profile exists for existing users
CREATE OR REPLACE FUNCTION public.ensure_profile_exists()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if profile exists, if not create it
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()) THEN
    INSERT INTO public.profiles (id, email)
    VALUES (
      auth.uid(),
      (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NULL;
END;
$$;

-- Note: This function can be called manually for existing users if needed
-- SELECT public.ensure_profile_exists();
