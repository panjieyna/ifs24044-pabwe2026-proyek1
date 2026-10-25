<script setup>
import { computed } from 'vue'
import StockBadge from './StockBadge.vue'
import { formatDate } from '../../../helpers/toolsHelper.js'

const props = defineProps({ book: { type: Object, required: true } })
const rows = computed(() => [
  { label: 'ISBN', value: props.book.isbn },
  { label: 'Penulis', value: props.book.author },
  { label: 'Penerbit', value: props.book.publisher },
  { label: 'Tahun terbit', value: String(props.book.year) },
  { label: 'Program studi', value: props.book.category },
  { label: 'Nomor rak', value: props.book.shelf },
  { label: 'Terakhir diperbarui', value: formatDate(props.book.updated_at) },
])
</script>

<template>
  <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
    <template v-for="r in rows" :key="r.label">
      <dt class="font-semibold text-stone-600">{{ r.label }}</dt>
      <dd>{{ r.value }}</dd>
    </template>
    <dt class="font-semibold text-stone-600">Stok fisik</dt>
    <dd><StockBadge :stock="book.stock" /></dd>
  </dl>
</template>
