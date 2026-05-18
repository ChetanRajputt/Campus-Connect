# 📂 Complete File Structure & Description

यह document बताता है कि **हर एक file क्या करती है** और **कहाँ खोजो।**
This explains every file in the project.

---

## 📊 Project File Tree

```
d:\rana\CampusConnect/
│
├─ 📄 Configuration Files
│  ├─ package.json          ← All npm packages & scripts
│  ├─ tsconfig.json         ← TypeScript settings
│  ├─ next.config.js        ← Next.js settings
│  ├─ .env.local            ← Supabase keys (TEMPLATE)
│  └─ .gitignore            ← Git ignore rules
│
├─ 📚 Documentation Files
│  ├─ README.md             ← Main guide with Hinglish explanation
│  ├─ SETUP.md              ← Quick 5-minute setup guide
│  ├─ API_USAGE.md          ← How to use Supabase client
│  ├─ PROJECT_ARCHITECTURE.md  ← Component & data flow
│  ├─ VIVA_QA.md            ← Q&A for college viva
│  ├─ QUICK_REFERENCE.md    ← Commands & code snippets
│  └─ PROJECT_SUMMARY.md    ← This complete overview
│
├─ 🗄️ Database Files
│  ├─ DATABASE_SCHEMA.sql   ← SQL to create tables
│  └─ RLS_POLICIES.sql      ← SQL for security policies
│
├─ 📁 app/ (Next.js App Router)
│  ├─ layout.tsx            ← Root layout (wraps all pages)
│  ├─ page.tsx              ← Home page (/)
│  ├─ auth/
│  │  ├─ login/
│  │  │  └─ page.tsx        ← Login page (/auth/login)
│  │  └─ signup/
│  │     └─ page.tsx        ← Signup page (/auth/signup)
│  ├─ feed/
│  │  └─ page.tsx           ← Social feed (/feed) - Protected
│  ├─ profile/
│  │  └─ page.tsx           ← User profile (/profile) - Protected
│  └─ admin/
│     └─ page.tsx           ← Admin panel (/admin) - Admin Only
│
├─ 🎨 components/ (Reusable React Components)
│  ├─ NavBar.tsx            ← Navigation bar (सभी pages में)
│  ├─ ProtectedRoute.tsx    ← Route protection wrapper
│  ├─ CreatePost.tsx        ← Post creation form
│  ├─ PostCard.tsx          ← Individual post display
│  └─ Comment.tsx           ← Individual comment
│
├─ 🔐 context/ (React Context)
│  └─ AuthContext.tsx       ← Global authentication state
│
├─ 🛠️ utils/ (Utility Functions)
│  └─ supabase.ts           ← Supabase client initialization
│
└─ 🎨 styles/ (CSS)
   └─ globals.css           ← Global CSS styles
```

---

## 📄 File Details

### Configuration Files

#### **package.json**
```
Content: npm dependencies और scripts
Example dependencies:
- next (framework)
- react (UI library)
- @mui/material (components)
- @supabase/supabase-js (database client)

Scripts:
- npm run dev → development server
- npm run build → production build
- npm start → production server
- npm run lint → code quality check
```

#### **tsconfig.json**
```
Content: TypeScript configuration
Purpose: Type safety और IDE support
Key settings: 
- lib: DOM + ES features
- module: ES modules
- strict mode enabled
```

#### **next.config.js**
```
Content: Next.js configuration
Purpose: Framework settings
Key settings:
- reactStrictMode: true
- Image domains for Supabase URLs
```

#### **.env.local**
```
Content: Environment variables TEMPLATE
Purpose: Store sensitive data
Variables:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

⚠️ This file is in .gitignore (not committed)
```

#### **.gitignore**
```
Content: Git ignore rules
Files to ignore:
- node_modules/
- .next/
- .env.local
- *.log
```

---

### Documentation Files

#### **README.md** (800+ lines)
```
Content: Complete project guide
Sections:
1. Project overview
2. Tech stack explanation
3. Setup instructions
4. Database schema explanation
5. Features breakdown
6. Folder structure
7. Code explanations
8. Important concepts
9. Viva preparation
10. Troubleshooting

Language: Mix of English + Hinglish
Purpose: Main learning resource
```

#### **SETUP.md** (200 lines)
```
Content: Quick setup guide
Sections:
1. Supabase setup (2 min)
2. Database setup (2 min)
3. Keys copy (30 sec)
4. Storage setup (30 sec)
5. Next.js setup (1 min)
6. Testing checklist
7. Troubleshooting

Time: 5-10 minutes total
Best for: Getting started quickly
```

#### **API_USAGE.md** (400+ lines)
```
Content: How to use Supabase client
Sections:
1. Client initialization
2. CRUD operations (INSERT, SELECT, UPDATE, DELETE)
3. Authentication
4. File upload
5. Real-world examples
6. Relationships
7. Filters & queries
8. Error handling
9. Performance tips

Purpose: Code reference guide
```

#### **PROJECT_ARCHITECTURE.md** (500+ lines)
```
Content: Component and data flow
Sections:
1. High-level architecture diagram
2. Component relationships
3. Authentication flow
4. Post & comment flow
5. Full user journey
6. Component communication
7. Security checks
8. Scaling considerations

Purpose: Understand how it all works
```

#### **VIVA_QA.md** (600+ lines)
```
Content: Q&A for viva preparation
Sections:
1. General questions (5 Q&A)
2. Database questions (4 Q&A)
3. Authentication questions (4 Q&A)
4. Frontend questions (3 Q&A)
5. Backend questions (2 Q&A)
6. Deployment questions (2 Q&A)
7. Practical coding questions (2 Q&A)
8. Viva tips

Purpose: Be ready for viva
```

#### **QUICK_REFERENCE.md** (400+ lines)
```
Content: Cheat sheet with commands
Sections:
1. Installation commands
2. SQL queries (insert, select, update, delete)
3. React/TypeScript snippets
4. Supabase client examples
5. Material UI components
6. Image upload code
7. Debugging tips
8. Performance tips
9. Common errors & fixes

Purpose: Quick lookup when coding
```

#### **PROJECT_SUMMARY.md** (300+ lines)
```
Content: Complete project overview
Sections:
1. What's been created
2. Features implemented
3. Database schema
4. Security policies
5. How to get started
6. What you'll learn
7. For viva preparation
8. File guide
9. Next steps
10. Deployment

Purpose: High-level project overview
```

---

### Database Files

#### **DATABASE_SCHEMA.sql**
```
Content: SQL to create database tables
Tables created:
1. users (auth.users reference)
2. posts (one-to-many with users)
3. likes (many-to-many)
4. comments (one-to-many)

Indexes created:
- idx_posts_user_id
- idx_posts_created_at
- idx_likes_post_id
- idx_comments_post_id

Purpose: Paste into Supabase SQL Editor
Commands: CREATE TABLE, CREATE INDEX, ALTER TABLE ENABLE RLS
```

#### **RLS_POLICIES.sql**
```
Content: Row Level Security policies
Policies for:
1. users - UPDATE own profile
2. posts - CREATE/UPDATE/DELETE own
3. likes - CREATE/DELETE own
4. comments - CREATE/UPDATE/DELETE own

Special:
- Admins can delete any post/comment
- Everyone can view (SELECT)

Purpose: Paste into Supabase SQL Editor
Enforces: Database-level security
```

---

### App Router Pages

#### **app/page.tsx** (Home)
```
Purpose: Welcome page
Access: Public (no auth needed)
Content:
- App title & description
- Signup/Login buttons
- Auto-redirect if logged in

What it does:
- Check if user is authenticated
- If yes → redirect to /feed
- If no → show home page with links
```

#### **app/layout.tsx** (Root Layout)
```
Purpose: Wraps all pages
Content:
- HTML structure
- AuthProvider wrapper
- NavBar component
- ThemeProvider (Material UI)
- Global CSS

Hierarchy:
layout.tsx
  └─ AuthProvider
      ├─ NavBar
      └─ Page content
```

#### **app/auth/signup/page.tsx**
```
Purpose: New account registration
Access: Public (no auth needed)
Features:
- Email input
- Password input
- Full name input
- Form validation
- Error handling
- Redirect to feed on success

Database operations:
1. supabase.auth.signUp()
2. Insert profile in users table

Flow: signup form → auth → profile → redirect to feed
```

#### **app/auth/login/page.tsx**
```
Purpose: User login
Access: Public (no auth needed)
Features:
- Email input
- Password input
- Form validation
- Error handling
- Redirect to feed on success

Database operations:
1. supabase.auth.signInWithPassword()
2. Fetch user profile

Flow: login form → auth verification → load profile → redirect
```

#### **app/feed/page.tsx**
```
Purpose: Social media feed
Access: Protected (auth required)
Features:
- Show all posts (latest first)
- Create new post
- Like/unlike posts
- Add comments
- Delete own posts

Components used:
1. ProtectedRoute wrapper
2. CreatePost component
3. PostCard components

Database operations:
- SELECT posts with users (JOIN)
- INSERT post
- INSERT like
- DELETE like
- INSERT comment
- DELETE comment/post
```

#### **app/profile/page.tsx**
```
Purpose: User profile viewing & editing
Access: Protected (auth required)
Features:
- Display current user info
- Edit profile (name, bio, etc.)
- Update database
- Success/error messages

Fields editable:
- full_name
- bio
- roll_number
- college
- department

Database operations:
- SELECT user profile
- UPDATE user profile
```

#### **app/admin/page.tsx**
```
Purpose: Admin control panel
Access: Protected + Admin only
Features:
- View all posts
- Delete any post
- Admin-only messages

Permission check:
1. Must be authenticated
2. Must have is_admin = true

Database operations:
- SELECT all posts
- DELETE any post
```

---

### Components

#### **components/NavBar.tsx**
```
Purpose: Navigation header
Location: Fixed at top
Shows:
- App title/logo
- Navigation links
- User menu (if logged in)
- Logout button (if logged in)
- Login/Signup links (if not logged in)

Conditional rendering:
- If loading → show spinner
- If logged in → show user menu + admin link (if admin)
- If not logged in → show login/signup buttons
```

#### **components/ProtectedRoute.tsx**
```
Purpose: Route protection wrapper
Usage: Wrap pages that need auth

Checks:
1. Is user authenticated? (session exists?)
2. If admin-only page, is user admin?

Actions:
- If not auth → redirect to /auth/login
- If not admin but admin page → redirect to /feed
- If all checks pass → render component
```

#### **components/CreatePost.tsx**
```
Purpose: Create new posts form
Features:
- Text input for post content
- Optional title
- Image upload
- Image preview
- Form submission

Database operations:
1. Upload image to storage (if selected)
2. Get public URL
3. Insert post in database
4. Reset form
5. Call onPostCreated callback (refresh feed)

Error handling: Try-catch with user messages
```

#### **components/PostCard.tsx**
```
Purpose: Display single post
Shows:
- Author info (name, avatar)
- Post timestamp
- Post title (if exists)
- Post content
- Post image (if exists)
- Like button + count
- Comment button + count

Features:
- Like/unlike toggle
- Load comments on click
- Add new comment
- Delete comment (own or admin)
- Delete post (own or admin)

Interactive:
- Click like button → toggle like
- Click comment icon → show comments
- Type comment → add to database
```

#### **components/Comment.tsx**
```
Purpose: Display single comment
Shows:
- Author avatar
- Author name
- Comment text
- Comment timestamp
- Delete button (if own or admin)

Features:
- Display comment info
- Delete comment on button click

Props:
- comment: Comment object with user data
- onDelete: callback function
```

---

### Context

#### **context/AuthContext.tsx**
```
Purpose: Global authentication state
Provides:
- user: Current user object
- session: Auth session
- loading: Loading state
- isAdmin: Admin flag
- signUp: Signup function
- signIn: Login function
- signOut: Logout function

Operations:
1. Check session on app load
2. Fetch user profile on login
3. Listen for auth changes
4. Manage state globally

Usage:
const { user, session, signOut } = useAuth();
```

---

### Utils

#### **utils/supabase.ts**
```
Purpose: Supabase client initialization & types
Exports:
- supabase: Initialized client
- User: TypeScript interface
- Post: TypeScript interface
- Like: TypeScript interface
- Comment: TypeScript interface

Supabase initialization:
```typescript
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

Usage:
```typescript
import { supabase, Post } from '@/utils/supabase';
const { data } = await supabase.from('posts').select();
```
```

---

### Styles

#### **styles/globals.css**
```
Content: Global CSS styles
Styles:
- Reset default margins/padding
- Body background color
- Font settings
- Link styling
- Button transitions

Purpose: Apply to all pages
Approach: Minimal, Material UI handles most styling
```

---

## 🔄 File Dependencies

```
app/layout.tsx
  ├─ imports: AuthProvider (context/AuthContext)
  ├─ imports: NavBar (components/NavBar)
  ├─ imports: ThemeProvider (MUI)
  └─ imports: globals.css (styles/globals)

app/feed/page.tsx
  ├─ imports: ProtectedRoute (components/ProtectedRoute)
  ├─ imports: CreatePost (components/CreatePost)
  ├─ imports: PostCard (components/PostCard)
  ├─ imports: useAuth (context/AuthContext)
  └─ imports: supabase (utils/supabase)

components/PostCard.tsx
  ├─ imports: Comment (components/Comment)
  ├─ imports: useAuth (context/AuthContext)
  └─ imports: supabase (utils/supabase)

context/AuthContext.tsx
  └─ imports: supabase (utils/supabase)
```

---

## 📊 Size Statistics

| Category | Count | Size |
|----------|-------|------|
| Pages | 6 | ~400 lines |
| Components | 5 | ~600 lines |
| Context | 1 | ~150 lines |
| Utils | 1 | ~50 lines |
| Config | 4 | ~100 lines |
| Styles | 1 | ~20 lines |
| Docs | 7 | ~3000 lines |
| SQL | 2 | ~150 lines |
| **Total** | **27 files** | **~4500 lines** |

---

## ✅ File Checklist

```
Core Files:
  ☑️ package.json
  ☑️ tsconfig.json
  ☑️ next.config.js
  ☑️ .env.local (template)
  ☑️ .gitignore

Pages:
  ☑️ app/layout.tsx
  ☑️ app/page.tsx
  ☑️ app/auth/signup/page.tsx
  ☑️ app/auth/login/page.tsx
  ☑️ app/feed/page.tsx
  ☑️ app/profile/page.tsx
  ☑️ app/admin/page.tsx

Components:
  ☑️ components/NavBar.tsx
  ☑️ components/ProtectedRoute.tsx
  ☑️ components/CreatePost.tsx
  ☑️ components/PostCard.tsx
  ☑️ components/Comment.tsx

Context & Utils:
  ☑️ context/AuthContext.tsx
  ☑️ utils/supabase.ts
  ☑️ styles/globals.css

Database:
  ☑️ DATABASE_SCHEMA.sql
  ☑️ RLS_POLICIES.sql

Documentation:
  ☑️ README.md
  ☑️ SETUP.md
  ☑️ API_USAGE.md
  ☑️ PROJECT_ARCHITECTURE.md
  ☑️ VIVA_QA.md
  ☑️ QUICK_REFERENCE.md
  ☑️ PROJECT_SUMMARY.md
  ☑️ FILE_STRUCTURE.md (this file)
```

---

**सभी files बन गई हैं! अब setup करो और code देखो।** 🎉
