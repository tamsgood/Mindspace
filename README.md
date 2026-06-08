# Mindspace LMS

Learning Management System untuk Mindscape — Next.js 16 + Prisma + PostgreSQL + NextAuth.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth v5 (credentials + JWT)
- **Charts**: Recharts
- **UI Icons**: Lucide React

## Prerequisites

Sebelum clone & setup, pastikan sudah install:

- **Node.js** 20.x atau lebih baru ([download](https://nodejs.org/))
- **PostgreSQL** 14+ ([download](https://www.postgresql.org/download/) atau gunakan pgAdmin)
- **Git** ([download](https://git-scm.com/))

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd Mindspace_LMS/web
```

### 2. Install Dependencies

```bash
npm install
```

Ini akan install semua packages (~600 MB di `node_modules`). Tunggu hingga selesai.

### 3. Setup Database

#### Opsi A: Pakai pgAdmin (Windows)

1. Buka **pgAdmin**
2. Klik kanan **Databases** → **Create** → **Database**
3. Nama database: `mindspace`
4. Owner: `postgres` (default)
5. Klik **Save**

#### Opsi B: Pakai psql (Command Line)

```bash
psql -U postgres
CREATE DATABASE mindspace;
\q
```

### 4. Setup Environment Variables

Copy file `.env.example` jadi `.env`:

```bash
# Windows PowerShell
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan kredensial PostgreSQL kamu:

```env
# Ganti PASSWORD_KAMU dengan password postgres kamu
DATABASE_URL="postgresql://postgres:PASSWORD_KAMU@localhost:5432/mindspace?schema=public"

# Generate secret baru dengan command:
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_SECRET="your-random-32-char-secret-here"
```

**Penting:**
- Ganti `PASSWORD_KAMU` dengan password PostgreSQL yang kamu set saat install
- Default user: `postgres`, default port: `5432`
- Jangan commit file `.env` ke Git (sudah di-ignore)

### 5. Run Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

Ini akan:
- Generate Prisma Client
- Membuat semua tabel di database `mindspace`
- Menjalankan migrations

### 6. Seed Database (Optional)

Populate database dengan data dummy untuk testing:

```bash
npm run db:seed
```

Akun demo yang dibuat:
- **Admin**: `admin@mindspace.edu` / `Admin123!`
- **Mentor**: `mentor@mindspace.edu` / `Mentor123!`
- **Student**: `andi@email.com` / `Student123!`

### 7. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run dev:clean` | Clean cache + start dev server |
| `npm run build` | Build untuk production |
| `npm run start` | Start production server |
| `npm run clean` | Bersihkan `.next` cache |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database dengan data dummy |
| `npm run db:reset` | Reset database (hapus semua data) |

## Project Structure

```
web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login, signup)
│   ├── (lms)/             # Protected LMS routes
│   ├── actions/           # Server Actions
│   └── api/               # API routes (NextAuth)
├── components/            # React components
│   ├── admin/            # Admin-only components
│   ├── auth/             # Auth forms
│   ├── lms/              # General LMS components
│   └── mentor/           # Mentor-only components
├── lib/                   # Utilities & configs
│   ├── prisma.ts         # Prisma client
│   ├── rbac.ts           # Role-based access control
│   ├── data.ts           # Data queries
│   └── upload.ts         # File upload utilities
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration files
│   └── seed.ts           # Seed script
├── public/               # Static assets
│   └── uploads/          # User uploaded files (git-ignored)
├── .env                  # Environment variables (git-ignored)
├── .env.example          # Env template
└── package.json          # Dependencies
```

## Roles & Permissions

| Role | Permissions |
|---|---|
| **STUDENT** | View courses, submit assignments, track progress |
| **MENTOR** | Create courses, upload materials, grade submissions, view students |
| **ADMIN** | Manage users, view all data |

## Troubleshooting

### Error: `P1001: Can't reach database server`

**Penyebab**: Password salah atau PostgreSQL belum jalan.

**Fix**:
1. Cek password di `.env` sesuai dengan password PostgreSQL kamu
2. Pastikan PostgreSQL service running (cek di Services Windows atau `pg_ctl status`)

### Error: `P3014: database "mindspace" does not exist`

**Penyebab**: Database belum dibuat.

**Fix**: Ikuti langkah 3 di atas (buat database `mindspace` di pgAdmin atau psql).

### Error: Port 3000 already in use

**Penyebab**: Ada process lain pakai port 3000.

**Fix**:
```bash
# Kill process di port 3000
npx kill-port 3000

# Atau jalankan di port lain
PORT=3001 npm run dev
```

### Build cache terlalu besar / Dev server lambat

**Fix**:
```bash
npm run clean
```

Ini akan hapus `.next` folder dan rebuild dari nol.

## File Upload

File submissions & materials disimpan di `public/uploads/`. Untuk production, ganti dengan cloud storage (Vercel Blob, S3, Cloudinary).

Lihat `UPLOAD_GUIDE.md` untuk detail implementasi.

## Deploy

### Vercel (Recommended)

1. Push ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables di Vercel dashboard:
   - `DATABASE_URL` (dari Railway/Neon/Supabase)
   - `AUTH_SECRET`
   - `AUTH_TRUST_HOST=true`
4. Deploy

### Railway (Database)

1. Buat project baru di [railway.app](https://railway.app)
2. Provision PostgreSQL
3. Copy `DATABASE_URL` dari Variables tab
4. Paste ke Vercel env variables

## Contributing

1. Create feature branch: `git checkout -b feature/nama-fitur`
2. Commit changes: `git commit -m "Add: deskripsi fitur"`
3. Push branch: `git push origin feature/nama-fitur`
4. Create Pull Request

## License

Private project untuk Mindscape.
#