# Quiz Feature - Database Migration Guide

## ⚠️ Important: Run Migration

Sebelum testing fitur Quiz, **wajib** jalankan migration untuk membuat tables di database.

## Step-by-Step Migration

### 1. Generate Prisma Client

```bash
npm run db:generate
```

**Expected output:**
```
✔ Generated Prisma Client
```

### 2. Create and Run Migration

```bash
npm run db:migrate
```

**Saat diminta nama migration, ketik:**
```
add_quiz_feature
```

**Expected output:**
```
✔ Generated Prisma Client
✔ Applied migration: 20240xxx_add_quiz_feature
```

### 3. Verify Migration

Cek apakah tables sudah dibuat:

```bash
npx prisma studio
```

Di Prisma Studio, Anda harus melihat models baru:
- ✅ Quiz
- ✅ QuizQuestion  
- ✅ QuizOption
- ✅ QuizSubmission
- ✅ QuizAnswer

## What's Created

### New Tables:

1. **Quiz**: Main quiz table
   - id, courseId, creatorId, title, description
   - timeLimit, dueDate, totalPoints, status
   - timestamps

2. **QuizQuestion**: Quiz questions
   - id, quizId, type, questionText, points, order
   - correctAnswer (for auto-grading)

3. **QuizOption**: Options for multiple choice
   - id, questionId, optionText, order

4. **QuizSubmission**: Student submissions
   - id, quizId, userId, score, totalPoints, status
   - startedAt, submittedAt, gradedAt

5. **QuizAnswer**: Individual answers
   - id, submissionId, questionId, answerText
   - isCorrect, pointsEarned, feedback

### New Enums:

- **QuestionType**: MULTIPLE_CHOICE, TRUE_FALSE, ESSAY, FILL_IN_BLANK
- **QuizStatus**: DRAFT, PUBLISHED, ARCHIVED

### Relations Updated:

- User → quizzesCreated, quizSubmissions
- Course → quizzes

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"

**Fix**: Pastikan file `.env` sudah dibuat dan diisi.

### Error: "Can't reach database server"

**Fix**: Pastikan PostgreSQL running.

### Error: Migration already exists

**Fix**: Migration sudah pernah dijalankan sebelumnya. Skip step ini.

## After Migration

Setelah migration berhasil:

1. ✅ Restart dev server: `npm run dev`
2. ✅ Test create quiz: Login sebagai mentor → Quizzes → Create quiz
3. ✅ Test take quiz: Login sebagai student → Quizzes → Take quiz
4. ✅ Test grading: Mentor → View submissions → Grade essays

---

**Next**: Baca `QUIZ_FEATURE_GUIDE.md` untuk dokumentasi lengkap.
