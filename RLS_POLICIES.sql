-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- यह policies define करती हैं कि कौन कौन सा data access कर सकता है
-- Paste these policies into Supabase SQL Editor after creating the schema

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Policy: Everyone can view user profiles
CREATE POLICY "Users are viewable by everyone"
ON users FOR SELECT
USING (true);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (on signup)
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id AND auth.role() = 'authenticated');

-- ============================================================================
-- POSTS TABLE POLICIES
-- ============================================================================

-- Policy: Everyone can view posts
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
USING (true);

-- Policy: Users can create posts
CREATE POLICY "Users can create their own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
))
WITH CHECK (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
));

-- Policy: Users can delete their own posts, admins can delete any post
CREATE POLICY "Users can delete their own posts, admins can delete any"
ON posts FOR DELETE
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
));

-- ============================================================================
-- LIKES TABLE POLICIES
-- ============================================================================

-- Policy: Everyone can view likes
CREATE POLICY "Likes are viewable by everyone"
ON likes FOR SELECT
USING (true);

-- Policy: Users can create their own likes
CREATE POLICY "Users can create their own likes"
ON likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
ON likes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================================
-- COMMENTS TABLE POLICIES
-- ============================================================================

-- Policy: Everyone can view comments
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
USING (true);

-- Policy: Users can create comments
CREATE POLICY "Users can create comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own comments, admins can delete any
CREATE POLICY "Users can delete their own comments, admins can delete any"
ON comments FOR DELETE
USING (auth.uid() = user_id OR EXISTS (
  SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
));
