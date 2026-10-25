<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from './features/auth/layouts/AuthLayout.vue'
import PublicLayout from './features/common/layouts/PublicLayout.vue'
import StaffLayout from './features/common/layouts/StaffLayout.vue'

const layouts = { public: PublicLayout, staff: StaffLayout, auth: AuthLayout }
const route = useRoute()
const layout = computed(() => layouts[route.meta.layout] ?? PublicLayout)
</script>

<template>
  <component :is="layout"><RouterView /></component>
</template>
