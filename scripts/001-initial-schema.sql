-- Bảng lưu trữ thông tin hồ sơ người dùng liên quan đến việc cai thuốc
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  quit_date DATE,
  cigs_per_day_before INTEGER,
  cost_per_pack NUMERIC,
  full_name TEXT,
  avatar_url TEXT
);

-- Chính sách Bảo mật Cấp Độ Hàng (RLS) cho bảng profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Cho phép người dùng đã xác thực đọc hồ sơ của chính họ
CREATE POLICY "Allow authenticated users to read their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Cho phép người dùng đã xác thực cập nhật hồ sơ của chính họ
CREATE POLICY "Allow authenticated users to update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Hàm để xử lý việc tạo hồ sơ mới khi người dùng đăng ký
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$;

-- Trigger gọi hàm handle_new_user sau khi một người dùng mới được tạo trong auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
