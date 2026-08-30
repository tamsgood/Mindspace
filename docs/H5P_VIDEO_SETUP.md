# Setup H5P Interactive Video - Mindspace LMS

## Fitur yang Ditambahkan

Fitur video player H5P interaktif telah ditambahkan ke sistem dengan kemampuan:

1. **Untuk Mentor**: Dapat mengupload video H5P melalui form upload material
2. **Untuk Student**: Dapat melihat dan memainkan video H5P di halaman Learn

## File yang Ditambahkan/Dimodifikasi

### File Baru:
- `components/lms/H5PPlayer.tsx` - Komponen untuk render H5P interactive video player

### File yang Dimodifikasi:
1. `prisma/schema.prisma` - Menambah enum `H5P_VIDEO` pada LessonType
2. `components/mentor/UploadMaterialForm.tsx` - Menambah opsi "H5P Interactive Video" di dropdown
3. `components/lms/LessonViewer.tsx` - Menambah support untuk render H5P player
4. `app/(lms)/learn/page.tsx` - Menambah icon untuk tipe H5P_VIDEO (warna indigo)
5. `package.json` - Menambah dependency `h5p-standalone`

## Langkah Setup

### 1. Setup Database (Jika belum)

Jika belum setup database, ikuti langkah berikut:

```bash
# Copy .env.example ke .env (jika belum ada)
copy .env.example .env
```

Edit file `.env` dan isi dengan kredensial PostgreSQL:
```env
DATABASE_URL="postgresql://postgres:PASSWORD_KAMU@localhost:5432/mindspace?schema=public"
AUTH_SECRET="your-random-32-char-secret-here"
```

### 2. Jalankan Migration

Setelah file .env sudah disetup:

```bash
# Generate Prisma Client dengan schema baru
npm run db:generate

# Jalankan migration untuk update database
npm run db:migrate
```

Saat diminta nama migration, ketik: `add_h5p_video_type`

### 3. Setup H5P Assets (Opsional untuk Custom H5P)

Jika ingin menggunakan H5P content yang di-host sendiri:

1. Buat folder `public/h5p/`
2. Download H5P core files dari https://h5p.org/
3. Extract dan letakkan di `public/h5p/`

**ATAU** gunakan H5P content yang sudah di-host (lebih mudah):
- Gunakan H5P.com atau platform H5P lainnya
- Copy URL embed H5P content
- Paste URL tersebut di field "File URL" saat upload material

## Cara Menggunakan

### Untuk Mentor (Upload H5P Video):

1. Login sebagai Mentor
2. Klik menu "Materials" → "Upload Material"
3. Pilih Course yang diinginkan
4. Isi Module name dan Lesson title
5. **Pilih Type: "H5P Interactive Video"**
6. Isi Duration (opsional)
7. Isi Content/description
8. **Isi File URL dengan:**
   - URL H5P content dari H5P.com (contoh: `https://h5p.org/h5p/embed/617`)
   - URL H5P content dari server sendiri
   - Path ke file H5P.json (jika di-host di project ini: `/uploads/h5p/content.json`)
9. Klik "Upload material"

### Untuk Student (Melihat H5P Video):

1. Login sebagai Student
2. Enroll ke course yang memiliki H5P content
3. Klik menu "Learn"
4. Pilih lesson dengan tipe "H5P Interactive Video"
5. Video interaktif akan otomatis di-load dan dapat dimainkan
6. Interaksi dengan konten H5P (quiz, hotspot, dll) akan berfungsi
7. Klik "Mark as Complete" setelah selesai

## Contoh URL H5P yang Bisa Digunakan

Untuk testing, gunakan URL embed dari H5P.org:

```
https://h5p.org/h5p/embed/617
https://h5p.org/h5p/embed/712
https://h5p.org/h5p/embed/1045
```

## Troubleshooting

### H5P tidak muncul / Error loading
- Pastikan URL H5P valid dan bisa diakses
- Check console browser untuk error message
- Pastikan content H5P sudah di-publish dan public

### Migration error
- Pastikan PostgreSQL sudah running
- Pastikan .env file sudah diisi dengan benar
- Check koneksi database dengan command: `npx prisma studio`

### Icon tidak muncul di sidebar
- Clear cache browser (Ctrl + Shift + R)
- Restart dev server: `npm run dev:clean`

## Referensi

- H5P Documentation: https://h5p.org/documentation
- H5P Standalone Library: https://www.npmjs.com/package/h5p-standalone
- Create H5P Content: https://h5p.org/content-types-and-applications

## Notes

⚠️ **PENTING**: 
- Kode yang sudah ada TIDAK DIUBAH, hanya menambahkan fitur baru
- Tipe lesson lain (VIDEO, DOCUMENT, dll) tetap berfungsi seperti semula
- H5P_VIDEO adalah tipe baru tambahan, tidak menggantikan VIDEO biasa
