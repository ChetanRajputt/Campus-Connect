# 🏗️ Project Architecture & Component Flow

यह document बताता है कि **सभी components कैसे एक दूसरे से जुड़े हुए हैं**।
This explains how all components work together.

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│                                                            │
│   ┌────────────────────────────────────────────────┐   │
│   │          Next.js Frontend (React)               │   │
│   │  ┌──────────────────────────────────────────┐  │   │
│   │  │         AuthContext.tsx                  │  │   │
│   │  │ (Manages: user, session, login/logout)  │  │   │
│   │  └──────────────────────────────────────────┘  │   │
│   │                      ↓                           │   │
│   │  ┌──────────────────────────────────────────┐  │   │
│   │  │  NavBar, Pages, Components                │  │   │
│   │  │  (UI Rendering)                          │  │   │
│   │  └──────────────────────────────────────────┘  │   │
│   │                      ↓                           │   │
│   │  ┌──────────────────────────────────────────┐  │   │
│   │  │  utils/supabase.ts                       │  │   │
│   │  │  (Client Initialization)                 │  │   │
│   │  └──────────────────────────────────────────┘  │   │
│   └────────────────────────────────────────────────┘   │
│                      ↓                                   │
└──────────────────────┼────────────────────────────────────┘
                       │ HTTP/REST API
                       ↓
┌──────────────────────────────────────────────────────────┐
│              SUPABASE BACKEND                             │
│                                                            │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Supabase Auth                           │    │
│  │  (Email/Password authentication)                │    │
│  └─────────────────────────────────────────────────┘    │
│                      ↓                                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │      PostgreSQL Database                        │    │
│  │  ├─ users table                                 │    │
│  │  ├─ posts table                                 │    │
│  │  ├─ likes table                                 │    │
│  │  └─ comments table                              │    │
│  │                                                  │    │
│  │  (RLS Policies enforce security)                │    │
│  └─────────────────────────────────────────────────┘    │
│                      ↓                                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │   Supabase Storage (posts-images bucket)        │    │
│  │   (Image files stored here)                     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Component Relationships

```
layout.tsx (Root Layout)
├── AuthProvider (Context)
│   └── Initializes authentication
│
├── NavBar
│   ├── Reads from: useAuth()
│   ├── Shows: Login/Signup or Logout based on auth state
│   └── Links to: feed, profile, admin
│
└── Page Content
    ├── page.tsx (Home)
    │   └── Redirects: authenticated → feed, else home page
    │
    ├── auth/login/page.tsx
    │   ├── Uses: useAuth().signIn
    │   └── Calls: Supabase Auth API
    │
    ├── auth/signup/page.tsx
    │   ├── Uses: useAuth().signUp
    │   └── Creates: Auth user + Profile in users table
    │
    ├── feed/page.tsx (Protected Route)
    │   ├── Wrapped in: <ProtectedRoute>
    │   ├── Contains: <CreatePost> + <PostCard> list
    │   └── Data flow:
    │       ├── Fetch posts from database
    │       ├── Show CreatePost component
    │       ├── Loop through posts and render PostCard
    │       └── Listen for updates
    │
    ├── profile/page.tsx (Protected Route)
    │   ├── Wrapped in: <ProtectedRoute>
    │   ├── Uses: useAuth().user
    │   ├── Reads from: users table
    │   └── Updates: useAuth().user data
    │
    └── admin/page.tsx (Protected Route - Admin Only)
        ├── Wrapped in: <ProtectedRoute adminOnly={true}>
        ├── Fetches: ALL posts from database
        ├── Shows: <PostCard> with delete permissions
        └── Uses: useAuth().isAdmin for checks
```

---

## 🔐 Authentication Flow Diagram

```
USER SIGNUP:
┌─────────────┐
│   Signup    │
│   Form      │
└──────┬──────┘
       │ email, password, name
       ↓
┌─────────────────────────────────┐
│  supabase.auth.signUp()         │
│  (Create auth.users record)     │
└──────┬──────────────────────────┘
       │ Returns: user.id
       ↓
┌─────────────────────────────────┐
│  Create profile in users table  │
│  INSERT {id, email, name}       │
└──────┬──────────────────────────┘
       │ Profile created
       ↓
┌─────────────────────────────────┐
│  AuthContext updated            │
│  useAuth() returns user data    │
└──────┬──────────────────────────┘
       │
       ↓
   REDIRECT TO FEED
   

USER LOGIN:
┌──────────────┐
│  Login Form  │
└──────┬───────┘
       │ email, password
       ↓
┌──────────────────────────────────┐
│  supabase.auth.signInWithPassword│
│  (Verify credentials)            │
└──────┬───────────────────────────┘
       │ Returns: session token
       ↓
┌──────────────────────────────────┐
│  Fetch user profile from users   │
│  SELECT * WHERE id = user.id     │
└──────┬───────────────────────────┘
       │ User data loaded
       ↓
┌──────────────────────────────────┐
│  AuthContext updated             │
│  useAuth() returns user + session│
└──────┬───────────────────────────┘
       │
       ↓
   REDIRECT TO FEED


PROTECTED ROUTE:
┌──────────────────┐
│  User navigates  │
│  to /feed        │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────┐
│  <ProtectedRoute>                │
│  check: session exists?          │
└────┬──────────────────────────┬──┘
     │YES                       │NO
     ↓                          ↓
  RENDER FEED          REDIRECT TO LOGIN
```

---

## 💬 Post & Comment Flow

```
CREATE POST:
┌──────────────────────┐
│  CreatePost Form     │
│  - content           │
│  - image (optional)  │
└─────────┬────────────┘
          │
          ↓
┌──────────────────────────────────┐
│  Upload image to storage (if any)│
│  POST /posts-images/...          │
└─────────┬────────────────────────┘
          │
          ↓
┌──────────────────────────────────┐
│  Get public URL                  │
│  (https://bucket.supabase.co/...) │
└─────────┬────────────────────────┘
          │
          ↓
┌──────────────────────────────────┐
│  INSERT into posts table         │
│  {user_id, content, image_url}   │
└─────────┬────────────────────────┘
          │
          ↓
┌──────────────────────────────────┐
│  Feed refreshes                  │
│  New post appears at top         │
└──────────────────────────────────┘


LIKE POST:
┌──────────────────┐
│  User clicks     │
│  Like button     │
└─────────┬────────┘
          │
          ↓
┌──────────────────────────────────┐
│  Check: already liked?           │
│  SELECT * FROM likes WHERE...    │
└────┬──────────────────────────┬──┘
     │YES (liked)               │NO (not liked)
     ↓                          ↓
DELETE FROM likes       INSERT INTO likes
WHERE user_id=X         {post_id, user_id}
AND post_id=Y           
     │                          │
     ↓                          ↓
hearts_count--         hearts_count++
Heart icon unfilled    Heart icon filled
     │                          │
     └────────────┬─────────────┘
                  │
                  ↓
            UI updates


COMMENT:
┌──────────────────┐
│  User types      │
│  Comment         │
└─────────┬────────┘
          │
          ↓
┌──────────────────────────────────┐
│  INSERT into comments table      │
│  {post_id, user_id, content}     │
└─────────┬────────────────────────┘
          │
          ↓
┌──────────────────────────────────┐
│  Fetch updated comments          │
│  SELECT * FROM comments WHERE... │
└─────────┬────────────────────────┘
          │
          ↓
┌──────────────────────────────────┐
│  Comments list updates           │
│  New comment appears             │
└──────────────────────────────────┘
```

---

## 📁 Data Flow Example: Full User Journey

```
1. USER OPENS APP
   │
   └─→ layout.tsx loads
       └─→ AuthProvider initializes
           └─→ AuthContext.useEffect runs
               └─→ supabase.auth.getSession()
                   └─→ If session exists → fetchUserData()
                   └─→ users table query
                   └─→ setUser() state updated


2. USER NOT LOGGED IN
   │
   └─→ page.tsx checks session
       └─→ No session → Show home page
           └─→ Links to signup/login


3. USER SIGNS UP
   │
   └─→ auth/signup/page.tsx
       └─→ Form submit
           └─→ supabase.auth.signUp()
               └─→ Creates: auth.users
               └─→ Returns: user.id
           └─→ supabase.from('users').insert()
               └─→ Creates: user profile
               └─→ Returns: success
           └─→ AuthContext updates
               └─→ setSession() → user logged in
           └─→ router.push('/feed')


4. USER ON FEED PAGE
   │
   └─→ feed/page.tsx
       └─→ ProtectedRoute check
           └─→ Session exists → Render feed
       └─→ useEffect → fetchPosts()
           └─→ supabase.from('posts').select('*, users(*)')
               └─→ All posts with user info
           └─→ setPosts() state updated
       └─→ Render:
           ├─→ CreatePost component
           └─→ PostCard list (map through posts)


5. USER CREATES POST
   │
   └─→ CreatePost.tsx
       └─→ User types content
       └─→ User uploads image (optional)
           └─→ supabase.storage upload
               └─→ File saved
               └─→ Public URL returned
       └─→ handleCreatePost()
           └─→ supabase.from('posts').insert()
               └─→ {user_id, content, image_url}
           └─→ onPostCreated() callback
               └─→ fetchPosts() runs
                   └─→ Feed refreshes
                   └─→ New post shows


6. USER LIKES POST
   │
   └─→ PostCard.tsx
       └─→ User clicks heart icon
       └─→ handleLike()
           └─→ Check: already liked?
               └─→ supabase.from('likes').select()
           └─→ If yes: DELETE from likes
           └─→ If no: INSERT into likes
           └─→ likesCount updated
           └─→ UI re-renders


7. USER ADDS COMMENT
   │
   └─→ PostCard.tsx
       └─→ User clicks comment section
       └─→ loadComments() → fetch all comments
       └─→ User types comment
       └─→ handleAddComment()
           └─→ supabase.from('comments').insert()
           └─→ Fetch user data with comment
           └─→ setComments() state updated
           └─→ New comment renders


8. ADMIN DELETES POST
   │
   └─→ admin/page.tsx
       └─→ ProtectedRoute check: adminOnly=true
           └─→ Check: user.is_admin = true?
           └─→ Yes → Show all posts
       └─→ User clicks delete button
       └─→ handleDeletePost()
           └─→ supabase.from('posts').delete()
           └─→ Post removed from database
               └─→ RLS policy checks:
                   └─→ user.id == post.user_id OR is_admin=true
                   └─→ If true → DELETE allowed
           └─→ UI updates (post disappears)
```

---

## 🔌 Component Communication

```
AuthContext
  ├── Provides: user, session, isAdmin, signUp, signIn, signOut
  │
  ├─→ Used by: NavBar
  │   └─→ Shows: Login/Logout based on session
  │   └─→ Shows: Admin link if isAdmin=true
  │
  ├─→ Used by: ProtectedRoute
  │   └─→ Checks: session exists?
  │   └─→ Checks: isAdmin (for admin routes)
  │
  ├─→ Used by: CreatePost
  │   └─→ Gets: user.id (post author)
  │
  ├─→ Used by: PostCard
  │   └─→ Gets: user (for like/comment checks)
  │   └─→ Gets: isAdmin (for delete permissions)
  │
  ├─→ Used by: Profile Page
  │   └─→ Gets: user (display profile data)
  │   └─→ Updates: user profile
  │
  └─→ Used by: Admin Page
      └─→ Checks: isAdmin (page access)


Supabase Client
  ├─→ Used by: AuthContext
  │   └─→ Authentication: signUp, signIn, signOut, getSession
  │
  ├─→ Used by: Feed Page
  │   └─→ Fetch: All posts with users
  │
  ├─→ Used by: CreatePost
  │   └─→ Upload: Images to storage
  │   └─→ Insert: Post to database
  │
  ├─→ Used by: PostCard
  │   └─→ Like: Insert/Delete from likes
  │   └─→ Comment: Insert into comments, fetch all
  │   └─→ Delete: Post or comment
  │
  ├─→ Used by: Profile Page
  │   └─→ Update: User profile data
  │
  └─→ Used by: Admin Page
      └─→ Fetch: All posts (no filters)
      └─→ Delete: Any post
```

---

## 🔐 Security Checks

```
Frontend Checks (UX):
├─→ ProtectedRoute: Redirects unauthenticated users
├─→ NavBar: Shows/hides features based on auth
├─→ PostCard: Only show delete if author or admin
└─→ AdminPage: Only show if user.is_admin

Backend Checks (Security - RLS Policies):
├─→ Users can only update own profile
├─→ Users can delete own posts, admins can delete any
├─→ Users can add/delete own comments, admins can delete any
├─→ Users can like/unlike posts
└─→ All tables have row-level security enabled

Database Constraints:
├─→ UNIQUE(user_id, post_id) in likes → prevent duplicate likes
├─→ Foreign keys → data integrity
└─→ RLS policies → enforce permissions
```

---

## 📈 Scaling Considerations

```
For larger projects, you might need:

1. Caching Layer
   └─→ Add Redis to cache popular posts
   └─→ Reduce database queries

2. Pagination
   └─→ Implement infinite scroll or pagination
   └─→ Load posts in batches

3. Real-time Updates
   └─→ Add Supabase Realtime subscriptions
   └─→ Posts update instantly across users

4. Search Functionality
   └─→ Add full-text search
   └─→ PostgreSQL FTS capabilities

5. Notifications
   └─→ Add push notifications
   └─→ Notify when post is liked/commented

6. API Rate Limiting
   └─→ Prevent spam/abuse
   └─→ Protect database from attacks
```

---

**यह architecture देखने से समझ आ जाएगा कि सब कुछ कैसे काम करता है!** 🎓
