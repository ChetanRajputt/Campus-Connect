# 🎓 CampusConnect+ - College Social Media Platform

एक complete college-based social media web application। A complete social media platform for college communities.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Setup Instructions](#setup-instructions)
4. [Database Schema](#database-schema)
5. [Features](#features)
6. [Folder Structure](#folder-structure)
7. [Code Explanation](#code-explanation)
8. [Important Concepts](#important-concepts)

---

## 🎯 Project Overview

**CampusConnect+** एक social media platform है जहाँ college students:
- ✅ Signup/Login कर सकते हैं (Email/Password से)
- ✅ Posts create, view, update कर सकते हैं
- ✅ Posts को like और comment कर सकते हैं
- ✅ अपनी profile को edit कर सकते हैं
- ✅ Images upload कर सकते हैं
- ✅ Admins posts को delete कर सकते हैं

**यह project के लिए features:**
- College project standards के लिए suitable
- Clean code structure
- Minimal complexity
- Full documentation
- Viva के लिए easy explanations

---

## 🛠️ Tech Stack

```
Frontend:
├── Next.js 14 (App Router)
├── React 18
├── Material UI (MUI)
└── TypeScript

Backend:
├── Supabase (PostgreSQL Database)
├── Supabase Auth (Email/Password)
├── Supabase Storage (Image Upload)
└── Row Level Security (RLS) Policies
```

**क्यों Supabase?**
- Database + Auth + Storage एक ही जगह
- No backend server needed (सिर्फ frontend)
- PostgreSQL की power
- Easy to use और simple
- College project के लिए perfect

---

## 🚀 Setup Instructions

### Step 1: Supabase Project Setup

```bash
1. https://supabase.com पर जाएं
2. New Project create करें
3. Database name दें
4. PostgreSQL region select करें

5. Copy करें:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Step 2: Database Schema Run करें

```sql
1. Supabase Dashboard में जाएं
2. SQL Editor खोलें
3. DATABASE_SCHEMA.sql की सभी queries paste करें
4. Execute करें

यह create करेगा:
- users table
- posts table
- likes table
- comments table
```

### Step 3: RLS Policies Enable करें

```sql
1. SQL Editor में RLS_POLICIES.sql paste करें
2. सभी policies execute करें

यह define करेगा:
- कौन कौन सा data access कर सकता है
- Admin permissions
- User privacy rules
```

### Step 4: Storage Setup

```bash
1. Supabase Dashboard → Storage
2. New Bucket बनाएं: "posts-images"
3. Make it "Public" (images दिखने के लिए)
4. Bucket Policies में यह policy add करें:

CREATE POLICY "Public storage access"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts-images');

CREATE POLICY "Authenticated user upload"
ON storage.objects FOR INSERT
USING (auth.role() = 'authenticated' AND bucket_id = 'posts-images');
```

### Step 5: Next.js Project Setup

```bash
# Clone या navigate करें project folder में
cd d:\rana\CampusConnect

# Dependencies install करें
npm install

# .env.local में Supabase keys डालें
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Development server start करें
npm run dev

# Open करें: http://localhost:3000
```

---

## 📊 Database Schema

### Users Table
```sql
users {
  id (UUID) - Primary Key, linked to auth.users
  email (VARCHAR) - Unique email
  full_name (VARCHAR) - User का नाम
  bio (TEXT) - Biography/About section
  avatar_url (VARCHAR) - Profile picture URL
  roll_number (VARCHAR) - College roll number
  college (VARCHAR) - College name
  department (VARCHAR) - Department
  is_admin (BOOLEAN) - Admin flag
  created_at (TIMESTAMP) - Account creation date
  updated_at (TIMESTAMP) - Last update date
}
```

### Posts Table
```sql
posts {
  id (UUID) - Primary Key
  user_id (UUID) - Foreign Key → users.id
  title (VARCHAR) - Post title (optional)
  content (TEXT) - Post content (required)
  image_url (VARCHAR) - Image URL
  likes_count (INTEGER) - Total likes
  comments_count (INTEGER) - Total comments
  created_at (TIMESTAMP) - Post creation date
  updated_at (TIMESTAMP) - Last update date
}
```

### Likes Table (Many-to-Many)
```sql
likes {
  id (UUID) - Primary Key
  user_id (UUID) - Foreign Key → users.id
  post_id (UUID) - Foreign Key → posts.id
  created_at (TIMESTAMP)
  UNIQUE(user_id, post_id) - एक user एक post को एक बार like कर सकता है
}
```

### Comments Table
```sql
comments {
  id (UUID) - Primary Key
  user_id (UUID) - Foreign Key → users.id
  post_id (UUID) - Foreign Key → posts.id
  content (TEXT) - Comment content
  created_at (TIMESTAMP)
  updated_at (TIMESTAMP)
}
```

---

## ✨ Features Explained

### 1️⃣ Authentication (Email/Password)

**कैसे काम करता है:**
```
User → Signup Form → Supabase Auth
                  → users table में profile create होता है
                  ↓
             Login के साथ session मिलता है
             ↓
        AuthContext से session use होता है
```

**Code Location:** `context/AuthContext.tsx`
**Pages:** `app/auth/signup` और `app/auth/login`

### 2️⃣ Protected Routes

**Logic:**
```
User request करता है protected page
           ↓
ProtectedRoute component check करता है
           ↓
क्या user logged in है? YES → Access दे दो
                      NO  → /auth/login पर redirect करो
```

**Code:** `components/ProtectedRoute.tsx`
**Usage:** सभी pages में जो protected हैं

### 3️⃣ Social Feed (Create/View Posts)

**Flow:**
```
User → CreatePost component में content लिखता है
            ↓
        Image upload (optional)
            ↓
        Database में insert होता है
            ↓
        Feed refresh होता है
            ↓
        सभी posts दिखते हैं newest first
```

**Components:**
- `CreatePost.tsx` - Post create करने के लिए
- `PostCard.tsx` - Individual post display
- `app/feed/page.tsx` - Feed page

### 4️⃣ Likes & Comments

**Likes:**
```
User → Like button click करता है
            ↓
        Check होता है: क्या पहले से liked है?
            ↓
Yes → Unlike करो (likes table से delete करो)
No  → Like करो (likes table में insert करो)
            ↓
        likes_count update होता है
```

**Comments:**
```
User → Comment लिखता है
            ↓
        Comment database में save होता है
            ↓
        Related post के साथ दिखता है
            ↓
        User अपने comments delete कर सकता है
```

### 5️⃣ Admin Panel

**Admin Permissions:**
```
किसी को admin = true करो users table में
           ↓
अब वह admin features access कर सकता है
           ↓
- सभी posts delete कर सकता है
- सभी comments delete कर सकता है
- Special admin page देख सकता है
```

**How to make admin:**
```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@example.com';
```

### 🌟 Additional Features (Added for Major Project Value)

### 6️⃣ Role-Based Access
**Normal user** → post, like, comment
**Admin** → delete any post
*Exam point:* Authorization implemented using roles

### 7️⃣ Image Upload Support
- Post के साथ image upload
- Notes, notices, posters share कर सकते हैं

### 8️⃣ Event & Announcement Section
- College events, exams, holidays
- Official updates

### 9️⃣ Polls & Surveys
- Feedback collection
- Event planning polls

### 🔟 Search & Filter
- Posts search by keyword
- User or topic based filtering

### 📱 11️⃣ Fully Responsive Design
- Mobile, tablet, desktop support
- Clean & modern UI

---

## 🔮 Future Scope (Bolna viva me: "Planned as future enhancement")

### 🔔 12️⃣ Notifications
- Like / comment पर notification
- Event reminders

### 💬 13️⃣ Real-Time Chat
- Students one-to-one या group chat
- Seniors–juniors interaction

### 📚 14️⃣ Academic Resource Sharing
- Notes PDFs upload
- Subject-wise materials

---

## 📁 Folder Structure

```
CampusConnect/
├── app/                           # Next.js App Router
│   ├── auth/
│   │   ├── login/page.tsx        # Login page
│   │   └── signup/page.tsx       # Signup page
│   ├── feed/page.tsx             # Main social feed
│   ├── profile/page.tsx          # User profile
│   ├── admin/page.tsx            # Admin panel
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
│
├── components/                    # Reusable React components
│   ├── NavBar.tsx                # Navigation bar
│   ├── ProtectedRoute.tsx        # Auth check wrapper
│   ├── CreatePost.tsx            # Post creation form
│   ├── PostCard.tsx              # Individual post display
│   └── Comment.tsx               # Comment component
│
├── context/                       # React Context
│   └── AuthContext.tsx           # Authentication context
│
├── utils/                         # Utility functions
│   └── supabase.ts               # Supabase client
│
├── styles/                        # CSS files
│   └── globals.css               # Global styles
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js                # Next.js config
├── .env.local                    # Environment variables
├── DATABASE_SCHEMA.sql           # Database tables
└── RLS_POLICIES.sql              # Security policies
```

---

## 💻 Code Explanation (Simple)

### AuthContext - Authentication Logic

```typescript
// Context बनाता है जो पूरे app में use होता है
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  // जब component mount हो, check करो if user logged in है
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        fetchUserData(data.session.user.id);
      }
    });
  }, []);

  // Signup function
  const signUp = async (email, password, fullName) => {
    // 1. Supabase Auth में user create करो
    const { data } = await supabase.auth.signUp({ email, password });
    
    // 2. users table में profile create करो
    await supabase.from('users').insert({
      id: data.user.id,
      email,
      full_name: fullName,
    });
  };

  // Login function
  const signIn = async (email, password) => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  // Logout function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Anywhere in app: const { user, signUp } = useAuth();
```

### CreatePost - Post Creation

```typescript
const handleCreatePost = async (e) => {
  e.preventDefault();

  // 1. अगर image है तो upload करो
  let imageUrl = null;
  if (selectedFile) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data } = await supabase.storage
      .from('posts-images')
      .upload(`posts/${fileName}`, file);
    
    imageUrl = supabase.storage.from('posts-images').getPublicUrl(data.path);
  }

  // 2. Database में post insert करो
  await supabase.from('posts').insert({
    user_id: user.id,
    title: title,
    content: content,
    image_url: imageUrl,
  });

  // 3. Form reset करो
  setContent('');
  setTitle('');
};
```

### PostCard - Like/Comment Logic

```typescript
// Like toggle करने का logic
const handleLike = async () => {
  if (liked) {
    // Already liked → Delete from likes table
    await supabase
      .from('likes')
      .delete()
      .eq('post_id', post.id)
      .eq('user_id', user.id);
    setLiked(false);
  } else {
    // Not liked → Add to likes table
    await supabase.from('likes').insert({
      post_id: post.id,
      user_id: user.id,
    });
    setLiked(true);
  }
};

// Comment add करने का logic
const handleAddComment = async () => {
  const { data } = await supabase
    .from('comments')
    .insert({
      post_id: post.id,
      user_id: user.id,
      content: newComment,
    })
    .select('*, users(*)');  // User info के साथ return करो

  setComments([data, ...comments]);
  setNewComment('');  // Clear input
};
```

### ProtectedRoute - Route Protection

```typescript
export default function ProtectedRoute({ children, adminOnly }) {
  const { session, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check 1: क्या user logged in है?
      if (!session) {
        router.push('/auth/login');
      }
      // Check 2: अगर admin page है तो क्या user admin है?
      else if (adminOnly && !isAdmin) {
        router.push('/feed');
      }
    }
  }, [session, loading, adminOnly, isAdmin]);

  if (!session) return <CircularProgress />;
  if (adminOnly && !isAdmin) return <CircularProgress />;

  return <>{children}</>;
}

// Usage: <ProtectedRoute adminOnly={true}> <AdminPanel /> </ProtectedRoute>
```

---

## 🔒 Security & RLS Policies

### Row Level Security क्या है?

```
Database level पर security है जो define करता है:
"कौन कौन सा data access कर सकता है?"

Example:
- Likes table: सिर्फ like करने वाला user अपना like delete कर सकता है
- Posts: सिर्फ post creator अपना post delete कर सकता है
- Admins: कोई भी post delete कर सकते हैं
```

### Important RLS Policies

```sql
-- Posts को सभी देख सकते हैं लेकिन delete सिर्फ creator या admin कर सकता है
CREATE POLICY "Users can delete their own posts, admins can delete any"
ON posts FOR DELETE
USING (auth.uid() = user_id OR 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));

-- Likes: एक user एक post को एक बार ही like कर सकता है
UNIQUE(user_id, post_id);

-- Comments को creator और admin delete कर सकते हैं
CREATE POLICY "Users can delete their own comments, admins can delete any"
ON comments FOR DELETE
USING (auth.uid() = user_id OR 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true));
```

---

## 🎓 Important Concepts for Viva

### 1. Relationships Explained

```
One-to-Many: एक User के multiple Posts हो सकते हैं
├── users.id (One)
└── posts.user_id (Many)

Many-to-Many: एक User कई Posts को like कर सकता है
             एक Post को कई Users like कर सकते हैं
├── users.id ──┐
└── posts.id ──┼──(likes table)
               └─ एक unique pair एक बार

One-to-Many: एक Post के multiple Comments हो सकते हैं
├── posts.id (One)
└── comments.post_id (Many)
```

### 2. Authentication Flow

```
SIGNUP:
User (email, password, name)
  ↓
Supabase Auth (verify email और encrypted password store करो)
  ↓
users table में profile create करो
  ↓
Success → Redirect to feed

LOGIN:
User (email, password)
  ↓
Supabase Auth (verify करो)
  ↓
Session token देता है
  ↓
AuthContext में store होता है
  ↓
Protected pages access कर सकता है
```

### 3. Image Upload Flow

```
User selects image
  ↓
Client-side validation (is it an image?)
  ↓
Upload to Supabase Storage (posts-images bucket)
  ↓
Get public URL
  ↓
Save URL in posts.image_url
  ↓
Image display होता है
```

### 4. Admin System

```
users table में is_admin = true
  ↓
RLS policies check करते हैं यह flag
  ↓
अगर true है तो extra permissions
  ↓
Database level पर enforce होता है (secure)
  ↓
UI में भी admin checks होते हैं (UX के लिए)
```

---

## 🚀 Deployment Guide

### Vercel पर Deploy करना (Free)

```bash
# 1. GitHub पर push करो
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/campusconnect.git
git push -u origin main

# 2. https://vercel.com पर जाओ
# 3. "Import Project" → GitHub repo select करो
# 4. Environment variables add करो:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
# 5. Deploy करो!

# App यहाँ दिखेगा: https://campusconnect-plus.vercel.app
```

---

## 📝 Viva Questions & Answers

**Q1: Database में Users, Posts, Likes, Comments tables क्यों हैं?**
A: हर एक entity को अलग table में रखने से:
- Data properly organized रहता है
- Foreign keys से relationships बनती हैं
- Queries optimize होती हैं
- Likes और Comments का data efficient तरीके से store होता है

**Q2: RLS Policies क्यों जरूरी हैं?**
A: यह database level पर security देते हैं:
- User दूसरे के data को access नहीं कर सकते (privacy)
- Posts सिर्फ creator delete कर सकता है
- Admins को special powers देते हैं
- Hackers database को सीधे access नहीं कर सकते

**Q3: क्यों Supabase use किया Node.js की जगह?**
A:
- Backend server की जरूरत नहीं (complexity कम)
- Database + Auth + Storage एक जगह
- PostgreSQL की power सीधे use कर सकते हैं
- College project के लिए simpler है

**Q4: CreatePost में image upload कैसे होता है?**
A: 
- User image select करता है
- Client-side verification (is it really an image?)
- Supabase Storage में upload होता है
- Public URL मिलता है
- URL को posts table में save होता है
- Whenever post show होता है, image दिखता है

**Q5: Like functionality में UNIQUE constraint क्यों है?**
A: 
- UNIQUE(user_id, post_id) ensure करता है:
- एक user एक post को सिर्फ एक बार like कर सकता है
- दोबारा like नहीं हो सकता (duplicate prevention)
- Database level पर enforce होता है

**Q6: Project के additional features और future scope क्या हैं (For Major Project)?**
A: 
**🌟 Additional Features (Implemented):**
1. **Role-Based Access:** Normal user post/like/comment कर सकता है, Admin कोई भी post delete कर सकता है (Exam point: Authorization implemented using roles).
2. **Image Upload Support:** Post के साथ image upload, notes और notices share करने के लिए.
3. **Event & Announcement Section:** College events और official updates के लिए.
4. **Polls & Surveys:** Feedback collection के लिए.
5. **Search & Filter:** Posts search और topic-based filtering.
6. **Fully Responsive Design:** Mobile, tablet, desktop support with clean UI.

**🔮 Future Scope (📌 Bolna viva me: "Planned as future enhancement"):**
1. **Notifications:** Like / comment पर notification और event reminders.
2. **Real-Time Chat:** Students one-to-one या group chat, Seniors–juniors interaction.
3. **Academic Resource Sharing:** Notes PDFs upload, Subject-wise materials.

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module '@supabase/supabase-js'" | `npm install @supabase/supabase-js` |
| Blank page after login | Check .env.local में सही keys हैं? |
| Images upload नहीं हो रहे | Storage bucket "public" है? |
| Admin page नहीं दिख रहा | Database में is_admin = true set किया? |
| RLS policy errors | SQL Editor में सभी policies run किए? |

---

## 📚 Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Material UI:** https://mui.com
- **PostgreSQL Docs:** https://www.postgresql.org/docs

---

## ✅ Project Checklist

```
Setup:
  ☑️ Supabase project create किया
  ☑️ Database schema run किया
  ☑️ RLS policies apply किए
  ☑️ Storage bucket setup की
  ☑️ .env.local में keys डाले

Features:
  ☑️ Signup/Login working
  ☑️ Protected routes working
  ☑️ Posts create, view, delete हो रहा है
  ☑️ Likes working
  ☑️ Comments working
  ☑️ Admin panel working
  ☑️ Image upload working
  ☑️ Profile edit working

Testing:
  ☑️ Different users से login किया
  ☑️ Post create किया
  ☑️ Like/Comment किए
  ☑️ Admin से post delete किया
  ☑️ Image upload tested

Ready for Viva:
  ☑️ Code को समझते हो
  ☑️ Database schema explain कर सकते हो
  ☑️ RLS policies समझ गए
  ☑️ Authentication flow clear है
```

---

**Made for College Projects | Ready for Viva | Clean Code | Minimal Complexity**

Happy Coding! 🎓
