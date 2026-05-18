# ⚡ Quick Reference Guide - Commands & Code

यह एक **cheat sheet** है जिसमें सभी important commands और code snippets हैं।
This is a quick reference for all important commands and snippets.

---

## 🚀 Installation & Setup Commands

```bash
# Project setup
cd d:\rana\CampusConnect
npm install

# .env.local भरने के लिए
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Development server start करो
npm run dev

# Production के लिए build करो
npm run build

# Production server start करो
npm start

# Linting check करो
npm run lint
```

---

## 🗄️ Database SQL Commands

### Users Table
```sql
-- User create करना (signup के दौरान)
INSERT INTO users (id, email, full_name, bio, college, department)
VALUES ('uuid', 'student@college.com', 'नाम', 'Bio', 'IIT Delhi', 'CSE');

-- User profile fetch करना
SELECT * FROM users WHERE id = 'uuid';

-- सभी users fetch करना
SELECT * FROM users ORDER BY created_at DESC;

-- User को admin बनाना
UPDATE users SET is_admin = true WHERE email = 'admin@college.com';

-- User profile update करना
UPDATE users SET full_name = 'नया नाम', bio = 'नया bio' WHERE id = 'uuid';

-- User delete करना
DELETE FROM users WHERE id = 'uuid';
```

### Posts Table
```sql
-- Post create करना
INSERT INTO posts (user_id, title, content, image_url)
VALUES ('user-id', 'Title', 'Content', 'url');

-- सभी posts fetch करना (users के साथ)
SELECT posts.*, users.full_name, users.avatar_url 
FROM posts 
JOIN users ON posts.user_id = users.id 
ORDER BY posts.created_at DESC;

-- एक specific post fetch करना
SELECT * FROM posts WHERE id = 'post-id';

-- User के posts fetch करना
SELECT * FROM posts WHERE user_id = 'user-id' ORDER BY created_at DESC;

-- Post update करना
UPDATE posts SET content = 'नया content' WHERE id = 'post-id';

-- Post delete करना
DELETE FROM posts WHERE id = 'post-id';

-- Like count update करना (trigger से automatic होता है)
UPDATE posts SET likes_count = (SELECT COUNT(*) FROM likes WHERE post_id = 'id');
```

### Likes Table
```sql
-- Like add करना
INSERT INTO likes (user_id, post_id)
VALUES ('user-id', 'post-id');

-- Like remove करना
DELETE FROM likes WHERE user_id = 'user-id' AND post_id = 'post-id';

-- Check करना user ने like किया या नहीं
SELECT * FROM likes WHERE user_id = 'user-id' AND post_id = 'post-id';

-- Post के total likes count करना
SELECT COUNT(*) as likes_count FROM likes WHERE post_id = 'post-id';

-- User के सभी likes fetch करना
SELECT * FROM likes WHERE user_id = 'user-id';
```

### Comments Table
```sql
-- Comment add करना
INSERT INTO comments (user_id, post_id, content)
VALUES ('user-id', 'post-id', 'Comment text');

-- Post के सभी comments fetch करना
SELECT comments.*, users.full_name, users.avatar_url
FROM comments
JOIN users ON comments.user_id = users.id
WHERE post_id = 'post-id'
ORDER BY comments.created_at DESC;

-- Comment update करना
UPDATE comments SET content = 'नया comment' WHERE id = 'comment-id';

-- Comment delete करना
DELETE FROM comments WHERE id = 'comment-id';

-- Comments count करना
SELECT COUNT(*) FROM comments WHERE post_id = 'post-id';
```

---

## 🔐 Authentication SQL

```sql
-- Supabase Auth में user create (direct SQL से नहीं, API से)
-- Frontend से:
const { data } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
});

-- Auth users को देखना
SELECT id, email, created_at FROM auth.users;

-- User profile delete करना (उसके auth account के साथ)
DELETE FROM users WHERE id = 'uuid';
-- (ON DELETE CASCADE से auth record भी delete हो जाएगा)
```

---

## 📝 React/TypeScript Code Snippets

### useAuth Hook का उपयोग
```typescript
import { useAuth } from '@/context/AuthContext';

export default function MyComponent() {
  const { user, session, isAdmin, signIn, signUp, signOut, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return <p>Please login</p>;
  }

  return (
    <div>
      <p>Welcome {user?.full_name}</p>
      {isAdmin && <p>You are admin</p>}
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}
```

### Supabase Client का उपयोग
```typescript
import { supabase, Post, User } from '@/utils/supabase';

// SELECT
const { data: posts, error } = await supabase
  .from('posts')
  .select('*, users(*)')
  .order('created_at', { ascending: false });

// INSERT
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    content: 'My post',
    image_url: null
  });

// UPDATE
const { data, error } = await supabase
  .from('posts')
  .update({ content: 'Updated' })
  .eq('id', postId);

// DELETE
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId);

// WITH ERROR HANDLING
try {
  const { data, error } = await supabase
    .from('posts')
    .select();
  
  if (error) throw error;
  console.log('Success:', data);
} catch (error) {
  console.error('Error:', error);
}
```

### Material UI Component Examples
```typescript
import { Button, TextField, Card, CardContent, Avatar, Box } from '@mui/material';

// Button
<Button variant="contained" color="primary" onClick={handleClick}>
  Click me
</Button>

// TextField (input)
<TextField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
/>

// Card (container)
<Card>
  <CardContent>
    <h2>Title</h2>
    <p>Content</p>
  </CardContent>
</Card>

// Avatar (profile picture)
<Avatar src={imageUrl}>
  {name[0]}
</Avatar>

// Box (flexbox container)
<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Box>
```

---

## 🖼️ Image Upload Code

```typescript
// File selection
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.type.startsWith('image/')) {
    setSelectedFile(file);
  }
};

// Upload
const uploadImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('posts-images')
    .upload(`posts/${fileName}`, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('posts-images')
    .getPublicUrl(`posts/${fileName}`);

  return publicUrl.publicUrl;
};

// HTML
<input 
  type="file" 
  accept="image/*" 
  onChange={handleFileSelect} 
/>
```

---

## 🔍 Common Supabase Queries

```typescript
// Fetch with JOIN
const { data } = await supabase
  .from('posts')
  .select('*, users(*), comments(*)');

// Fetch with WHERE
const { data } = await supabase
  .from('posts')
  .select()
  .eq('user_id', userId);

// Fetch with ORDER
const { data } = await supabase
  .from('posts')
  .select()
  .order('created_at', { ascending: false });

// Fetch with LIMIT
const { data } = await supabase
  .from('posts')
  .select()
  .limit(10);

// Fetch with multiple conditions
const { data } = await supabase
  .from('posts')
  .select()
  .eq('user_id', userId)
  .gt('created_at', '2024-01-01');

// Count
const { count } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true });

// Check if exists
const { data } = await supabase
  .from('likes')
  .select()
  .eq('user_id', userId)
  .eq('post_id', postId)
  .single();

if (data) console.log('Already liked');
else console.log('Not liked');
```

---

## 📁 File Structure Quick Reference

```
CampusConnect/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── feed/page.tsx
│   ├── profile/page.tsx
│   ├── admin/page.tsx
│   ├── layout.tsx
│   └── page.tsx (home)
│
├── components/
│   ├── NavBar.tsx
│   ├── ProtectedRoute.tsx
│   ├── CreatePost.tsx
│   ├── PostCard.tsx
│   └── Comment.tsx
│
├── context/
│   └── AuthContext.tsx
│
├── utils/
│   └── supabase.ts
│
├── styles/
│   └── globals.css
│
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.local (create this)
├── DATABASE_SCHEMA.sql
├── RLS_POLICIES.sql
└── README.md
```

---

## 🔐 Important Security Checklist

```
BEFORE DEPLOYMENT:
☑️ .env.local में Supabase keys हैं
☑️ .env.local को .gitignore में add किया
☑️ All RLS policies enabled हैं
☑️ Storage bucket "public" है
☑️ UNIQUE constraint लगा है likes table में
☑️ Foreign keys properly set हैं
☑️ Passwords never logged/exposed हैं
☑️ Only HTTPS URLs use हो रहे हैं

TESTING:
☑️ Different users से test किया
☑️ Normal user सिर्फ अपना data access कर सकता है
☑️ Admin किसी का भी post delete कर सकता है
☑️ Unauthenticated users protected pages access नहीं कर सकते
☑️ Images properly upload और display हो रहे हैं
```

---

## 🚨 Debugging Tips

```bash
# Errors check करो
console.log('Error:', error);
console.log('Data:', data);

# Network requests देखो
Chrome DevTools → Network tab

# State values check करो
console.log('User:', user);
console.log('Session:', session);

# Supabase queries test करो
Supabase Dashboard → SQL Editor

# Browser console देखो
Chrome → F12 → Console tab

# Next.js build errors
npm run build

# TypeScript errors
npx tsc --noEmit
```

---

## 📊 Query Performance Tips

```typescript
// ❌ SLOW: बहुत सारा data fetch करना
const { data } = await supabase.from('posts').select('*');

// ✅ FAST: सिर्फ जरूरी columns
const { data } = await supabase
  .from('posts')
  .select('id, content, created_at, user_id');

// ❌ SLOW: सभी data एक साथ
const { data } = await supabase.from('posts').select('*, comments(*)');

// ✅ FAST: Pagination करना
const { data } = await supabase
  .from('posts')
  .select()
  .limit(10)
  .offset(0);
```

---

## 🎯 Useful Links

```
Supabase Docs: https://supabase.com/docs
Next.js Docs: https://nextjs.org/docs
Material UI: https://mui.com
React Docs: https://react.dev
PostgreSQL: https://www.postgresql.org/docs
TypeScript: https://www.typescriptlang.org
```

---

## 🆘 Common Errors & Fixes

| Error | Solution |
|-------|----------|
| "Cannot find module '@supabase/supabase-js'" | `npm install @supabase/supabase-js` |
| "RLS policy denying access" | Check RLS policies in database |
| "Image upload fails" | Check storage bucket is public |
| "User not defined in context" | Wrap component with `<AuthProvider>` |
| "TypeScript error" | Run `npx tsc --noEmit` to see issues |
| "Blank page after login" | Check .env.local keys हैं |
| "Like button not working" | Check RLS policy for likes table |

---

**ये reference guide को bookmark करो - काम आएगी!** 📌
