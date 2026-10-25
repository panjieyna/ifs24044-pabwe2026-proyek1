import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, logout } from '../api/authApi.js'
import { getAccessToken, putAccessToken, removeAccessToken } from '../../../helpers/apiHelper.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getAccessToken())

  async function loginUser(payload) {
    const res = await login(payload)
    if (res.success) {
      token.value = res.data.token
      putAccessToken(res.data.token)
    }
    return res
  }

  async function logoutUser() {
    try {
      await logout()
    } finally {
      removeAccessToken()
      token.value = null
    }
  }

  return { token, loginUser, logoutUser }
})
