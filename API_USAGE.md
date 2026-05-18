# 📚 API Usage Guide - How to Use Supabase Client

यह guide बताता है कि **Supabase client** का use कैसे करते हैं।
This explains how to use Supabase in your code.

---

## 🔧 Supabase Client Setup

```typescript
// utils/supabase.ts में client initialized है
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export { supabase };
```

---

## 📖 Common Operations

### 1️⃣ INSERT - डेटा add करना

```typescript
// Users table में नया user add करना
const { data, error } = await supabase
  .from('users')
  .insert({
    id: user_id,
    email: 'student@college.com',
    full_name: 'राज कुमार',
    college: 'IIT Delhi'
  });

if (error) console.log('Error:', error);
else console.log('Success:', data);
```

### 2️⃣ SELECT - डेटा read करना

```typescript
// सभी posts लाना (latest first)
const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });

// एक specific post लाना
const { data: post, error } = await supabase
  .from('posts')
  .select('*')
  .eq('id', 'post-id')
  .single();  // एक ही record return करेगा

// सभी posts user के साथ (JOIN)
const { data: posts, error } = await supabase
  .from('posts')
  .select('*, users(*)')  // users table का data भी लाएगा
  .order('created_at', { ascending: false });
```

### 3️⃣ UPDATE - डेटा modify करना

```typescript
// User की profile update करना
const { data, error } = await supabase
  .from('users')
  .update({
    full_name: 'नया नाम',
    bio: 'मैं IIT में हूँ'
  })
  .eq('id', user_id);

// Post update करना
const { data, error } = await supabase
  .from('posts')
  .update({ content: 'Updated content' })
  .eq('id', post_id);
```

### 4️⃣ DELETE - डेटा remove करना

```typescript
// एक post delete करना
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', post_id);

// एक like delete करना (unlike करना)
const { error } = await supabase
  .from('likes')
  .delete()
  .eq('post_id', post_id)
  .eq('user_id', user_id);

// एक comment delete करना
const { error } = await supabase
  .from('comments')
  .delete()
  .eq('id', comment_id);
```

---

## 🔐 Authentication

```typescript
// SIGNUP
const { data, error } = await supabase.auth.signUp({
  email: 'student@college.com',
  password: 'SecurePassword123'
});

// अब users table में profile भी बनानी है
await supabase.from('users').insert({
  id: data.user.id,  // Auth user की ID
  email: 'student@college.com',
  full_name: 'राज'
});

// LOGIN
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'student@college.com',
  password: 'SecurePassword123'
});

// LOGOUT
await supabase.auth.signOut();

// Get Current Session
const { data: { session } } = await supabase.auth.getSession();
const user_id = session?.user.id;
```

---

## 📁 File Upload (Storage)

```typescript
// 1. File select करना
const file = e.target.files[0];

// 2. Upload करना
const { data, error } = await supabase.storage
  .from('posts-images')  // bucket का नाम
  .upload('posts/image.jpg', file);  // path और file

// 3. Public URL लाना
const { data: publicUrl } = supabase.storage
  .from('posts-images')
  .getPublicUrl('posts/image.jpg');

// 4. URL को database में save करना
await supabase.from('posts').insert({
  user_id: user_id,
  content: 'My post',
  image_url: publicUrl.publicUrl  // यह URL है
});
```

---

## 🎯 Real-World Examples

### Example 1: Post Create करना

```typescript
async function createPost(content, imageFile) {
  // Step 1: Image upload करो
  let imageUrl = null;
  if (imageFile) {
    const fileName = `${Date.now()}-${imageFile.name}`;
    await supabase.storage
      .from('posts-images')
      .upload(`posts/${fileName}`, imageFile);
    
    const { data: url } = supabase.storage
      .from('posts-images')
      .getPublicUrl(`posts/${fileName}`);
    
    imageUrl = url.publicUrl;
  }

  // Step 2: Post database में save करो
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: currentUser.id,
      content: content,
      image_url: imageUrl
    })
    .select();

  return post[0];
}
```

### Example 2: Like/Unlike करना

```typescript
async function toggleLike(postId, userId) {
  // Step 1: Check करो पहले से liked है?
  const { data: existingLike } = await supabase
    .from('likes')
    .select()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    // Step 2a: अगर liked है तो unlike करो
    await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);
    
    return 'unliked';
  } else {
    // Step 2b: अगर नहीं liked है तो like करो
    await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId });
    
    return 'liked';
  }
}
```

### Example 3: Comments के साथ Posts लाना

```typescript
async function getPostWithComments(postId) {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      users(*),
      comments(
        *,
        users(*)
      )
    `)
    .eq('id', postId)
    .single();

  return post;
  // Result:
  // {
  //   id: 'post-id',
  //   content: 'Post content',
  //   users: { id, name, email, ... },
  //   comments: [
  //     { id, content, users: { id, name, ... } },
  //     { id, content, users: { id, name, ... } }
  //   ]
  // }
}
```

---

## 🔗 Relationships (JOIN)

```typescript
// Posts के साथ user की information भी लाना
const { data } = await supabase
  .from('posts')
  .select('*, users(*)')  // users table join होगा

// Posts के साथ likes count
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users(*),
    likes(count),
    comments(count)
  `)

// Multiple levels deep
const { data } = await supabase
  .from('posts')
  .select(`
    *,
    users(*),
    comments(
      *,
      users(*)
    ),
    likes(*)
  `)
```

---

## 🎯 Filters & Queries

```typescript
// WHERE clause
const { data } = await supabase
  .from('posts')
  .select()
  .eq('user_id', userId);  // WHERE user_id = userId

// Multiple conditions
const { data } = await supabase
  .from('posts')
  .select()
  .eq('user_id', userId)
  .gt('created_at', '2024-01-01');  // AND created_at > 2024-01-01

// OR condition
const { data } = await supabase
  .from('posts')
  .select()
  .or('user_id.eq.' + userId + ',public.eq.true');

// LIKE (text search)
const { data } = await supabase
  .from('posts')
  .select()
  .ilike('content', '%hello%');  // Content में 'hello' है?

// LIMIT & OFFSET
const { data } = await supabase
  .from('posts')
  .select()
  .limit(10)  // सिर्फ 10 posts
  .offset(0);  // 0 से शुरू करो

// ORDER BY
const { data } = await supabase
  .from('posts')
  .select()
  .order('created_at', { ascending: false });  // Latest first
```

---

## ⚠️ Error Handling

```typescript
try {
  const { data, error } = await supabase
    .from('posts')
    .select()
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Supabase error:', error.message);
    // Handle error properly
    throw new Error(error.message);
  }

  console.log('Success:', data);
} catch (error) {
  console.error('Application error:', error);
}
```

---

## 📊 Common Patterns

### Pattern 1: Check if User Liked Post

```typescript
async function hasUserLikedPost(postId, userId) {
  const { data } = await supabase
    .from('likes')
    .select()
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !!data;  // true or false
}
```

### Pattern 2: Get User's Own Posts

```typescript
async function getUserPosts(userId) {
  const { data } = await supabase
    .from('posts')
    .select('*, users(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return data;
}
```

### Pattern 3: Count Comments on Post

```typescript
async function getCommentCount(postId) {
  const { count } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  return count;
}
```

---

## 🔑 Auth Helper Functions

```typescript
// Get current user
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Check if user is logged in
async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// Get user profile
async function getUserProfile(userId) {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return data;
}

// Check if user is admin
async function isUserAdmin(userId) {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', userId)
    .single();

  return data?.is_admin || false;
}
```

---

## 📚 Type Safety

```typescript
// TypeScript का use करते हुए safe queries

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*');

  return data as Post[] || [];
}

// अब TypeScript जानता है कि data एक Post array है
```

---

## 🚀 Performance Tips

```typescript
// ❌ BAD: सभी columns fetch करना
const { data } = await supabase
  .from('posts')
  .select('*');  // सभी 20 columns

// ✅ GOOD: सिर्फ जरूरी columns
const { data } = await supabase
  .from('posts')
  .select('id, content, created_at, user_id');

// ❌ BAD: सभी posts fetch करना
const { data } = await supabase
  .from('posts')
  .select('*');  // 10,000 posts!

// ✅ GOOD: Paginate करना
const { data } = await supabase
  .from('posts')
  .select('*')
  .limit(10)
  .offset(0);
```

---

**अब आप Supabase को आसानी से use कर सकते हो!** 🚀
