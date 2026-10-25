<script setup>
import { LayoutDashboard, Library, ScrollText, UserRound } from 'lucide-vue-next'
</script>

<template>
  <aside class="md:sticky md:top-20 md:w-52 md:shrink-0 md:self-start">
    <nav aria-label="Menu samping" class="flex gap-2 overflow-x-auto md:flex-col md:rounded-2xl md:bg-white md:p-2 md:shadow-sm md:ring-1 md:ring-stone-200">
      <RouterLink to="/dashboard" class="nav-link"><LayoutDashboard :size="18" aria-hidden="true" />Dashboard</RouterLink>
      <RouterLink to="/buku" class="nav-link"><Library :size="18" aria-hidden="true" />Inventaris Buku</RouterLink>
      <RouterLink to="/panduan" class="nav-link"><ScrollText :size="18" aria-hidden="true" />Panduan</RouterLink>
      <RouterLink to="/profile" class="nav-link"><UserRound :size="18" aria-hidden="true" />Profil</RouterLink>
    </nav>
  </aside>
</template>
