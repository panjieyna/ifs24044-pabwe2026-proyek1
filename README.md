# DelLib Staff — Sistem Manajemen & Inventaris Koleksi Buku Perpustakaan IT Del

Proyek 1 PABWE 2026 (ifs24044). Frontend Vue 3 + Vite + Pinia + Vue Router + Tailwind (folder `frontend/`) dan backend Node.js + SQLite (folder `backend/`).

## A. Latar Belakang & Masalah
Pengelolaan koleksi buku fisik di Perpustakaan Institut Teknologi Del memerlukan pencatatan inventaris yang akurat dan rapi. Staf perpustakaan menghadapi kendala jika pendataan buku baru, pembaruan jumlah eksemplar/stok buku yang rusak atau hilang, serta penataan lokasi rak dilakukan secara manual atau tidak terpusat. Oleh karena itu, dibutuhkan sebuah portal khusus staf perpustakaan untuk mengontrol siklus data buku secara real-time.

## B. Solusi Aplikasi
DelLib Staff adalah portal manajemen inventaris buku internal berbasis web bagi staf perpustakaan IT Del. Melalui sistem ini, staf dapat mendata buku baru yang masuk, memperbarui status stok fisik dan lokasi rak, menghapus data buku yang telah ditarik dari peredaran, serta memantau statistik persebaran buku berdasarkan program studi.

## C. Ruang Lingkup Fitur (CRUD penuh oleh staf perpustakaan)
- **Autentikasi staf**: login dengan email staf, berbasis JWT. Akun staf dibuat oleh pengelola sistem (lihat `backend/.env.example`), tidak ada pendaftaran publik.
- **Katalog & inventaris (Read)**: daftar seluruh koleksi, pencarian instan berdasarkan judul, penulis, atau ISBN, filter kategori/program studi (Informatika, Elektro, Manajemen Rekayasa, Bioproses, Umum), dan halaman detail buku (sinopsis, pengarang, penerbit, nomor rak, stok fisik).
- **Pencatatan buku baru (Create)**: form dengan validasi lengkap (judul, ISBN unik, penulis, penerbit, tahun terbit, kategori, nomor rak, jumlah stok, URL sampul, sinopsis). Validasi dijalankan di frontend dan diulang di backend.
- **Pembaruan data (Update)**: ubah detail buku yang sudah ada, misalnya stok, letak rak, atau sinopsis.
- **Penghapusan (Delete)**: hapus buku dari katalog dengan konfirmasi SweetAlert2.
- **Dashboard inventarisasi**: total judul, total eksemplar fisik, judul dengan stok habis, dan grafik sebaran buku per program studi.

## Rute
| Path | Akses | Isi |
|---|---|---|
| `/` | publik | Katalog pencarian buku (tanpa login) |
| `/panduan` | publik | Panduan standar operasional dan tata tertib perpustakaan |
| `/auth/login` | tamu | Login staf |
| `/dashboard` | staf | Statistik inventaris |
| `/buku` | staf | Daftar inventaris + tombol "Tambah Buku" |
| `/buku/:id` | staf | Detail buku dengan tombol "Edit" dan "Hapus" |
| `/profile` | staf | Profil akun staf, ubah data dan kata sandi |

## Menjalankan secara lokal
```bash
# 1) Backend (Node.js 22.5+), http://localhost:5000
cd backend
cp .env.example .env        # isi JWT_SECRET, STAFF_EMAIL, STAFF_PASSWORD
npm run seed                # opsional: 10 buku contoh
npm run dev

# 2) Frontend, http://localhost:3000 (meneruskan /api ke backend)
cd frontend
npm install                 # atau: bun install
npm run dev
```
Login contoh bawaan `.env.example`: `staf@dellib.local` / `staf123` (ganti sebelum deploy).

## Pengujian
```bash
cd backend  && npm test     # node:test
cd frontend && npm test     # vitest + coverage (ambang 90%)
```

## CI/CD
`frontend/Jenkinsfile` dan `frontend/sonar-project.properties` dipakai untuk pipeline (install, test, build, scan Trivy, SonarQube, deploy). `frontend/vercel.json` meneruskan `/api` ke domain backend dan menangani rute Vue Router.
