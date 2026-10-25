<script setup>
import ModalShell from './ModalShell.vue'
import BookCover from '../components/BookCover.vue'
import BookInfo from '../components/BookInfo.vue'

defineProps({ book: { type: Object, required: true } })
const emit = defineEmits(['close'])
</script>

<template>
  <ModalShell :title="book.title" @close="emit('close')">
    <div class="space-y-4">
      <div class="aspect-4/3 overflow-hidden rounded-xl bg-stone-100"><BookCover :url="book.cover_url" :title="book.title" /></div>
      <BookInfo :book="book" />
      <section aria-label="Sinopsis">
        <h3 class="mb-1 font-bold">Sinopsis</h3>
        <p class="whitespace-pre-line text-sm text-stone-800">{{ book.synopsis }}</p>
      </section>
    </div>
  </ModalShell>
</template>
