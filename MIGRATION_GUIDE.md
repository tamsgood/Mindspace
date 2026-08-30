# Database Migration Guide - H5P Feature

> **Step-by-step guide untuk menjalankan database migration**

---

## ⚠️ Important Notes

- **Backup database** sebelum migration (optional tapi recommended)
- Migration ini **AMAN** - hanya menambah enum value, tidak mengubah data existing
- Total waktu: ~2-5 menit
- Downtime: Tidak ada (untuk dev environment)

---

## 🔧 Prerequisites

Pastikan sudah:
- ✅ PostgreSQL installed dan running
- ✅ Database `mindspace` sudah dibuat
- ✅ File `.env` sudah ada dan benar
- ✅ `npm install` sudah selesai

---

## 📝 Step-by-Step Migration

### Step 1: Verify Current State

Check apakah database sudah ada:

```bash
# Test koneksi database
npx prisma studio
```

Jika berhasil, browser akan buka dengan Prisma Studio.  
**Tutup Prisma Studio** setelah verify.

### Step 2: Generate Prisma Client

```bash
npm run db:generate
```

**Expected Output:**
```
✔ Generated Prisma Client (5.x.x) to .\node_modules\@prisma\client
```

**Jika Error:**
- Check file `.env` exists
- Check `DATABASE_URL` format benar
- Check PostgreSQL running

### Step 3: Create Migration

```bash
npm run db:migrate
```

**You will be prompted:**
```
? Enter a name for the new migration:
```

**Type:** `add_h5p_video_type`

**Expected Output:**
```
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "mindspace"

√ Generated Prisma Client
√ Name of migration: add_h5p_video_type
√ Applied migration 20240xxx_add_h5p_video_type to the database

✔ Migration applied successfully
```

### Step 4: Verify Migration

```bash
npx prisma studio
```

1. Open Prisma Studio (akan buka browser)
2. Klik **Lesson** model di sidebar
3. Klik kolom **type**
4. Lihat enum values - harus ada: `H5P_VIDEO` ✅

### Step 5: Done!

Migration berhasil! Lanjut ke testing.

---

## 🔍 Verification Queries

### Check Enum in Database (Optional)

Open psql atau pgAdmin dan run:

```sql
-- Check enum type
SELECT unnest(enum_range(NULL::public."LessonType"))::text AS lesson_types;
```

**Expected Result:**
```
 lesson_types
--------------
 VIDEO
 H5P_VIDEO      ← Should be here
 QUIZ
 ASSIGNMENT
 PRESENTATION
 DOCUMENT
 READING
```

### Check Existing Lessons (Optional)

```sql
-- Check current lessons (should not be affected)
SELECT id, title, type FROM public."Lesson" LIMIT 10;
```

All existing lessons should still have their original type (VIDEO, DOCUMENT, etc.)

---

## 🐛 Troubleshooting

### Error: "Can't reach database server at localhost:5432"

**Cause:** PostgreSQL tidak running

**Fix:**
```bash
# Windows: Check Services
services.msc
# Find "postgresql" service
# Click "Start"

# Or check dengan psql
psql -U postgres -l
```

### Error: "Database 'mindspace' does not exist"

**Cause:** Database belum dibuat

**Fix:**
```bash
# Option 1: pgAdmin
# Buka pgAdmin → Databases → Create → Database
# Name: mindspace

# Option 2: psql
psql -U postgres
CREATE DATABASE mindspace;
\q
```

### Error: "Unique constraint failed"

**Cause:** Enum value sudah ada (migration sudah pernah dijalankan)

**Fix:**
```bash
# Check migration history
npx prisma migrate status

# If already applied, you're done!
# Just regenerate client:
npm run db:generate
```

### Error: "Environment variable not found: DATABASE_URL"

**Cause:** File `.env` tidak ada atau salah

**Fix:**
```bash
# Create .env
copy .env.example .env

# Edit .env
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mindspace"
```

### Migration stuck or hanging

**Cause:** Database connection issue

**Fix:**
```bash
# Stop all node processes
# Close Prisma Studio if open
# Restart PostgreSQL
# Try migration again
npm run db:migrate
```

---

## 🔄 Rollback (If Needed)

Jika ada masalah dan ingin rollback:

### Option 1: Manual Rollback

```sql
-- Connect to database
psql -U postgres -d mindspace

-- Remove enum value
-- Note: Ini hanya bisa dilakukan jika tidak ada data yang menggunakan H5P_VIDEO
ALTER TYPE "LessonType" RENAME TO "LessonType_old";
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'QUIZ', 'ASSIGNMENT', 'PRESENTATION', 'DOCUMENT', 'READING');
ALTER TABLE "Lesson" ALTER COLUMN type TYPE "LessonType" USING type::text::"LessonType";
DROP TYPE "LessonType_old";
```

### Option 2: Reset Database (Nuclear Option)

⚠️ **WARNING: This will delete ALL data!**

```bash
npm run db:reset
npm run db:seed
```

---

## 📊 Migration File Location

Migration file akan dibuat di:
```
prisma/
└── migrations/
    └── 20240xxx_add_h5p_video_type/
        └── migration.sql
```

**Content of migration.sql:**
```sql
-- AlterEnum
ALTER TYPE "LessonType" ADD VALUE 'H5P_VIDEO';
```

---

## ✅ Post-Migration Checklist

After successful migration:

- [ ] `npx prisma studio` works
- [ ] Lesson model shows H5P_VIDEO in type enum
- [ ] No errors in console
- [ ] Existing data intact
- [ ] Can create new lessons
- [ ] Dev server starts: `npm run dev`
- [ ] Form shows H5P option in dropdown

---

## 🎯 Expected Changes

### What Changes:
- ✅ `LessonType` enum now includes `H5P_VIDEO`
- ✅ Lesson table can now have type = `H5P_VIDEO`
- ✅ Prisma Client regenerated with new enum

### What Stays the Same:
- ✅ All existing lessons unchanged
- ✅ All other models unchanged
- ✅ All data intact
- ✅ All relationships intact
- ✅ No data loss

---

## 📈 Migration Statistics

| Metric | Value |
|--------|-------|
| Tables modified | 0 |
| Columns modified | 0 |
| Enums modified | 1 (LessonType) |
| Data affected | 0 rows |
| Downtime | 0 seconds |
| Risk level | 🟢 Low |

---

## 🔐 Backup Recommendation

Before migration (optional but recommended):

```bash
# Backup PostgreSQL database
pg_dump -U postgres mindspace > backup_before_h5p_migration.sql

# Restore if needed:
# psql -U postgres mindspace < backup_before_h5p_migration.sql
```

---

## 🚦 Migration Status

Check migration status anytime:

```bash
npx prisma migrate status
```

**Possible outputs:**

1. **All migrations applied:**
   ```
   Database schema is up to date!
   ```
   ✅ Good! You're done.

2. **Pending migrations:**
   ```
   Following migrations have not been applied:
   20240xxx_add_h5p_video_type
   ```
   ⚠️ Run `npm run db:migrate`

3. **Migration failed:**
   ```
   Migration failed:
   ...error details...
   ```
   ❌ Check troubleshooting section

---

## 📞 Need Help?

If migration fails:

1. **Check Error Message**
   - Read the error carefully
   - Check troubleshooting section above

2. **Verify Prerequisites**
   - PostgreSQL running?
   - Database exists?
   - .env file correct?

3. **Try Fresh Start**
   - Close all terminals
   - Restart PostgreSQL
   - Restart VS Code
   - Try again

4. **Check Logs**
   ```bash
   # Check PostgreSQL logs (Windows)
   # Usually in: C:\Program Files\PostgreSQL\15\data\log\
   ```

---

## ✨ Success Indicators

Migration is successful when:

1. ✅ Command completes without errors
2. ✅ Migration file created in `prisma/migrations/`
3. ✅ `npx prisma studio` shows H5P_VIDEO enum
4. ✅ Dev server starts without TypeScript errors
5. ✅ Form dropdown shows "H5P Interactive Video" option

---

**Ready to migrate?**

Copy paste commands step by step:

```bash
# Step 1: Generate
npm run db:generate

# Step 2: Migrate (akan prompt untuk nama)
npm run db:migrate
# Type: add_h5p_video_type

# Step 3: Verify
npx prisma studio

# Step 4: Start dev server
npm run dev
```

**Good luck!** 🚀
