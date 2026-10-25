<script setup>
import { computed } from 'vue'
import { formatNumber } from '../../../helpers/toolsHelper.js'

const props = defineProps({ items: { type: Array, required: true } })
const widest = computed(() => Math.max(1, ...props.items.map((i) => i.value)))
</script>

<template>
  <ul class="space-y-3">
    <li v-for="item in items" :key="item.label" class="flex items-center gap-3 text-sm">
      <span class="w-36 shrink-0 font-semibold">{{ item.label }}</span>
      <span class="h-3 flex-1 overflow-hidden rounded-full bg-stone-100">
        <span class="block h-full rounded-full bg-accent" :style="{ width: `${(item.value / widest) * 100}%` }"></span>
      </span>
      <span class="w-12 text-right tabular-nums">{{ formatNumber(item.value) }}</span>
    </li>
  </ul>
</template>
