import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import PublicLayout from './PublicLayout.vue'
import StaffLayout from './StaffLayout.vue'
import * as authApi from '../../auth/api/authApi.js'
import * as userApi from '../../users/api/userApi.js'

vi.mock('../../auth/api/authApi.js')
vi.mock('../../users/api/userApi.js')

describe('PublicLayout', () => {
  it('offers the staff login to guests', () => {
    renderWithProviders(PublicLayout, { slots: { default: '<p>konten</p>' } })
    expect(screen.getByText('konten')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Katalog' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Panduan' })).toHaveAttribute('href', '/panduan')
    expect(screen.getByRole('link', { name: 'Masuk staf' })).toHaveAttribute('href', '/auth/login')
    expect(screen.queryByRole('link', { name: 'Dashboard staf' })).not.toBeInTheDocument()
  })

  it('links logged-in staff to the dashboard', () => {
    localStorage.setItem('accessToken', 't')
    renderWithProviders(PublicLayout)
    expect(screen.getByRole('link', { name: 'Dashboard staf' })).toHaveAttribute('href', '/dashboard')
    expect(screen.queryByRole('link', { name: 'Masuk staf' })).not.toBeInTheDocument()
  })
})

describe('StaffLayout', () => {
  beforeEach(() => { vi.clearAllMocks(); localStorage.setItem('accessToken', 't') })

  it('shows the profile, the menu and logs out', async () => {
    authApi.logout.mockResolvedValue({ success: true })
    userApi.getMe.mockResolvedValue({ success: true, data: { user: { id: 1, name: 'Sari', email: 's@x.id' } } })
    const { router } = renderWithProviders(StaffLayout, { slots: { default: '<p>isi halaman</p>' } })
    const push = vi.spyOn(router, 'push')
    expect(await screen.findByRole('link', { name: 'Sari' })).toHaveAttribute('href', '/profile')
    expect(screen.getByText('isi halaman')).toBeInTheDocument()
    for (const [name, href] of [['Dashboard', '/dashboard'], ['Inventaris Buku', '/buku'], ['Panduan', '/panduan'], ['Profil', '/profile']]) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
    await fireEvent.click(screen.getByRole('button', { name: 'Keluar' }))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/auth/login'))
    expect(localStorage.getItem('accessToken')).toBeNull()
  })

  it('logs out automatically when the token is rejected', async () => {
    authApi.logout.mockResolvedValue({ success: false })
    userApi.getMe.mockResolvedValue({ success: false, code: 401, message: 'Token tidak valid atau sudah kedaluwarsa' })
    const { router } = renderWithProviders(StaffLayout)
    const push = vi.spyOn(router, 'push')
    await waitFor(() => expect(push).toHaveBeenCalledWith('/auth/login'))
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(screen.queryByRole('link', { name: 'Sari' })).not.toBeInTheDocument()
  })

  it('stays logged in when the profile fails for another reason', async () => {
    userApi.getMe.mockResolvedValue({ success: false, code: 500 })
    renderWithProviders(StaffLayout)
    await waitFor(() => expect(userApi.getMe).toHaveBeenCalled())
    expect(authApi.logout).not.toHaveBeenCalled()
    expect(localStorage.getItem('accessToken')).toBe('t')
  })
})
