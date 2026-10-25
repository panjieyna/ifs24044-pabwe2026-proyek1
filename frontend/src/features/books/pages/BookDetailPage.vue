<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-vue-next'
import { useBooksStore } from '../states/booksStore.js'
import BookCover from '../components/BookCover.vue'
import BookInfo from '../components/BookInfo.vue'
import BookFormModal from '../modals/BookFormModal.vue'
import { showSuccessDialog, showErrorDialog, showConfirmDialog } from '../../../helpers/toolsHelper.js'

const route = useRoute()
const router = useRouter()
const store = useBooksStore()
const showEdit = ref(false)
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  const res = await store.loadBook(route.params.bookId)
  error.value = res.success ? '' : res.message
  loading.value = false
}
watch(() => route.params.bookId, load, { immediate: true })

async function remove() {
  if (!(await showConfirmDialog(`Hapus buku "${store.book.title}" dari katalog?`))) return
  const res = await store.removeBook(store.book.id)
  if (res.success) {
    await showSuccessDialog(res.message)
    router.push('/buku')
  } else showErrorDialog(res.message)
}
</script>

<template>
  <section aria-label="Detail buku" class="space-y-4">
    <RouterLink to="/buku" class="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"><ArrowLeft :size="16" aria-hidden="true" />Kembali ke inventaris</RouterLink>
    <article v-if="store.book" class="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div class="grid gap-6 md:grid-cols-[14rem_1fr]">
        <div class="aspect-3/4 overflow-hidden rounded-xl bg-stone-100"><BookCover :url="store.book.cover_url" :title="store.book.title" /></div>
        <div class="space-y-4">
          <h1 class="text-2xl font-extrabold text-brand">{{ store.book.title }}</h1>
          <BookInfo :book="store.book" />
        </div>
      </div>
      <section aria-label="Sinopsis">
        <h2 class="mb-1 text-lg font-bold">Sinopsis</h2>
        <p class="whitespace-pre-line text-stone-800">{{ store.book.synopsis }}</p>
      </section>
      <div class="flex flex-wrap items-center gap-2">
        <button type="button" aria-label="Edit" class="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand/90" @click="showEdit = true"><Pencil :size="16" aria-hidden="true" />Edit</button>
        <button type="button" aria-label="Hapus" class="inline-flex items-center gap-2 rounded-lg border border-red-800 px-4 py-2 font-semibold text-red-800 transition hover:bg-red-50" @click="remove"><Trash2 :size="16" aria-hidden="true" />Hapus</button>
      </div>
    </article>
    <p v-else-if="loading" role="status" class="text-stone-700">Memuat detail buku...</p>
    <p v-else role="alert" class="rounded-2xl bg-red-50 p-4 font-semibold text-red-800">{{ error }}</p>
    <BookFormModal v-if="showEdit && store.book" :book="store.book" @close="showEdit = false" @saved="load" />
  </section>
</template>
