import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import ProfilePage from './ProfilePage.vue'
import * as api from '../api/userApi.js'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper.js'

vi.mock('../api/userApi.js')
vi.mock('../../../helpers/toolsHelper.js', async (orig) => ({
  ...(await orig()), showSuccessDialog: vi.fn(), showErrorDialog: vi.fn(),
}))

const me = { success: true, data: { user: { id: 1, name: 'Budi', email: 'budi@dellib.local' } } }

describe('ProfilePage', () => {
  beforeEach(() => { vi.clearAllMocks(); api.getMe.mockResolvedValue(me) })

  it('shows the profile and fills the form', async () => {
    renderWithProviders(ProfilePage)
    expect(await screen.findByDisplayValue('Budi')).toBeInTheDocument()
    expect(screen.getByDisplayValue('budi@dellib.local')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Budi' })).toBeInTheDocument()
  })

  it('still renders when the profile cannot be loaded', async () => {
    api.getMe.mockResolvedValue({ success: false })
    renderWithProviders(ProfilePage)
    await waitFor(() => expect(api.getMe).toHaveBeenCalled())
    expect(screen.queryByRole('heading', { name: 'Budi' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Nama')).toHaveValue('')
  })

  it('saves the profile and reports the result', async () => {
    api.updateMe.mockResolvedValueOnce({ success: true, message: 'Tersimpan' }).mockResolvedValueOnce({ success: false, message: 'Email dipakai' })
    renderWithProviders(ProfilePage)
    await screen.findByDisplayValue('budi@dellib.local') // tunggu profil selesai dimuat ke form
    await fireEvent.update(screen.getByLabelText('Nama'), 'Budi S')
    await fireEvent.click(screen.getByRole('button', { name: 'Simpan profil' }))
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith('Tersimpan'))
    expect(api.updateMe).toHaveBeenCalledWith({ name: 'Budi S', email: 'budi@dellib.local' })
    await fireEvent.click(screen.getByRole('button', { name: 'Simpan profil' }))
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Email dipakai'))
  })

  it('changes the password and clears the fields only on success', async () => {
    api.changePassword.mockResolvedValueOnce({ success: false, message: 'Sandi salah' }).mockResolvedValueOnce({ success: true, message: 'Sandi diubah' })
    renderWithProviders(ProfilePage)
    await fireEvent.update(await screen.findByLabelText('Kata sandi saat ini'), 'lama')
    await fireEvent.update(screen.getByLabelText('Kata sandi baru'), 'baru-baru')
    await fireEvent.update(screen.getByLabelText('Konfirmasi kata sandi baru'), 'baru-baru')
    await fireEvent.click(screen.getByRole('button', { name: 'Ubah kata sandi' }))
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Sandi salah'))
    expect(screen.getByLabelText('Kata sandi baru')).toHaveValue('baru-baru')
    await fireEvent.click(screen.getByRole('button', { name: 'Ubah kata sandi' }))
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith('Sandi diubah'))
    expect(api.changePassword).toHaveBeenLastCalledWith({ password: 'lama', new_password: 'baru-baru', new_password_confirmation: 'baru-baru' })
    expect(screen.getByLabelText('Kata sandi baru')).toHaveValue('')
  })
})
