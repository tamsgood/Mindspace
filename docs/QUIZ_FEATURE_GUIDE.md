# Quiz Feature - Comprehensive Guide

> **Standalone quiz system dengan multiple question types, auto-grading, dan manual grading untuk essays**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [User Roles](#user-roles)
4. [Question Types](#question-types)
5. [Mentor Guide](#mentor-guide)
6. [Student Guide](#student-guide)
7. [Technical Details](#technical-details)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Fitur Quiz adalah sistem penilaian standalone yang **terpisah** dari:
- ❌ Learn page (untuk video lessons)
- ❌ Materials (untuk upload files)
- ❌ Assignments (untuk submission files)

Quiz memiliki:
- ✅ **Menu sendiri** di sidebar
- ✅ **Halaman khusus** untuk create, take, dan grade
- ✅ **4 tipe pertanyaan** yang dapat dikombinasikan
- ✅ **Auto-grading** untuk MC, TF, Fill in blank
- ✅ **Manual grading** untuk essay
- ✅ **Timer** optional
- ✅ **Due date** optional

---

## Features

### Core Features:

1. **Multiple Question Types**
   - Multiple Choice (dengan checkbox correct answer)
   - True/False
   - Essay (manual grading)
   - Fill in the Blank

2. **Auto-Grading**
   - Multiple Choice: Otomatis check jawaban benar
   - True/False: Otomatis check True/False
   - Fill in Blank: Case-insensitive matching
   - Essay: Perlu manual grading oleh mentor

3. **Quiz Management**
   - Draft → Publish workflow
   - Delete quiz (jika belum ada submissions)
   - View all submissions
   - Grade essays dengan feedback

4. **Student Experience**
   - Take quiz dengan timer countdown
   - Question navigation (previous/next)
   - Progress indicator
   - Instant results (untuk auto-graded)
   - View detailed results dengan correct answers

5. **Mentor Tools**
   - Create quiz dengan dynamic questions
   - Reorder questions (drag/drop-like)
   - View submissions list
   - Grade essays inline
   - Provide feedback

---

## User Roles

### Mentor (MENTOR):
- ✅ Create quiz
- ✅ Publish/delete quiz
- ✅ View all submissions
- ✅ Grade essays
- ✅ Provide feedback
- ❌ Cannot take quizzes

### Student (STUDENT):
- ✅ View published quizzes (dari enrolled courses)
- ✅ Take quiz (once)
- ✅ View results
- ✅ See mentor feedback
- ❌ Cannot create quizzes

### Admin (ADMIN):
- Admin tidak memiliki akses khusus ke Quiz (belum implemented)

---

## Question Types

### 1. Multiple Choice

**Mentor creates:**
```
Question: What is 2 + 2?
Options:
  ○ A. 3
  ● B. 4  ← Check sebagai correct answer
  ○ C. 5
  ○ D. 6
Points: 1
```

**Student sees:**
- Radio buttons untuk pilih satu jawaban
- Options A, B, C, D

**Grading**: Auto (instant)

---

### 2. True/False

**Mentor creates:**
```
Question: The Earth is flat.
Correct answer: ● False  ← Check correct answer
Points: 1
```

**Student sees:**
- 2 radio buttons: True / False

**Grading**: Auto (instant)

---

### 3. Fill in the Blank

**Mentor creates:**
```
Question: The capital of France is _____.
Correct answer: Paris
Points: 1
```

**Student sees:**
- Text input field

**Grading**: Auto (case-insensitive, trimmed)
- "Paris" = "paris" = "PARIS" = " Paris " → All correct

---

### 4. Essay

**Mentor creates:**
```
Question: Explain the water cycle in detail.
Points: 5
```

**Student sees:**
- Large textarea untuk jawaban panjang

**Grading**: Manual
- Mentor beri points (0-5)
- Mentor beri feedback (optional)

---

## Mentor Guide

### A. Create Quiz

1. **Navigate**
   ```
   Sidebar → Teach section → Create quiz
   ```

2. **Fill Quiz Details**
   - Course: Select course (required)
   - Quiz title: e.g., "Module 1 Assessment" (required)
   - Description: Brief description (optional)
   - Time limit: e.g., 30 minutes (optional)
   - Due date: Set deadline (optional)

3. **Add Questions**
   - Click "Add question" button
   - Modal appears dengan form
   
   **For each question:**
   - Select question type (MC/TF/Essay/Fill blank)
   - Enter question text
   - Set points (default: 1)
   - Fill type-specific fields:
     - **MC**: Add options (min 2), check correct answer
     - **TF**: Select True or False as correct
     - **Essay**: No additional fields
     - **Fill blank**: Enter correct answer
   - Click "Add question"

4. **Manage Questions**
   - Reorder: Use up/down arrows
   - Remove: Click trash icon
   - Preview: See question list dengan correct answers

5. **Save as Draft**
   - Click "Create quiz (Draft)"
   - Quiz saved but not visible to students

6. **Publish**
   - Go to quiz detail page
   - Click "Publish" button
   - Now visible to enrolled students

---

### B. View Submissions

1. **Navigate**
   ```
   Quizzes → Click quiz title → View submissions
   ```

2. **Submissions List**
   - Shows all student submissions
   - Status: Graded / Pending grading
   - Score: X/Y points (percentage)

3. **Auto-Graded**
   - MC/TF/Fill blank graded instantly
   - Score calculated automatically
   - Status: "Graded"

4. **Needs Grading (Essays)**
   - Status: "Pending"
   - Essay questions highlighted
   - Grading interface shown

---

### C. Grade Essays

1. **In Submissions Page**
   - Find submission dengan "Pending grading"
   - Scroll to essay questions section

2. **For Each Essay**
   - Read student's answer
   - Enter points earned (0 to max points)
   - Enter feedback (optional but recommended)
   - Click "Save grade"

3. **After All Essays Graded**
   - Status changes to "Graded"
   - Total score calculated
   - Student can see results

---

### D. Tips for Mentors

**Creating Good Quizzes:**
- ✅ Mix question types untuk variety
- ✅ Start dengan MC/TF untuk warm-up
- ✅ End dengan essay untuk deep understanding
- ✅ Total points: 10-20 untuk quiz pendek, 50-100 untuk exam
- ✅ Time limit: 1-2 menit per question

**Multiple Choice:**
- ✅ 4 options ideal (A, B, C, D)
- ✅ Buat distractors yang plausible
- ✅ Avoid "all of the above"
- ✅ Check correct answer dengan hati-hati

**Essay Questions:**
- ✅ Be specific tentang apa yang diminta
- ✅ Set appropriate points (3-10 pts)
- ✅ Beri rubric di description jika kompleks
- ✅ Grade dengan consistent criteria

**Feedback:**
- ✅ Specific (bukan hanya "Good" atau "Wrong")
- ✅ Constructive (explain why)
- ✅ Actionable (suggest improvement)

---

## Student Guide

### A. View Available Quizzes

1. **Navigate**
   ```
   Sidebar → Learn section → Quizzes
   ```

2. **Quiz List**
   - Shows published quizzes dari enrolled courses
   - Status badge: Published
   - Info: Questions count, points, time limit
   - Your status:
     - Not started
     - In progress
     - Submitted (pending grading)
     - Graded (see score)

---

### B. Take Quiz

1. **Start Quiz**
   - Click quiz card
   - Redirected to take page
   - See quiz header (title, questions count, time limit)

2. **Answer Questions**
   - One question at a time
   - Current question highlighted
   - Progress bar shows completion

3. **Question Navigation**
   - "Previous" button: Go back
   - "Next" button: Go forward
   - Number buttons: Jump to specific question
   - Green numbers: Already answered
   - Gray numbers: Not answered yet

4. **Answer Types:**
   - **MC**: Click radio button untuk select option
   - **TF**: Click True or False
   - **Fill blank**: Type answer di text field
   - **Essay**: Type answer di textarea (bisa panjang)

5. **Timer (if enabled)**
   - Shows remaining time di top right
   - Red warning jika < 5 minutes
   - Auto-submit when time runs out

6. **Submit**
   - Click "Submit quiz" di last question
   - Confirmation jika ada unanswered questions
   - Cannot change after submit

---

### C. View Results

1. **After Submit**
   - Auto-graded (MC/TF/Fill): Instant results
   - Has essay: Redirected to "submitted" page
   - Wait for mentor to grade essays

2. **Results Page**
   - Score card dengan percentage
   - Pass/Not pass indicator (60% threshold)
   - Detailed review:
     - Your answer
     - Correct answer (jika salah)
     - Mentor feedback (untuk essay)
   - ✓ Green checkmark: Correct
   - ✗ Red X: Incorrect

3. **After Viewing**
   - Back to quizzes
   - Continue learning

---

### D. Tips for Students

**Before Taking:**
- ✅ Review materi dulu
- ✅ Check time limit
- ✅ Prepare tempat yang tenang
- ✅ Stable internet connection

**During Quiz:**
- ✅ Read questions carefully
- ✅ Answer all questions (use navigation)
- ✅ Use all available time
- ✅ For essays: Organize thoughts, use paragraphs

**After Results:**
- ✅ Review wrong answers
- ✅ Understand why wrong
- ✅ Read mentor feedback
- ✅ Review materi untuk topics yang salah

---

## Technical Details

### Architecture

```
Database Models:
Quiz
├── QuizQuestion[]
│   └── QuizOption[] (for MC)
└── QuizSubmission[]
    └── QuizAnswer[]

Question Types (Enum):
- MULTIPLE_CHOICE
- TRUE_FALSE
- ESSAY
- FILL_IN_BLANK

Quiz Status (Enum):
- DRAFT (not visible to students)
- PUBLISHED (visible, can be taken)
- ARCHIVED (future use)
```

### Auto-Grading Logic

```typescript
if (type === "MULTIPLE_CHOICE") {
  isCorrect = answerText === correctAnswer; // option index
}

if (type === "TRUE_FALSE") {
  isCorrect = answerText === correctAnswer; // "True" or "False"
}

if (type === "FILL_IN_BLANK") {
  isCorrect = answerText.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}

if (type === "ESSAY") {
  isCorrect = null; // needs manual grading
  pointsEarned = 0;
}
```

### Submission Status Flow

```
1. Student starts quiz
   → Status: IN_PROGRESS
   → score: null

2. Student submits quiz
   → Auto-grade MC/TF/Fill blank
   → Has essays? → Status: SUBMITTED, score: null
   → No essays? → Status: GRADED, score: calculated

3. Mentor grades essays
   → Calculate total score
   → All essays graded? → Status: GRADED
```

### Routes

**Pages:**
```
/quizzes              → List (mentor & student different view)
/quizzes/new          → Create (mentor only)
/quizzes/[id]         → Detail (mentor: overview, student: redirect)
/quizzes/[id]/take    → Take quiz (student only)
/quizzes/[id]/result  → View results (student only)
/quizzes/[id]/submissions → Grade (mentor only)
```

**Server Actions:**
```
createQuiz(formData)
publishQuiz(quizId)
deleteQuiz(quizId)
submitQuiz(quizId, answers)
gradeEssay(answerId, points, feedback)
```

---

## Troubleshooting

### Migration Issues

**Problem**: Quiz menu tidak muncul
- **Solution**: Run `npm run db:migrate` dulu

**Problem**: TypeScript error di Quiz models
- **Solution**: Run `npm run db:generate`

---

### Create Quiz Issues

**Problem**: "At least one question is required"
- **Solution**: Add minimum 1 question sebelum create

**Problem**: Cannot add option untuk MC
- **Solution**: Click "Add option" button, minimal 2 options

**Problem**: Correct answer tidak ke-save
- **Solution**: Pastikan checkbox correct answer di-check sebelum add question

---

### Take Quiz Issues

**Problem**: Quiz tidak muncul di student's list
- **Solution**: 
  1. Quiz harus status PUBLISHED (bukan DRAFT)
  2. Student harus enrolled di course quiz tersebut

**Problem**: Timer tidak jalan
- **Solution**: Refresh page, check browser console for errors

**Problem**: Cannot submit quiz
- **Solution**: Check internet connection, try again

---

### Grading Issues

**Problem**: Essay tidak muncul di submissions page
- **Solution**: Student harus submit quiz dulu

**Problem**: Cannot save grade untuk essay
- **Solution**: Points harus antara 0 dan max points

**Problem**: Score tidak update setelah grade essay
- **Solution**: Refresh page, score akan update otomatis

---

## Future Enhancements

Ideas untuk future development (not implemented yet):

- [ ] Edit quiz (currently cannot edit after create)
- [ ] Quiz analytics (average score, question difficulty)
- [ ] Question bank (reuse questions across quizzes)
- [ ] Randomize question order
- [ ] Randomize option order (for MC)
- [ ] Multiple attempts allowed
- [ ] Show correct answer after submit (optional)
- [ ] Export results to CSV
- [ ] Quiz templates
- [ ] Image support in questions
- [ ] Math equation support (LaTeX)

---

## FAQ

**Q: Apakah quiz bisa di-edit setelah dibuat?**
A: Saat ini belum. Jika ada typo, delete dan create baru (jika belum ada submissions).

**Q: Apakah student bisa retake quiz?**
A: Saat ini tidak. One attempt only.

**Q: Apakah quiz bisa dikerjakan tanpa time limit?**
A: Ya, leave time limit field empty saat create.

**Q: Apakah bisa kombinasi semua tipe pertanyaan dalam satu quiz?**
A: Ya! Itulah tujuannya. Mix and match sesuka Anda.

**Q: Bagaimana cara passing score ditentukan?**
A: Currently hardcoded 60%. Future: mentor bisa set custom passing score.

**Q: Apakah auto-grading 100% akurat?**
A: 
- MC: Ya (exact match)
- TF: Ya (exact match)
- Fill blank: 95% (case-insensitive, tapi spelling harus exact)
- Essay: Manual grading (mentor decision)

**Q: Apakah student bisa lihat correct answer setelah submit?**
A: Ya, di result page, untuk wrong answers, correct answer ditampilkan.

**Q: Apakah mentor bisa re-grade essay?**
A: Ya, click "Update grade" di submissions page.

---

## Support & Resources

### Files Reference:
- Schema: `prisma/schema.prisma`
- Actions: `app/actions/quiz.ts`
- Data queries: `lib/data-quiz.ts`
- Components: `components/quiz/`
- Pages: `app/(lms)/quizzes/`

### Need Help?
1. Check this documentation
2. Check `QUIZ_MIGRATION.md` untuk setup
3. Check browser console untuk errors
4. Check Prisma Studio untuk data

---

**Happy quizzing!** 🎯📝
