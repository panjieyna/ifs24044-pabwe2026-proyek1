<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBooksStore } from '../states/booksStore.js'
import BookCover from '../components/BookCover.vue'
import BookFilter from '../components/BookFilter.vue'
import StockBadge from '../components/StockBadge.vue'
import BookDetailModal from '../modals/BookDetailModal.vue'
import { filterBooks } from '../utils.js'

const store = useBooksStore()
const search = ref('')
const category = ref('Semua')
const selected = ref(null)
const loading = ref(true)
const error = ref('')
const shown = computed(() => filterBooks(store.books, search.value, category.value))

onMounted(async () => {
  const res = await store.loadBooks()
  if (!res.success) error.value = res.message
  loading.value = false
})
</script>

<template>
  <section aria-label="Katalog buku" class="space-y-6">
    <header class="rounded-2xl bg-gradient-to-r from-brand to-brand/80 p-6 text-white shadow-sm">
      <h1 class="text-2xl font-extrabold">Katalog buku perpustakaan</h1>
      <p class="mt-1 text-sm text-white/85">Cek ketersediaan buku dan nomor rak Perpustakaan IT Del tanpa perlu login.</p>
    </header>
    <BookFilter v-model:search="search" v-model:category="category" />
    <p v-if="loading" role="status" class="text-stone-700">Memuat katalog...</p>
    <p v-else-if="error" role="alert" class="rounded-2xl bg-red-50 p-4 font-semibold text-red-800">{{ error }}</p>
    <p v-else-if="shown.length === 0" class="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">Tidak ada buku yang cocok.</p>
    <template v-else>
      <p class="text-sm text-stone-600">Menampilkan {{ shown.length }} judul</p>
      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <li v-for="b in shown" :key="b.id">
          <article class="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
            <div class="aspect-4/3 overflow-hidden bg-stone-100"><BookCover :url="b.cover_url" :title="b.title" /></div>
            <div class="flex flex-1 flex-col gap-2 p-4">
              <p class="text-xs font-bold uppercase tracking-wide text-brand">{{ b.category }}</p>
              <h2 class="line-clamp-2 text-base font-bold leading-snug">{{ b.title }}</h2>
              <p class="text-sm text-stone-700">{{ b.author }}</p>
              <p class="text-xs text-stone-600">ISBN {{ b.isbn }} · Rak {{ b.shelf }}</p>
              <StockBadge :stock="b.stock" class="self-start" />
              <button type="button" :aria-label="`Lihat detail ${b.title}`" class="mt-auto rounded-lg border border-brand px-3 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10" @click="selected = b">Lihat detail</button>
            </div>
          </article>
        </li>
      </ul>
    </template>
    <BookDetailModal v-if="selected" :book="selected" @close="selected = null" />
  </section>
</template>
