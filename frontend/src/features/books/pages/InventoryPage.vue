<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useBooksStore } from '../states/booksStore.js'
import BookFilter from '../components/BookFilter.vue'
import StockBadge from '../components/StockBadge.vue'
import BookFormModal from '../modals/BookFormModal.vue'
import { filterBooks } from '../utils.js'

const store = useBooksStore()
const search = ref('')
const category = ref('Semua')
const showAdd = ref(false)
const loading = ref(true)
const error = ref('')
const shown = computed(() => filterBooks(store.books, search.value, category.value))

async function load() {
  const res = await store.loadBooks()
  error.value = res.success ? '' : res.message
  loading.value = false
}
onMounted(load)
</script>

<template>
  <section aria-label="Inventaris buku" class="space-y-6">
    <header class="flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-brand to-brand/80 p-5 text-white shadow-sm">
      <div class="mr-auto">
        <h1 class="text-2xl font-extrabold">Inventaris buku</h1>
        <p class="text-sm text-white/85">Kelola seluruh koleksi buku perpustakaan.</p>
      </div>
      <button type="button" aria-label="Tambah Buku" class="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-bold text-brand shadow-sm transition hover:bg-stone-100" @click="showAdd = true">
        <Plus :size="18" aria-hidden="true" />Tambah Buku
      </button>
    </header>
    <BookFilter v-model:search="search" v-model:category="category" />
    <p v-if="loading" role="status" class="text-stone-700">Memuat inventaris...</p>
    <p v-else-if="error" role="alert" class="rounded-2xl bg-red-50 p-4 font-semibold text-red-800">{{ error }}</p>
    <p v-else-if="shown.length === 0" class="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">Tidak ada buku yang cocok.</p>
    <div v-else class="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
      <table class="w-full min-w-[46rem] text-left text-sm">
        <thead class="bg-stone-50 text-stone-700">
          <tr><th class="p-3">Judul</th><th class="p-3">ISBN</th><th class="p-3">Program studi</th><th class="p-3">Rak</th><th class="p-3">Stok</th></tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="b in shown" :key="b.id">
            <td class="p-3">
              <RouterLink :to="`/buku/${b.id}`" class="block font-bold text-brand hover:underline">{{ b.title }}</RouterLink>
              <p class="text-xs text-stone-600">{{ b.author }}</p>
            </td>
            <td class="p-3 whitespace-nowrap">{{ b.isbn }}</td>
            <td class="p-3">{{ b.category }}</td>
            <td class="p-3">{{ b.shelf }}</td>
            <td class="p-3"><StockBadge :stock="b.stock" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <BookFormModal v-if="showAdd" @close="showAdd = false" @saved="load" />
  </section>
</template>
