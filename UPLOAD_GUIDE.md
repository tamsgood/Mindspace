# File Upload Feature

## Overview

Implemented local file upload for:
- **Students**: Submit assignments from device
- **Mentors**: Upload material files for lessons

## What Changed

### Database (Prisma Schema)
- `Submission.fileUrl`: stores uploaded submission file path
- `Lesson.fileUrl`: stores uploaded material file path

### File Storage
- Files saved to `public/uploads/{folder}/` (ignored in git)
- Folders: `submissions/`, `materials/`, `assignments/`
- Filename format: `{timestamp}-{sanitized-original-name}`

### Validation
- File size limits per assignment/material
- File type validation based on extensions
- Students: only see assignments from enrolled courses

### New Functions
- `lib/upload.ts`: `saveUploadedFile()`, `validateFile()`
- `lib/data.ts`: `getAssignmentsForSubmission()` — filters unsubmitted assignments for students

### Updated Components
- `SubmissionForm`: file input with drag-drop UI
- `UploadMaterialForm`: file attachment for lessons
- Submissions page: download links for uploaded files

## Testing

1. **Student flow**:
   - Login as student (`andi@email.com / Student123!`)
   - Go to Submissions → only assignments from enrolled courses shown
   - Select assignment → attach file → submit
   - Check table below: file should have download link

2. **Mentor flow**:
   - Login as mentor (`mentor@mindspace.edu / Mentor123!`)
   - Go to Upload material
   - Fill form + attach file (PDF/ZIP/etc) → upload
   - Check Learn page: lesson should have file attached

## For Production

Replace `lib/upload.ts` with cloud storage:
- **Vercel**: use `@vercel/blob`
- **AWS**: use S3 + presigned URLs
- **Cloudinary**: use their SDK

Current local storage is for dev only.

## Security Notes

- File uploads are validated (size + type)
- Filenames sanitized (no path traversal)
- Uploads folder ignored in git (contains user data)
- For production: use cloud storage with CDN
