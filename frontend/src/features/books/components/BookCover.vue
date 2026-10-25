<script setup>
import { ref, watch } from 'vue'
import { BookOpen } from 'lucide-vue-next'

const props = defineProps({ url: { type: String, default: '' }, title: { type: String, required: true } })
const broken = ref(false)
watch(() => props.url, () => { broken.value = false })
</script>

<template>
  <img v-if="url && !broken" :src="url" :alt="`Sampul ${title}`" loading="lazy" decoding="async" class="h-full w-full object-cover" @error="broken = true" />
  <div v-else role="img" :aria-label="`Sampul ${title} tidak tersedia`" class="grid h-full w-full place-items-center bg-gradient-to-br from-brand/10 to-accent/15 text-brand/40">
    <BookOpen :size="44" :stroke-width="1.5" aria-hidden="true" />
  </div>
</template>
