<script setup>
import { reactive, ref } from 'vue'
import ModalShell from './ModalShell.vue'
import { CATEGORIES } from '../categories.js'
import { useBooksStore } from '../states/booksStore.js'
import { bookToForm, emptyBookForm, toPayload, validateBook } from '../utils.js'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper.js'

const props = defineProps({ book: { type: Object, default: null } })
const emit = defineEmits(['close', 'saved'])
const store = useBooksStore()
const form = reactive(props.book ? bookToForm(props.book) : emptyBookForm())
const errors = ref({})
const saving = ref(false)

const fields = [
  { key: 'title', label: 'Judul', type: 'text' },
  { key: 'isbn', label: 'ISBN', type: 'text' },
  { key: 'author', label: 'Penulis', type: 'text' },
  { key: 'publisher', label: 'Penerbit', type: 'text' },
  { key: 'year', label: 'Tahun terbit', type: 'number' },
  { key: 'shelf', label: 'Nomor rak', type: 'text' },
  { key: 'stock', label: 'Jumlah stok', type: 'number' },
  { key: 'cover_url', label: 'URL sampul (opsional)', type: 'text' },
]
const input = 'w-full rounded-lg border border-stone-500 px-3 py-2'

async function submit() {
  errors.value = validateBook(form)
  if (Object.keys(errors.value).length > 0) return
  saving.value = true
  const payload = toPayload(form)
  const res = props.book ? await store.changeBook(props.book.id, payload) : await store.addBook(payload)
  saving.value = false
  if (res.success) {
    showSuccessDialog(res.message)
    emit('close')
    emit('saved')
  } else showErrorDialog(res.message)
}
</script>

<template>
  <ModalShell :title="book ? 'Edit buku' : 'Tambah buku'" @close="emit('close')">
    <form class="space-y-3" novalidate @submit.prevent="submit">
      <div v-for="f in fields" :key="f.key">
        <label :for="`book-${f.key}`" class="block text-sm font-semibold">{{ f.label }}</label>
        <input :id="`book-${f.key}`" v-model="form[f.key]" :type="f.type" :aria-invalid="Boolean(errors[f.key])" :aria-describedby="errors[f.key] ? `book-${f.key}-error` : undefined" :class="input" />
        <p v-if="errors[f.key]" :id="`book-${f.key}-error`" role="alert" class="mt-1 text-sm text-red-800">{{ errors[f.key] }}</p>
      </div>
      <div>
        <label for="book-category" class="block text-sm font-semibold">Kategori / Program studi</label>
        <select id="book-category" v-model="form.category" :aria-invalid="Boolean(errors.category)" :class="input">
          <option value="" disabled>Pilih kategori</option>
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
        <p v-if="errors.category" role="alert" class="mt-1 text-sm text-red-800">{{ errors.category }}</p>
      </div>
      <div>
        <label for="book-synopsis" class="block text-sm font-semibold">Sinopsis</label>
        <textarea id="book-synopsis" v-model="form.synopsis" rows="4" :aria-invalid="Boolean(errors.synopsis)" :class="input" />
        <p v-if="errors.synopsis" role="alert" class="mt-1 text-sm text-red-800">{{ errors.synopsis }}</p>
      </div>
      <button type="submit" :disabled="saving" aria-label="Simpan buku" class="rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-60">Simpan buku</button>
    </form>
  </ModalShell>
</template>
