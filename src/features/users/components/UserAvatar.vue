<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'md' },
})
const sizes = { sm: 'h-8 w-8 text-sm', md: 'h-10 w-10 text-base', lg: 'h-24 w-24 text-4xl' }
</script>

<template>
  <span aria-hidden="true" :class="['grid shrink-0 place-items-center rounded-full bg-brand font-bold text-white', sizes[size]]">{{ name.charAt(0).toUpperCase() }}</span>
</template>
