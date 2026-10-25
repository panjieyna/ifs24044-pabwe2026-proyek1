<template>
  <main class="min-h-screen grid place-items-center p-4 bg-brand">
    <section class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl" aria-label="Autentikasi">
      <h1 class="text-2xl font-extrabold text-brand mb-1">DelLib Staff</h1>
      <p class="mb-6 text-sm text-stone-700">Portal Inventaris Koleksi Buku Perpustakaan IT Del</p>
      <slot />
      <RouterLink to="/" class="mt-6 block text-sm font-semibold text-brand hover:underline">Kembali ke katalog buku</RouterLink>
    </section>
  </main>
</template>
