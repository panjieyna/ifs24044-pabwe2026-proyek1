<script setup>
import { computed, onMounted, ref } from 'vue'
import { Library, BookCopy, PackageX } from 'lucide-vue-next'
import { useBooksStore } from '../../books/states/booksStore.js'
import { useUsersStore } from '../../users/states/usersStore.js'
import StatBarList from '../components/StatBarList.vue'
import { formatNumber } from '../../../helpers/toolsHelper.js'

const store = useBooksStore()
const users = useUsersStore()
const error = ref('')

onMounted(async () => {
  const res = await store.loadStats()
  if (!res.success) error.value = res.message
})

const cards = computed(() => [
  { label: 'Total judul buku', value: store.stats.total_titles, icon: Library },
  { label: 'Total eksemplar fisik', value: store.stats.total_copies, icon: BookCopy },
  { label: 'Judul dengan stok habis', value: store.stats.out_of_stock, icon: PackageX },
])
const titlesByCategory = computed(() => store.stats.by_category.map((c) => ({ label: c.name, value: c.titles })))
const copiesByCategory = computed(() => store.stats.by_category.map((c) => ({ label: c.name, value: c.copies })))
</script>

<template>
  <section aria-label="Dashboard inventaris" class="space-y-6">
    <header class="rounded-2xl bg-gradient-to-r from-brand to-brand/80 p-5 text-white shadow-sm">
      <h1 class="text-2xl font-extrabold">Dashboard inventaris</h1>
      <p class="text-sm text-white/85">Halo{{ users.profile ? `, ${users.profile.name}` : '' }}. Pantau koleksi buku Perpustakaan IT Del secara langsung.</p>
      <RouterLink to="/buku" class="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand transition hover:bg-stone-100">Kelola inventaris</RouterLink>
    </header>
    <p v-if="error" role="alert" class="rounded-2xl bg-red-50 p-4 font-semibold text-red-800">{{ error }}</p>
    <template v-else-if="store.stats">
      <ul aria-label="Statistik" class="grid gap-4 sm:grid-cols-3">
        <li v-for="c in cards" :key="c.label" class="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><component :is="c.icon" :size="24" aria-hidden="true" /></span>
          <div>
            <p class="text-2xl font-extrabold tabular-nums">{{ formatNumber(c.value) }}</p>
            <p class="text-sm text-stone-700">{{ c.label }}</p>
          </div>
        </li>
      </ul>
      <div class="grid gap-6 lg:grid-cols-2">
        <section aria-label="Judul per program studi" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 class="mb-4 text-lg font-bold">Judul buku per program studi</h2>
          <StatBarList :items="titlesByCategory" />
        </section>
        <section aria-label="Eksemplar per program studi" class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 class="mb-4 text-lg font-bold">Eksemplar fisik per program studi</h2>
          <StatBarList :items="copiesByCategory" />
        </section>
      </div>
    </template>
    <p v-else role="status" class="text-stone-700">Memuat statistik...</p>
  </section>
</template>
