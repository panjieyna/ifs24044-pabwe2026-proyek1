import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './authStore.js'
import * as api from '../api/authApi.js'

vi.mock('../api/authApi.js')

describe('authStore', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.resetAllMocks() })

  it('starts with the token stored in localStorage', () => {
    localStorage.setItem('accessToken', 'lama')
    expect(useAuthStore().token).toBe('lama')
  })

  it('stores the token after a successful login only', async () => {
    const s = useAuthStore()
    api.login.mockResolvedValueOnce({ success: false, message: 'salah' })
    expect((await s.loginUser({})).success).toBe(false)
    expect(s.token).toBeNull()
    api.login.mockResolvedValueOnce({ success: true, data: { token: 'baru' } })
    await s.loginUser({})
    expect(s.token).toBe('baru')
    expect(localStorage.getItem('accessToken')).toBe('baru')
  })

  it('clears the token on logout, even when the request throws', async () => {
    const s = useAuthStore()
    localStorage.setItem('accessToken', 'x')
    s.token = 'x'
    api.logout.mockRejectedValueOnce(new Error('putus'))
    await expect(s.logoutUser()).rejects.toThrow('putus')
    expect(s.token).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
    api.logout.mockResolvedValueOnce({ success: true })
    await s.logoutUser()
    expect(s.token).toBeNull()
  })
})
