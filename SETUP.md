# ⚡ Quick Setup Guide - CampusConnect+

यह guide आपको **5 minutes में** project को running करने में मदद करेगी!
This guide will get you running in 5 minutes!

---

## Step 1: Supabase Setup (2 minutes)

```bash
1. https://supabase.com पर जाएं
2. "Sign Up" या "Login" करें
3. "New Project" create करें
4. Database password set करें
5. Region select करें (India: ap-south-1 best है)
6. "Create new project" click करें (2-3 minutes wait करेगा)

WAITING के दौरान अगला step करो...
```

---

## Step 2: Database Setup (2 minutes)

जब Supabase project ready हो:

```bash
1. Dashboard में जाएं
2. Left side में "SQL Editor" find करें
3. "New Query" click करें
4. DATABASE_SCHEMA.sql की सभी lines copy करें
5. Supabase के editor में paste करें
6. "RUN" button दबाएं ✅

अब सभी tables बन गई!

फिर से "New Query":
1. RLS_POLICIES.sql copy करें
2. Paste करें
3. RUN करें ✅
```

---

## Step 3: Supabase Keys Copy करें (30 seconds)

```bash
1. Dashboard में जाएं
2. Left side में "Settings" → "API" click करें
3. Copy करें:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

ये keys safe रखो! यह app का दिल है।
```

---

## Step 4: Storage Setup (30 seconds)

```bash
1. Supabase Dashboard में जाएं
2. "Storage" section में जाएं
3. "Create a new bucket"
4. Name: "posts-images"
5. "Make it public" ✅
6. Create करें
```

---

## Step 5: Next.js Project Setup (1 minute)

```bash
# Terminal खोलो और यह commands चलाओ:

cd d:\rana\CampusConnect

# npm install करो (अगर पहले से नहीं किया)
npm install

# .env.local file खोलो और भरो:
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Save करो

# Development server start करो
npm run dev

# Browser में खोलो: http://localhost:3000
```

---

## 🎉 Project is Ready!

### Test करो:

```bash
1. Signup करो (कोई भी email/password)
2. Login करो
3. Feed में जाओ
4. नया post create करो
5. Likes दो
6. Comments लिखो
7. Profile edit करो
8. Image upload करो

सब काम करे तो ✅ Project successful है!
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to Supabase"
```
→ .env.local में keys सही हैं?
→ Keys के आगे/पीछे extra spaces नहीं हैं?
→ Copy-paste properly हुआ?
```

### Error: "signup failed" 
```
→ Supabase Dashboard → Auth → Providers check करो
→ Email/Password enabled है?
```

### Image upload नहीं हो रहा
```
→ Storage bucket बनाया?
→ "posts-images" name सही है?
→ Bucket public है?
```

### Admin नहीं दिख रहा
```
→ Supabase → SQL Editor
→ यह query चलाओ:
   UPDATE users SET is_admin = true WHERE email = 'your_email';
```

---

## 📝 First Time Testing Checklist

- [ ] Signup page खुलता है?
- [ ] Signup successful होता है?
- [ ] Login करके feed दिखता है?
- [ ] Post create कर सकते हो?
- [ ] Like करने से count बढ़ता है?
- [ ] Comment add होता है?
- [ ] Profile edit होता है?
- [ ] Image upload होता है?

---

## 🚀 Next Steps

```
Setup complete होने के बाद:

1. Code को समझो (README.md देखो)
2. Components को modify करो (अपने अनुसार customize)
3. Features add करो:
   - Search functionality
   - Follow system
   - Notifications
   - Direct messages
   - etc.

4. Vercel पर deploy करो (FREE)
```

---

## 🎓 For College Viva

यह याद रखो:

1. **Database Design**: Why 4 separate tables?
   - Users → Posts (one-to-many)
   - Posts → Likes (many-to-many)
   - Posts → Comments (one-to-many)

2. **Authentication**: How Supabase Auth works?
   - Signup creates auth record + profile
   - Login returns session token
   - Protected routes check session

3. **Security**: What are RLS Policies?
   - Database level security
   - Users can't access others' data
   - Admins have special permissions

4. **Image Upload**: How does it work?
   - Client uploads to Supabase Storage
   - Get public URL
   - Save URL in database

---

**यह setup के लिए 5-10 minutes का समय चाहिए फिर आप ready हो!**

Questions? README.md देखो जिसमें detailed explanation है।

Good Luck! 🎓
