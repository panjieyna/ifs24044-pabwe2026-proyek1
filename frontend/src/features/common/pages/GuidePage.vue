<script setup>
const rules = [
  'Jaga ketenangan di ruang baca agar semua pengunjung dapat belajar dengan nyaman.',
  'Perlakukan koleksi dengan hati-hati: jangan mencoret, melipat, atau merobek halaman buku.',
  'Gunakan katalog di halaman ini untuk memeriksa judul, nomor rak, dan ketersediaan stok sebelum mencari buku.',
  'Kembalikan buku ke meja pengembalian setelah dibaca; jangan menaruhnya sembarangan di rak.',
  'Laporkan buku yang rusak, hilang, atau salah letak kepada staf perpustakaan.',
  'Ikuti arahan staf perpustakaan selama berada di area perpustakaan.',
]
const procedures = [
  { title: 'Mencatat buku baru', steps: ['Masuk ke portal staf lalu buka menu Inventaris Buku.', 'Klik "Tambah Buku" dan isi semua kolom: judul, ISBN, penulis, penerbit, tahun terbit, program studi, nomor rak, jumlah stok, URL sampul (opsional), dan sinopsis.', 'Pastikan ISBN belum pernah tercatat; sistem menolak ISBN ganda.', 'Simpan, lalu tempelkan label rak sesuai nomor rak yang dicatat.'] },
  { title: 'Memperbarui stok dan lokasi rak', steps: ['Cari buku lewat judul, penulis, atau ISBN, lalu buka halaman detailnya.', 'Klik "Edit" dan ubah jumlah stok atau nomor rak sesuai kondisi fisik.', 'Perbarui juga sinopsis atau data lain bila ada yang perlu dikoreksi.'] },
  { title: 'Menghapus buku dari koleksi', steps: ['Gunakan hanya untuk buku yang rusak parah, hilang, atau ditarik dari peredaran.', 'Buka halaman detail buku, klik "Hapus", lalu konfirmasi pada kotak dialog.', 'Penghapusan bersifat permanen, jadi pastikan buku yang dipilih sudah benar.'] },
]
</script>

<template>
  <section aria-label="Panduan" class="mx-auto max-w-4xl space-y-8">
    <header class="rounded-2xl bg-gradient-to-r from-brand to-brand/80 p-6 text-white shadow-sm">
      <h1 class="text-2xl font-extrabold">Panduan Perpustakaan</h1>
      <p class="mt-1 text-sm text-white/85">Standar operasional dan tata tertib Perpustakaan Institut Teknologi Del.</p>
    </header>
    <section aria-label="Tata tertib" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 class="mb-4 text-xl font-extrabold text-brand">Tata tertib pengunjung</h2>
      <ol class="list-decimal space-y-2 pl-5">
        <li v-for="rule in rules" :key="rule">{{ rule }}</li>
      </ol>
    </section>
    <section aria-label="Standar operasional" class="space-y-4">
      <h2 class="text-xl font-extrabold text-brand">Standar operasional inventaris (staf)</h2>
      <article v-for="p in procedures" :key="p.title" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h3 class="mb-3 text-lg font-bold">{{ p.title }}</h3>
        <ol class="list-decimal space-y-1.5 pl-5">
          <li v-for="step in p.steps" :key="step">{{ step }}</li>
        </ol>
      </article>
    </section>
  </section>
</template>
