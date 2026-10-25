import { setActivePinia, createPinia } from 'pinia'
import { useUsersStore } from './usersStore.js'
import * as api from '../api/userApi.js'

vi.mock('../api/userApi.js')

describe('usersStore', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.resetAllMocks() })

  it('loads the profile and ignores failures', async () => {
    const s = useUsersStore()
    api.getMe.mockResolvedValueOnce({ success: false }).mockResolvedValueOnce({ success: true, data: { user: { id: 1 } } })
    await s.loadProfile()
    expect(s.profile).toBeNull()
    await s.loadProfile()
    expect(s.profile).toEqual({ id: 1 })
  })

  it('reloads the profile after a successful save only', async () => {
    const s = useUsersStore()
    api.getMe.mockResolvedValue({ success: true, data: { user: { id: 1, name: 'Baru' } } })
    api.updateMe.mockResolvedValueOnce({ success: false }).mockResolvedValueOnce({ success: true })
    await s.saveProfile({})
    expect(api.getMe).not.toHaveBeenCalled()
    await s.saveProfile({})
    expect(s.profile.name).toBe('Baru')
  })

  it('passes the password change through', async () => {
    api.changePassword.mockResolvedValue({ success: true })
    expect(await useUsersStore().savePassword({ a: 1 })).toEqual({ success: true })
    expect(api.changePassword).toHaveBeenCalledWith({ a: 1 })
  })
})
