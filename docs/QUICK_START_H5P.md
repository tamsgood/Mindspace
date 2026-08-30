# Quick Start: H5P Interactive Video

> **Panduan singkat untuk mulai menggunakan fitur H5P Video Player**

---

## 🚀 Setup Cepat (5 Menit)

### 1. Install Dependencies (Sudah Selesai ✅)
```bash
npm install h5p-standalone
```

### 2. Setup Environment
```bash
# Copy template .env
copy .env.example .env

# Edit .env, ganti PASSWORD_KAMU:
DATABASE_URL="postgresql://postgres:PASSWORD_KAMU@localhost:5432/mindspace"
AUTH_SECRET="generate-random-secret-here"
```

### 3. Update Database
```bash
# Generate Prisma Client
npm run db:generate

# Run Migration
npm run db:migrate
# Ketik nama migration: add_h5p_video_type
```

### 4. Start Server
```bash
npm run dev
```

Buka: http://localhost:3000

---

## 👨‍🏫 Untuk Mentor: Upload H5P (2 Menit)

### Option A: Gunakan Sample URL (Tercepat)
1. Login sebagai Mentor: `mentor@mindspace.edu` / `Mentor123!`
2. Buka: **Materials → Upload Material**
3. Isi form:
   - **Course**: Pilih course apapun
   - **Module name**: `Module Test H5P`
   - **Lesson title**: `Interactive Video Test`
   - **Type**: `H5P Interactive Video` ← Pilih ini
   - **Duration**: `5:30`
   - **File URL**: `https://h5p.org/h5p/embed/617` ← Copy paste
4. Klik **Upload material**

### Option B: Buat H5P Sendiri
1. Daftar di https://h5p.org/user/register (Gratis)
2. Create new content → Interactive Video
3. Upload video atau gunakan YouTube URL
4. Tambah quiz/interaksi
5. Simpan, copy embed URL
6. Paste di Mindspace (langkah seperti Option A)

---

## 👨‍🎓 Untuk Student: Lihat H5P (1 Menit)

1. Login sebagai Student: `andi@email.com` / `Student123!`
2. Buka: **Learn** (dari sidebar)
3. Klik lesson dengan icon play **warna ungu/indigo** 🎬
4. Video H5P akan otomatis load
5. Play, jawab quiz, interaksi
6. Klik **Mark as Complete** setelah selesai

---

## 📚 Sample URLs untuk Testing

Copy paste URL ini di field "File URL" saat upload:

```
Interactive Video:
https://h5p.org/h5p/embed/617

Course Presentation:
https://h5p.org/h5p/embed/1045

Quiz:
https://h5p.org/h5p/embed/712
```

---

## ❓ Troubleshooting

### Database error saat migrate?
```bash
# Check apakah PostgreSQL running
# Cek .env file sudah benar
# Test koneksi:
npx prisma studio
```

### H5P tidak muncul di browser?
- F12 → Console → Lihat error
- Clear cache: Ctrl + Shift + R
- Coba URL sample di atas
- Pastikan internet connected

### Opsi "H5P Interactive Video" tidak muncul?
```bash
# Re-generate Prisma
npm run db:generate

# Restart dev server
npm run dev
```

---

## 📖 Dokumentasi Lengkap

Untuk detail lebih lanjut, baca:
- `H5P_VIDEO_SETUP.md` - Setup instructions
- `docs/H5P_USER_GUIDE.md` - User guide lengkap
- `docs/H5P_FLOW_DIAGRAM.md` - Flow diagram
- `CHANGELOG_H5P.md` - What changed

---

## ✅ Checklist

Pastikan sudah:
- [ ] `npm install` berhasil
- [ ] File `.env` sudah dibuat dan diisi
- [ ] `npm run db:migrate` berhasil
- [ ] Server running (`npm run dev`)
- [ ] Bisa login sebagai Mentor
- [ ] Opsi "H5P Interactive Video" muncul di dropdown
- [ ] Upload test dengan sample URL berhasil
- [ ] Bisa login sebagai Student
- [ ] Bisa lihat dan play H5P video

---

## 🎯 Next Steps

Setelah testing berhasil:

1. **Buat H5P Content Sendiri**
   - Register di H5P.org
   - Buat interactive video dengan materi Anda
   - Upload ke Mindspace

2. **Struktur Course**
   - Buat module dengan kombinasi:
     - H5P Video (untuk pembelajaran interaktif)
     - Document/PDF (untuk referensi)
     - Quiz (untuk evaluasi)
     - Assignment (untuk praktik)

3. **Monitor Student Progress**
   - Cek completion rate di dashboard
   - Lihat students yang sudah complete

---

**That's it! 🎉**

Anda sudah siap menggunakan H5P Interactive Video di Mindspace LMS!
