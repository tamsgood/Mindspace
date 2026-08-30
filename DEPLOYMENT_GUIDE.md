# Deployment Guide - Deploy Updates ke Production

> **Panduan deploy Update #1 (H5P) dan Update #2 (Quiz) ke Vercel + Neon**

---

## 🎯 Overview

Anda akan:
1. Push code ke GitHub
2. Vercel auto-deploy
3. Run migration di Neon database (production)
4. Test di production

---

## 📋 Pre-Deployment Checklist

Sebelum deploy, pastikan:
- [x] Local testing sudah berhasil (H5P & Quiz works)
- [x] Database migration berhasil di local
- [x] No console errors di local
- [x] Git sudah initialized di project
- [ ] GitHub repo sudah ada
- [ ] Vercel project sudah connected ke GitHub
- [ ] Neon database sudah ada

---

## 🚀 Step-by-Step Deployment

### Step 1: Commit Changes ke Git

```bash
# Check status
git status

# Add all changes
git add .

# Commit dengan descriptive message
git commit -m "Add H5P video player and Quiz feature

Features:
- H5P interactive video player
- Quiz system with 4 question types (MC, TF, Essay, Fill blank)
- Auto-grading for MC/TF/Fill blank
- Manual grading for essays
- Timer and due date support
- Complete mentor and student workflows"

# Check commit
git log --oneline -1
```

### Step 2: Push ke GitHub

```bash
# Push ke main branch (atau master, tergantung setup Anda)
git push origin main

# Atau jika pakai master:
# git push origin master
```

**Expected output:**
```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
...
To https://github.com/username/repo.git
   abc1234..def5678  main -> main
```

### Step 3: Vercel Auto-Deploy

Setelah push, Vercel akan otomatis detect changes:

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Pilih project Mindspace

2. **Monitor Deployment**
   - Anda akan lihat "Building..." di dashboard
   - Klik untuk lihat logs
   - Tunggu hingga status: "Ready"

3. **Deployment Time**
   - Biasanya 2-5 menit
   - Vercel akan:
     - Install dependencies (h5p-standalone baru)
     - Build Next.js
     - Deploy ke production

### Step 4: Run Migration di Neon (PENTING!)

⚠️ **CRITICAL**: Production database perlu migration untuk create tables baru.

#### Option A: Via Prisma Studio (Local → Remote)

```bash
# Set DATABASE_URL ke Neon production
# Temporary: Copy production DATABASE_URL dari Vercel

# 1. Get production DATABASE_URL
# Go to Vercel → Project → Settings → Environment Variables
# Copy value of DATABASE_URL

# 2. Set temporary
$env:DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# 3. Run migration
npx prisma migrate deploy

# 4. Verify
npx prisma studio
# Check if Quiz, QuizQuestion, etc tables exist

# 5. Reset env
$env:DATABASE_URL=""
```

#### Option B: Via Neon SQL Editor (Manual)

Jika Option A tidak work, run SQL manually:

1. **Go to Neon Dashboard**
   - https://console.neon.tech
   - Pilih project Anda
   - Klik "SQL Editor"

2. **Run Migration SQL**
   
   Copy SQL ini dan run di Neon SQL Editor:

```sql
-- Create Enums
CREATE TYPE "QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'ESSAY', 'FILL_IN_BLANK');
CREATE TYPE "QuizStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- Create Quiz table
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "timeLimit" INTEGER,
    "dueDate" TIMESTAMP(3),
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "status" "QuizStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- Create QuizQuestion table
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "questionText" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    "correctAnswer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- Create QuizOption table
CREATE TABLE "QuizOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("id")
);

-- Create QuizSubmission table
CREATE TABLE "QuizSubmission" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER,
    "totalPoints" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),

    CONSTRAINT "QuizSubmission_pkey" PRIMARY KEY ("id")
);

-- Create QuizAnswer table
CREATE TABLE "QuizAnswer" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answerText" TEXT,
    "isCorrect" BOOLEAN,
    "pointsEarned" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "Quiz_courseId_idx" ON "Quiz"("courseId");
CREATE INDEX "Quiz_creatorId_idx" ON "Quiz"("creatorId");
CREATE INDEX "QuizQuestion_quizId_idx" ON "QuizQuestion"("quizId");
CREATE INDEX "QuizOption_questionId_idx" ON "QuizOption"("questionId");
CREATE INDEX "QuizSubmission_quizId_idx" ON "QuizSubmission"("quizId");
CREATE INDEX "QuizSubmission_userId_idx" ON "QuizSubmission"("userId");
CREATE INDEX "QuizAnswer_submissionId_idx" ON "QuizAnswer"("submissionId");
CREATE INDEX "QuizAnswer_questionId_idx" ON "QuizAnswer"("questionId");

-- Create unique constraints
CREATE UNIQUE INDEX "QuizSubmission_quizId_userId_key" ON "QuizSubmission"("quizId", "userId");
CREATE UNIQUE INDEX "QuizAnswer_submissionId_questionId_key" ON "QuizAnswer"("submissionId", "questionId");

-- Add foreign keys
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizSubmission" ADD CONSTRAINT "QuizSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "QuizSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update LessonType enum (if H5P not yet added)
ALTER TYPE "LessonType" ADD VALUE IF NOT EXISTS 'H5P_VIDEO';
```

3. **Click "Run"**
4. **Verify**: Check Tables panel - should see Quiz, QuizQuestion, etc.

### Step 5: Verify Deployment

1. **Open Production URL**
   ```
   https://your-app.vercel.app
   ```

2. **Login sebagai Mentor**
3. **Check Sidebar**
   - ✅ Quizzes menu harus muncul
   - ✅ Create quiz harus muncul di Teach section

4. **Test Create Quiz**
   - Buat quiz sederhana
   - Add 1-2 questions
   - Publish

5. **Login sebagai Student**
6. **Test Take Quiz**
   - Lihat quiz di list
   - Take quiz
   - Submit
   - View results

7. **Test H5P (if applicable)**
   - Upload material dengan type "H5P Interactive Video"
   - View di Learn page

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Vercel deployment status: "Ready"
- [ ] Production site loads without errors
- [ ] Quizzes menu visible in sidebar
- [ ] Can create quiz (mentor)
- [ ] Can take quiz (student)
- [ ] Auto-grading works
- [ ] Manual grading works (mentor)
- [ ] H5P video player works (if tested)
- [ ] No console errors in production
- [ ] Database tables created in Neon

---

## 🐛 Troubleshooting

### Problem: Vercel deployment fails

**Check:**
1. Build logs di Vercel dashboard
2. Pastikan `package.json` dependencies complete
3. Check environment variables di Vercel

**Common fixes:**
```bash
# Locally, ensure build works
npm run build

# If build fails locally, fix first before push
```

### Problem: Quiz menu tidak muncul di production

**Cause**: Database migration belum dijalankan

**Fix**: Run Step 4 (migration) lagi

### Problem: "Prisma Client not generated" error

**Fix di Vercel**:
1. Go to Vercel project settings
2. Build & Development Settings
3. Build Command should be: `prisma generate && next build`
4. Redeploy

### Problem: Environment variables not found

**Check Vercel env vars:**
1. Vercel → Project → Settings → Environment Variables
2. Ensure these exist:
   - `DATABASE_URL` (from Neon)
   - `AUTH_SECRET`
   - `AUTH_TRUST_HOST=true` (for production)

### Problem: Database connection error

**Check DATABASE_URL format for Neon:**
```
postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

Must include `?sslmode=require` for Neon!

---

## 🔄 Rollback Plan (If Needed)

Jika ada masalah serius di production:

### Option 1: Revert di Vercel
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

### Option 2: Revert Git
```bash
# Find last working commit
git log --oneline

# Revert to that commit
git revert <commit-hash>

# Push
git push origin main
```

### Option 3: Rollback Database (Dangerous!)
```sql
-- Only if absolutely necessary
-- This will DELETE all quiz data!

DROP TABLE IF EXISTS "QuizAnswer" CASCADE;
DROP TABLE IF EXISTS "QuizSubmission" CASCADE;
DROP TABLE IF EXISTS "QuizOption" CASCADE;
DROP TABLE IF EXISTS "QuizQuestion" CASCADE;
DROP TABLE IF EXISTS "Quiz" CASCADE;
DROP TYPE IF EXISTS "QuizStatus";
DROP TYPE IF EXISTS "QuestionType";

-- For H5P rollback:
ALTER TYPE "LessonType" RENAME TO "LessonType_old";
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'QUIZ', 'ASSIGNMENT', 'PRESENTATION', 'DOCUMENT', 'READING');
ALTER TABLE "Lesson" ALTER COLUMN "type" TYPE "LessonType" USING "type"::text::"LessonType";
DROP TYPE "LessonType_old";
```

⚠️ **Warning**: Rollback will lose all quiz data! Backup first.

---

## 📊 Deployment Metrics

Expected deployment stats:
- **Build time**: 2-5 minutes
- **Bundle size increase**: ~500KB (h5p-standalone)
- **New API routes**: 0 (using Server Actions)
- **Database tables added**: 5 tables
- **Breaking changes**: 0

---

## 🎓 Best Practices

### Before Every Deploy:

1. ✅ Test locally first
2. ✅ Run `npm run build` locally
3. ✅ Check for TypeScript errors
4. ✅ Check for console errors
5. ✅ Test all new features
6. ✅ Commit with descriptive message

### After Deploy:

1. ✅ Verify deployment status
2. ✅ Test critical user flows
3. ✅ Check production logs
4. ✅ Monitor error tracking (if available)
5. ✅ Notify users of new features

---

## 📞 Need Help?

If deployment fails:

1. Check Vercel build logs
2. Check Neon database connection
3. Verify environment variables
4. Test locally with production DATABASE_URL
5. Check this troubleshooting guide

---

## ✨ Success!

Jika semua steps berhasil:
- ✅ H5P video player live
- ✅ Quiz feature live
- ✅ Users can create and take quizzes
- ✅ Production database updated

**Selamat! Updates sudah deployed ke production!** 🚀

---

## 📝 Quick Command Reference

```bash
# Commit changes
git add .
git commit -m "Add H5P and Quiz features"

# Push to GitHub
git push origin main

# Run production migration (with production DATABASE_URL)
npx prisma migrate deploy

# Check production database
npx prisma studio
```

---

**Next**: Monitor production, collect user feedback, iterate! 🎉
