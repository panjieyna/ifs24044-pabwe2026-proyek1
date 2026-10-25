<script setup>
import { computed } from 'vue'
import { stockStatus } from '../utils.js'

const props = defineProps({ stock: { type: Number, required: true } })
const status = computed(() => stockStatus(props.stock))
const tones = {
  ok: 'bg-emerald-100 text-emerald-900',
  low: 'bg-amber-100 text-amber-900',
  empty: 'bg-red-100 text-red-800',
}
</script>

<template>
  <span :class="['inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold', tones[status.key]]">{{ status.label }} · {{ stock }} eks.</span>
</template>
