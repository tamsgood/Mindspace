# Panduan Penggunaan H5P Interactive Video

## Apa itu H5P?

H5P (HTML5 Package) adalah platform untuk membuat konten interaktif seperti:
- Interactive Video (video dengan quiz, hotspot, dll)
- Course Presentation (slide interaktif)
- Quiz / Question Set
- Timeline interaktif
- Memory Game
- Dan 50+ jenis konten lainnya

## Untuk Mentor: Cara Upload H5P Video

### Opsi 1: Menggunakan H5P dari H5P.org (Paling Mudah)

1. **Buat Akun di H5P.org** (Gratis)
   - Kunjungi: https://h5p.org/user/register
   - Daftar dengan email Anda

2. **Buat H5P Content**
   - Login ke H5P.org
   - Klik "Create new content"
   - Pilih "Interactive Video"
   - **Pilih source video**:
     - **YouTube**: Paste YouTube URL (contoh: `https://www.youtube.com/watch?v=VIDEO_ID`)
     - **Vimeo**: Paste Vimeo URL
     - **Upload**: Upload video file dari komputer
   - Tambahkan interaksi (quiz, text, images, dll)
   - Klik "Create"

3. **Dapatkan Embed URL**
   - Setelah content dibuat, klik "Reuse"
   - Copy URL embed (contoh: `https://h5p.org/h5p/embed/617`)

4. **Upload ke Mindspace**
   - Login sebagai Mentor di Mindspace
   - Buka menu "Materials" → "Upload Material"
   - Pilih Course
   - Isi Module name dan Lesson title
   - **Type: Pilih "H5P Interactive Video"**
   - Paste URL embed di field "File URL"
   - Klik "Upload material"

**💡 Tips untuk YouTube**:
- H5P Interactive Video mendukung YouTube secara native
- Tidak perlu download video YouTube
- Video tetap di-host di YouTube (gratis)
- H5P hanya menambahkan layer interaksi di atas video

### Opsi 2: Menggunakan H5P.com (Premium, lebih banyak fitur)

1. Buat akun di H5P.com
2. Buat content interaktif
3. Publish dan dapatkan embed code/URL
4. Copy URL embed
5. Upload ke Mindspace seperti Opsi 1

### Opsi 3: Self-Hosted (Advanced)

Untuk meng-host H5P content sendiri:

1. Install H5P di WordPress/Drupal/Moodle
2. Buat H5P content
3. Export sebagai .h5p file
4. Upload ke `public/uploads/h5p/` di project ini
5. Extract file .h5p (format ZIP)
6. Gunakan path ke h5p.json sebagai URL

---

## 🎬 Menggunakan YouTube dengan H5P

### Cara 1: H5P Interactive Video + YouTube (RECOMMENDED)

**Untuk video interaktif dengan quiz/hotspot:**

1. **Buat H5P di H5P.org**
2. Pilih "Interactive Video"
3. Di video source, pilih **"YouTube"**
4. Paste URL YouTube: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
5. H5P akan otomatis embed YouTube player
6. Tambahkan interaksi (quiz di menit tertentu, hotspot, dll)
7. Simpan dan get embed URL
8. Upload ke Mindspace

**Keuntungan**:
- ✅ Video tetap di YouTube (tidak perlu storage)
- ✅ Tambah quiz/interaksi
- ✅ Track student engagement
- ✅ Pedagogically rich

**Contoh Use Case**:
- Video tutorial YouTube + quiz di tengah video
- Video lecture + pertanyaan pemahaman
- Video demo + hotspot untuk highlight details

### Cara 2: Regular Video (Tanpa Interaksi)

**Untuk video YouTube biasa tanpa interaksi:**

1. **Buka video YouTube**
2. Klik "Share" → "Embed"
3. Copy URL embed: `https://www.youtube.com/embed/VIDEO_ID`
4. Di Mindspace, upload material
5. Type: **"Video"** (bukan H5P)
6. Paste embed URL di "File URL"

**Keuntungan**:
- ✅ Lebih simple
- ✅ Tidak perlu buat H5P content
- ✅ Direct YouTube embed

**Kapan Gunakan Ini**:
- Video tidak butuh interaksi
- Hanya untuk ditonton saja
- Content support/supplementary

### Perbandingan:

| Feature | H5P + YouTube | Regular YouTube |
|---------|---------------|-----------------|
| Video Source | YouTube | YouTube |
| Hosting | H5P.org | YouTube |
| Interaksi | ✅ Quiz, hotspot, etc | ❌ None |
| Setup | Medium | Easy |
| Pedagogical Value | High | Medium |
| Best For | Learning content | Supplementary |

### Tips Memilih YouTube Video:

1. **Video Quality**
   - Minimal 720p (HD)
   - Audio jelas
   - Subtitle tersedia (bagus untuk accessibility)

2. **Video Length**
   - Optimal: 5-15 menit per video
   - Jika lebih panjang: Bagi jadi beberapa lesson
   - H5P Interactive: Tambah quiz setiap 3-5 menit

3. **Copyright**
   - Gunakan video milik sendiri
   - Atau video dengan lisensi Creative Commons
   - Check izin penggunaan untuk edukasi

4. **YouTube Settings**
   - Set video "Unlisted" atau "Public" (bukan Private)
   - Enable embedding
   - Disable age restriction (agar bisa diembed)

## Untuk Student: Cara Menggunakan

1. **Akses Course**
   - Login sebagai Student
   - Buka menu "Courses"
   - Pilih course yang sudah di-enroll

2. **Buka Halaman Learn**
   - Klik tombol "Continue Learning" atau menu "Learn"
   - Pilih lesson dengan icon play berwarna ungu/indigo (H5P Video)

3. **Gunakan H5P Interactive Video**
   - Video akan otomatis load
   - Klik play untuk mulai menonton
   - Saat ada interaksi (quiz/pertanyaan), video akan pause
   - Jawab pertanyaan atau klik hotspot
   - Video akan melanjut setelah interaksi selesai

4. **Mark Complete**
   - Setelah selesai menonton dan berinteraksi
   - Klik tombol "Mark as Complete"
   - Progress akan tersimpan

## Jenis Interaksi H5P yang Tersedia

### 1. Interactive Video
- Video dengan quiz di tengah video
- Hotspot klikable
- Text pop-up
- Navigasi chapter

### 2. Course Presentation
- Slide interaktif seperti PowerPoint
- Bisa berisi video, quiz, gambar
- Navigasi slide

### 3. Question Set / Quiz
- Multiple choice
- True/False
- Fill in the blanks
- Drag and drop
- Dan lainnya

### 4. Timeline
- Timeline interaktif dengan media

### 5. Memory Game
- Game mengingat kartu

## Tips untuk Mentor

### Membuat Interactive Video yang Baik:

1. **Gunakan Video Berkualitas**
   - Resolusi minimal 720p
   - Audio jelas
   - Durasi 5-15 menit per video

2. **Tambahkan Interaksi Secara Strategis**
   - Setiap 2-3 menit
   - Setelah konsep penting dijelaskan
   - Untuk mengecek pemahaman

3. **Jenis Interaksi yang Efektif**:
   - **Quiz**: Cek pemahaman
   - **Text Overlay**: Highlight point penting
   - **Hotspot**: Tunjukkan detail di gambar/video
   - **Summary**: Ringkasan di akhir video

4. **Gunakan Feedback**
   - Berikan feedback untuk jawaban benar/salah
   - Jelaskan mengapa jawaban benar/salah

### Struktur Module yang Baik:

```
Module 1: Introduction
├── Lesson 1: Overview (H5P Interactive Video)
├── Lesson 2: Key Concepts (H5P Course Presentation)
└── Lesson 3: Quiz (H5P Question Set)

Module 2: Deep Dive
├── Lesson 4: Tutorial Part 1 (H5P Interactive Video)
├── Lesson 5: Tutorial Part 2 (H5P Interactive Video)
└── Lesson 6: Practice (Assignment)
```

## Sample URLs untuk Testing

Berikut adalah sample H5P content yang bisa langsung digunakan untuk testing:

### Interactive Videos:
```
https://h5p.org/h5p/embed/617
https://h5p.org/h5p/embed/1214
```

### Course Presentations:
```
https://h5p.org/h5p/embed/1045
https://h5p.org/h5p/embed/169
```

### Quizzes:
```
https://h5p.org/h5p/embed/712
https://h5p.org/h5p/embed/52
```

### Lainnya:
```
Timeline: https://h5p.org/h5p/embed/120
Memory Game: https://h5p.org/h5p/embed/54
Drag and Drop: https://h5p.org/h5p/embed/58
```

## Troubleshooting

### Video H5P tidak muncul?
- **Check URL**: Pastikan URL valid dan bisa diakses
- **Check Browser Console**: Tekan F12, lihat tab Console untuk error
- **Try Different URL**: Coba URL sample di atas
- **Clear Cache**: Ctrl + Shift + R

### H5P loading lambat?
- H5P content di-load dari server eksternal (H5P.org)
- Tergantung koneksi internet
- Untuk performa lebih baik, gunakan self-hosted

### Interaksi tidak bekerja?
- Pastikan menggunakan browser modern (Chrome, Firefox, Edge)
- Enable JavaScript
- Disable ad-blocker untuk domain H5P

### Error "Cannot load H5P content"?
- URL mungkin private atau tidak valid
- Content mungkin sudah dihapus
- Cek apakah URL bisa dibuka di browser

## Best Practices

### Security:
✅ **DO**:
- Gunakan HTTPS URLs
- Validasi URL sebelum save
- Gunakan content dari sumber terpercaya

❌ **DON'T**:
- Embed content dari sumber tidak jelas
- Share API keys di URL
- Upload executable files

### Performance:
✅ **DO**:
- Kompres video sebelum upload ke H5P
- Gunakan YouTube/Vimeo untuk video besar
- Batasi ukuran file H5P < 50MB

❌ **DON'T**:
- Upload video 4K untuk pembelajaran online
- Terlalu banyak interaksi (overload)

### Pedagogy:
✅ **DO**:
- Jelaskan tujuan pembelajaran di awal
- Gunakan interaksi untuk reinforcement
- Berikan feedback yang konstruktif
- Test content sebelum publish

❌ **DON'T**:
- Membuat video terlalu panjang (>20 menit)
- Skip explanation di quiz
- Membuat quiz terlalu sulit di awal

## Resources

### Official H5P:
- Website: https://h5p.org
- Documentation: https://h5p.org/documentation
- Examples: https://h5p.org/content-types-and-applications
- Forum: https://h5p.org/forum
- Tutorial: https://h5p.org/documentation/for-authors/tutorials

### Video Tutorials:
- H5P Interactive Video Tutorial: https://www.youtube.com/watch?v=lIBF5xCe2Ww
- H5P Course Presentation: https://www.youtube.com/watch?v=EiS43Km7R3Q

### Alternative Platforms:
- Lumi (Desktop H5P Editor): https://lumi.education
- H5P WordPress Plugin: https://wordpress.org/plugins/h5p/
- H5P Moodle Plugin: https://moodle.org/plugins/mod_hvp

## FAQ

**Q: Apakah H5P gratis?**
A: Ya, H5P.org gratis untuk membuat dan share content. H5P.com berbayar dengan fitur lebih lengkap.

**Q: Apakah bisa pakai video YouTube di H5P?**
A: Ya! Ada 2 cara:
1. **H5P Interactive Video**: Buat di H5P.org, pilih YouTube sebagai video source, tambah interaksi → Upload embed URL ke Mindspace dengan type "H5P Interactive Video"
2. **Regular Video**: Langsung paste YouTube embed URL ke Mindspace dengan type "Video" (tanpa interaksi H5P)

**Q: Apa bedanya H5P dengan YouTube embed biasa?**
A: 
- **H5P**: Video + interaksi (quiz, hotspot, text overlay) → Untuk pembelajaran aktif
- **YouTube Embed**: Video saja tanpa interaksi → Untuk supplementary material

**Q: Apakah bisa tracking hasil quiz H5P?**
A: Saat ini hanya tracking completion (completed/not completed). Untuk tracking score, perlu integrasi xAPI/LRS (advanced).

**Q: Apakah bisa edit H5P content setelah upload?**
A: Edit dilakukan di H5P.org, lalu URL yang sama akan otomatis terupdate di Mindspace.

**Q: Apakah bisa upload video langsung di Mindspace?**
A: Untuk H5P, buat dulu di H5P.org kemudian embed. Untuk video biasa (non-interaktif), gunakan type "Video" bukan "H5P Interactive Video".

**Q: Berapa ukuran maksimal H5P content?**
A: Tidak ada limit di Mindspace karena content di-host di H5P.org. Limit tergantung platform H5P yang digunakan.

**Q: Video YouTube saya private, apakah bisa diembed?**
A: Tidak. Video harus "Unlisted" atau "Public", dan embedding harus di-enable di YouTube settings.

**Q: Apakah student perlu akun YouTube untuk menonton?**
A: Tidak. Video YouTube yang diembed bisa ditonton tanpa login YouTube.

---

**Need Help?**
Contact support atau check dokumentasi di `H5P_VIDEO_SETUP.md`
