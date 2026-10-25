<script setup>
import { useAuthStore } from '../../auth/states/authStore.js'

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-30 bg-brand text-white shadow-md">
      <nav class="mx-auto flex max-w-6xl items-center gap-2 p-3" aria-label="Navigasi publik">
        <RouterLink to="/" class="mr-auto flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <img src="/logo.svg" alt="" class="h-8 w-8 rounded-lg" /><span>DelLib Staff</span>
        </RouterLink>
        <RouterLink to="/" class="rounded-lg px-3 py-2 font-semibold transition hover:bg-white/10">Katalog</RouterLink>
        <RouterLink to="/panduan" class="rounded-lg px-3 py-2 font-semibold transition hover:bg-white/10">Panduan</RouterLink>
        <RouterLink v-if="auth.token" to="/dashboard" class="rounded-lg bg-white px-4 py-2 font-bold text-brand transition hover:bg-stone-100">Dashboard staf</RouterLink>
        <RouterLink v-else to="/auth/login" class="rounded-lg bg-white px-4 py-2 font-bold text-brand transition hover:bg-stone-100">Masuk staf</RouterLink>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl p-4 lg:py-8"><slot /></main>
    <footer class="border-t border-stone-300/60 p-6 text-center text-sm text-stone-700">DelLib Staff · Perpustakaan Institut Teknologi Del</footer>
  </div>
</template>
