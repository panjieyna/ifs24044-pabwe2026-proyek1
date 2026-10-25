import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '../api/userApi.js'

export const useUsersStore = defineStore('users', () => {
  const profile = ref(null)

  async function loadProfile() {
    const res = await api.getMe()
    if (res.success) profile.value = res.data.user
    return res
  }
  async function saveProfile(payload) {
    const res = await api.updateMe(payload)
    if (res.success) await loadProfile()
    return res
  }
  const savePassword = (payload) => api.changePassword(payload)

  return { profile, loadProfile, saveProfile, savePassword }
})
