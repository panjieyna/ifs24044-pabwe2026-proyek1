<script setup>
import { Search } from 'lucide-vue-next'
import { CATEGORIES } from '../categories.js'

defineProps({ search: { type: String, default: '' }, category: { type: String, default: 'Semua' } })
const emit = defineEmits(['update:search', 'update:category'])
const options = ['Semua', ...CATEGORIES]
</script>

<template>
  <div class="space-y-3">
    <div class="relative">
      <Search :size="18" aria-hidden="true" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
      <input :value="search" type="search" aria-label="Cari buku" placeholder="Cari judul, penulis, atau ISBN"
        class="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-3 transition focus:border-brand focus:outline-2 focus:outline-brand/30"
        @input="emit('update:search', $event.target.value)" />
    </div>
    <div role="group" aria-label="Program studi" class="flex gap-2 overflow-x-auto pb-1">
      <button v-for="c in options" :key="c" type="button" :aria-pressed="category === c" :aria-label="`Kategori ${c}`"
        class="shrink-0 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-sm font-semibold text-stone-700 transition hover:border-brand hover:text-brand aria-pressed:border-brand aria-pressed:bg-brand aria-pressed:text-white"
        @click="emit('update:category', c)">{{ c }}</button>
    </div>
  </div>
</template>
