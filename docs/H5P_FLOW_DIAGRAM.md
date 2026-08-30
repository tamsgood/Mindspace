# H5P Video Player - Flow Diagram

## 1. Upload Flow (Mentor)

```
┌─────────────────────────────────────────────────────────────────┐
│                         MENTOR WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

Step 1: Create H5P Content
┌─────────────────┐
│   H5P.org       │
│   Website       │
│                 │
│ 1. Register     │
│ 2. Create       │
│    Interactive  │
│    Video        │
│ 3. Get Embed    │
│    URL          │
└────────┬────────┘
         │
         │ Copy URL: https://h5p.org/h5p/embed/617
         ↓

Step 2: Login to Mindspace
┌─────────────────┐
│   Mindspace     │
│   LMS           │
│                 │
│ Login as:       │
│ MENTOR          │
└────────┬────────┘
         │
         ↓

Step 3: Navigate to Upload Material
┌─────────────────┐
│ Click Menu:     │
│ "Materials" →   │
│ "Upload         │
│  Material"      │
└────────┬────────┘
         │
         ↓

Step 4: Fill Form
┌──────────────────────────────────────┐
│ UploadMaterialForm.tsx              │
│                                      │
│ [Course: Select Course ▼]           │
│ [Module: Module 1: Introduction  ]   │
│ [Lesson: Interactive Video Intro ]   │
│ [Type: H5P Interactive Video ▼] ←─┐ │
│ [Duration: 10:30              ]    │ │
│ [Content: Description...      ]    │ │
│ [File URL: https://h5p.org... ] ←──┼─┘ Paste H5P URL here
│                                      │
│ [Upload Material]                    │
└──────────────────┬───────────────────┘
                   │
                   ↓

Step 5: Save to Database
┌──────────────────────────────────────┐
│ Server Action (createMaterial)       │
│                                      │
│ 1. Validate input                    │
│ 2. Create/Update Module              │
│ 3. Create Lesson:                    │
│    - type: "H5P_VIDEO"               │
│    - fileUrl: H5P embed URL          │
│ 4. Save to PostgreSQL                │
└──────────────────┬───────────────────┘
                   │
                   ↓

Step 6: Success
┌──────────────────────────────────────┐
│ ✓ Material uploaded successfully!    │
│                                      │
│ Students can now view this content   │
│ in the Learn page                    │
└──────────────────────────────────────┘
```

---

## 2. View Flow (Student)

```
┌─────────────────────────────────────────────────────────────────┐
│                         STUDENT WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: Login to Mindspace
┌─────────────────┐
│   Mindspace     │
│   LMS           │
│                 │
│ Login as:       │
│ STUDENT         │
└────────┬────────┘
         │
         ↓

Step 2: Navigate to Learn
┌─────────────────────────────┐
│ Click Menu: "Learn"         │
│                             │
│ Or from Course page:        │
│ "Continue Learning"         │
└──────────┬──────────────────┘
           │
           ↓

Step 3: Learn Page Loads
┌──────────────────────────────────────────────────────┐
│ Learn Page (page.tsx)                                │
│                                                      │
│ ┌─────────────────┐  ┌───────────────────────────┐ │
│ │ SIDEBAR         │  │ MAIN CONTENT              │ │
│ │                 │  │                           │ │
│ │ Module 1        │  │ ┌───────────────────────┐ │ │
│ │ ├─ Lesson 1     │  │ │                       │ │ │
│ │ ├─ Lesson 2     │  │ │   LessonViewer        │ │ │
│ │ │  (H5P Video)  │  │ │                       │ │ │
│ │ │  🎬 (indigo)  │←─┼─┼─ Selected            │ │ │
│ │ └─ Lesson 3     │  │ │                       │ │ │
│ │                 │  │ └───────────────────────┘ │ │
│ │ Module 2        │  │                           │ │
│ │ ├─ Lesson 4     │  │ [Mark as Complete]        │ │
│ │ └─ Lesson 5     │  │                           │ │
│ └─────────────────┘  └───────────────────────────┘ │
└──────────────────────────────────────────────────────┘
           │
           ↓

Step 4: LessonViewer Component
┌──────────────────────────────────────┐
│ LessonViewer.tsx                     │
│                                      │
│ Check lesson type:                   │
│                                      │
│ if (type === "H5P_VIDEO") {          │
│   return <H5PPlayer ... />           │
│ }                                    │
│                                      │
│ else if (type === "VIDEO") {         │
│   return <iframe ... />              │
│ }                                    │
│ ...                                  │
└──────────┬───────────────────────────┘
           │
           ↓ type === "H5P_VIDEO"
           │

Step 5: H5PPlayer Component
┌──────────────────────────────────────────────────────┐
│ H5PPlayer.tsx                                        │
│                                                      │
│ ┌──────────────────────────────────────────────────┐│
│ │                                                  ││
│ │         H5P Interactive Video Player            ││
│ │                                                  ││
│ │  ┌────────────────────────────────────────────┐ ││
│ │  │                                            │ ││
│ │  │   <iframe src="https://h5p.org/...">      │ ││
│ │  │                                            │ ││
│ │  │   [Embedded H5P Content]                  │ ││
│ │  │                                            │ ││
│ │  │   • Video plays                           │ ││
│ │  │   • Quiz appears                          │ ││
│ │  │   • Student answers                       │ ││
│ │  │   • Video continues                       │ ││
│ │  │                                            │ ││
│ │  └────────────────────────────────────────────┘ ││
│ │                                                  ││
│ │  🎬 Interactive Video Intro • 10:30             ││
│ │                                                  ││
│ └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
           │
           ↓ Student completes watching
           │

Step 6: Mark Complete
┌──────────────────────────────────────┐
│ [✓ Mark as Complete]                 │
│                                      │
│ Updates LessonProgress table         │
│ - completed: true                    │
│ - updatedAt: now()                   │
└──────────────────────────────────────┘
```

---

## 3. Component Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      COMPONENT HIERARCHY                       │
└────────────────────────────────────────────────────────────────┘

app/(lms)/learn/page.tsx
│
├─ getLearnCourse(courseId, userId)
│  └─ Returns: Course with Modules, Lessons, Progress
│
├─ Sidebar
│  └─ Lesson List
│     └─ LessonIcon(type)
│        ├─ VIDEO → Play icon (gray)
│        ├─ H5P_VIDEO → Play icon (indigo) ← NEW
│        ├─ QUIZ → Question icon
│        └─ Other → File icon
│
└─ Main Content
   ├─ LessonViewer
   │  ├─ if H5P_VIDEO:
   │  │  └─ H5PPlayer ← NEW COMPONENT
   │  │     ├─ Loading state
   │  │     ├─ Error state
   │  │     └─ iframe (H5P embed)
   │  │
   │  ├─ if VIDEO:
   │  │  └─ iframe (regular video)
   │  │
   │  ├─ if DOCUMENT/PDF:
   │  │  └─ iframe (PDF viewer)
   │  │
   │  └─ if other:
   │     └─ Download link
   │
   └─ MarkCompleteButton
```

---

## 4. Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                          DATA FLOW                             │
└────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   Browser   │
│  (Mentor)   │
└──────┬──────┘
       │
       │ POST /materials/new
       │ FormData: {
       │   courseId,
       │   moduleTitle,
       │   lessonTitle,
       │   type: "H5P_VIDEO", ← NEW
       │   fileUrl: "https://h5p.org/...",
       │   duration,
       │   content
       │ }
       ↓
┌─────────────────────┐
│  Server Action      │
│  createMaterial()   │
│  (app/actions/      │
│   lms.ts)           │
└──────┬──────────────┘
       │
       │ Prisma Query
       ↓
┌─────────────────────┐
│   PostgreSQL DB     │
│                     │
│ Lesson {            │
│   id: "abc123"      │
│   type: H5P_VIDEO   │ ← NEW ENUM VALUE
│   fileUrl: "..."    │
│   ...               │
│ }                   │
└──────┬──────────────┘
       │
       │ Query by Student
       ↓
┌─────────────────────┐
│  Server Action      │
│  getLearnCourse()   │
│  (lib/data.ts)      │
└──────┬──────────────┘
       │
       │ Return data
       ↓
┌─────────────┐
│   Browser   │
│  (Student)  │
│             │
│ Learn Page  │
│   ↓         │
│ LessonViewer│
│   ↓         │
│ H5PPlayer   │ ← Renders if type === H5P_VIDEO
│   ↓         │
│ <iframe>    │
└─────────────┘
```

---

## 5. Database Schema Update

```sql
-- BEFORE (Old enum)
enum LessonType {
  VIDEO
  QUIZ
  ASSIGNMENT
  PRESENTATION
  DOCUMENT
  READING
}

-- AFTER (New enum)
enum LessonType {
  VIDEO
  H5P_VIDEO        ← ADDED
  QUIZ
  ASSIGNMENT
  PRESENTATION
  DOCUMENT
  READING
}

-- Migration SQL (auto-generated by Prisma)
ALTER TYPE "LessonType" ADD VALUE 'H5P_VIDEO';
```

---

## 6. File Structure

```
Mindspace-main/
│
├── app/
│   └── (lms)/
│       ├── learn/
│       │   └── page.tsx                    [MODIFIED] Added H5P icon
│       └── materials/
│           └── new/
│               └── page.tsx                [UNCHANGED]
│
├── components/
│   ├── lms/
│   │   ├── LessonViewer.tsx               [MODIFIED] Added H5P support
│   │   └── H5PPlayer.tsx                  [NEW] H5P player component
│   │
│   └── mentor/
│       └── UploadMaterialForm.tsx         [MODIFIED] Added H5P option
│
├── lib/
│   ├── data.ts                            [UNCHANGED]
│   ├── h5p-utils.ts                       [NEW] Helper functions
│   └── prisma.ts                          [UNCHANGED]
│
├── prisma/
│   └── schema.prisma                      [MODIFIED] Added H5P_VIDEO enum
│
├── docs/
│   ├── H5P_USER_GUIDE.md                  [NEW] User documentation
│   └── H5P_FLOW_DIAGRAM.md                [NEW] This file
│
├── H5P_VIDEO_SETUP.md                     [NEW] Setup guide
├── CHANGELOG_H5P.md                       [NEW] Changelog
├── .env.example                           [NEW] Env template
│
└── package.json                           [MODIFIED] Added h5p-standalone
```

---

## 7. User Journey Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     MENTOR USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

1. Preparation (External)
   ┌──────────────────────────┐
   │ Go to H5P.org            │
   │ Create account           │
   │ Make interactive video   │
   │ Get embed URL            │
   └────────────┬─────────────┘
                │
                ↓
2. Login to Mindspace
   ┌──────────────────────────┐
   │ Open mindspace.edu       │
   │ Login with mentor email  │
   │ See Dashboard            │
   └────────────┬─────────────┘
                │
                ↓
3. Navigate
   ┌──────────────────────────┐
   │ Click "Materials" menu   │
   │ Click "Upload Material"  │
   └────────────┬─────────────┘
                │
                ↓
4. Fill Form
   ┌──────────────────────────┐
   │ Select Course            │
   │ Enter Module name        │
   │ Enter Lesson title       │
   │ Select Type:             │
   │   "H5P Interactive Video"│
   │ Paste H5P URL            │
   │ Enter duration           │
   │ Write description        │
   └────────────┬─────────────┘
                │
                ↓
5. Submit
   ┌──────────────────────────┐
   │ Click "Upload material"  │
   │ See success message      │
   └────────────┬─────────────┘
                │
                ↓
6. Verify
   ┌──────────────────────────┐
   │ Go to "Learn" page       │
   │ See new lesson in list   │
   │ Play to test             │
   └──────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT USER JOURNEY                        │
└─────────────────────────────────────────────────────────────────┘

1. Login
   ┌──────────────────────────┐
   │ Open mindspace.edu       │
   │ Login with student email │
   │ See Dashboard            │
   └────────────┬─────────────┘
                │
                ↓
2. Find Course
   ┌──────────────────────────┐
   │ Click "Courses" menu     │
   │ Browse available courses │
   │ Or see enrolled courses  │
   └────────────┬─────────────┘
                │
                ↓
3. Open Learn
   ┌──────────────────────────┐
   │ Click "Learn" menu       │
   │ See course modules       │
   │ See lesson list          │
   └────────────┬─────────────┘
                │
                ↓
4. Select Lesson
   ┌──────────────────────────┐
   │ Find lesson with         │
   │ indigo play icon 🎬      │
   │ Click to open            │
   └────────────┬─────────────┘
                │
                ↓
5. Watch & Interact
   ┌──────────────────────────┐
   │ H5P video loads          │
   │ Click play               │
   │ Watch video              │
   │ Answer quiz when appears │
   │ Click hotspots           │
   │ Continue watching        │
   └────────────┬─────────────┘
                │
                ↓
6. Complete
   ┌──────────────────────────┐
   │ Finish watching          │
   │ Click "Mark as Complete" │
   │ See checkmark ✓          │
   │ Progress updated         │
   └──────────────────────────┘
```

---

## 8. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      ERROR SCENARIOS                            │
└─────────────────────────────────────────────────────────────────┘

Scenario 1: Invalid H5P URL
┌──────────────────┐
│ Student opens    │
│ H5P lesson       │
└────────┬─────────┘
         │
         ↓
    URL invalid?
         │
         ├─ YES → Show error message
         │        "Failed to load H5P content"
         │        "Please contact instructor"
         │
         └─ NO  → Continue loading


Scenario 2: H5P Content Not Found (404)
┌──────────────────┐
│ H5PPlayer loads  │
│ iframe           │
└────────┬─────────┘
         │
         ↓
    H5P returns 404?
         │
         ├─ YES → Iframe shows H5P error
         │        Student sees "Content not found"
         │
         └─ NO  → Content loads normally


Scenario 3: Network Error
┌──────────────────┐
│ Student offline  │
│ or slow internet │
└────────┬─────────┘
         │
         ↓
    Show loading state
         │
         ↓
    Timeout after 30s?
         │
         ├─ YES → Show error
         │        "Cannot load content"
         │        "Check internet connection"
         │
         └─ NO  → Continue loading


Scenario 4: Mentor Uploads Wrong URL
┌──────────────────┐
│ Mentor pastes    │
│ non-H5P URL      │
└────────┬─────────┘
         │
         ↓
    Form validates?
         │
         ├─ Not validated → Saves to DB
         │                  Student sees iframe
         │                  Iframe may fail
         │
         └─ Add validation → Check URL format
                            Show error before save
                            (Future enhancement)
```

---

## Legend

```
┌───┐
│   │  = Component or Page
└───┘

[   ]  = Button or Form Field

─────  = Data flow

  ↓    = Direction of flow

 ...   = Continuation

 ←─    = Reference or Selection

 🎬    = Icon (Play icon for H5P)

 ✓    = Success or Completion
```

---

## Summary

Diagram ini menunjukkan:
1. ✅ Bagaimana Mentor upload H5P video
2. ✅ Bagaimana Student melihat H5P video
3. ✅ Flow data dari form ke database ke tampilan
4. ✅ Struktur komponen dan hubungan antar file
5. ✅ Error handling scenarios
6. ✅ User journey lengkap

**Key Points**:
- Tidak ada perubahan pada flow yang sudah ada
- H5P adalah addition, bukan replacement
- Semua komponen existing tetap berjalan normal
