import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import LoginPage from './LoginPage.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import * as api from '../api/authApi.js'
import { showErrorDialog } from '../../../helpers/toolsHelper.js'

vi.mock('../api/authApi.js')
vi.mock('../../../helpers/toolsHelper.js', async (orig) => ({ ...(await orig()), showErrorDialog: vi.fn() }))

async function fillAndSubmit() {
  await fireEvent.update(screen.getByLabelText('Email'), 'staf@dellib.local')
  await fireEvent.update(screen.getByLabelText('Kata sandi'), 'rahasia1')
  await fireEvent.click(screen.getByRole('button', { name: 'Masuk' }))
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('logs in and goes to the dashboard', async () => {
    api.login.mockResolvedValue({ success: true, data: { token: 't' } })
    const { router } = renderWithProviders(LoginPage)
    await fillAndSubmit()
    expect(api.login).toHaveBeenCalledWith({ email: 'staf@dellib.local', password: 'rahasia1' })
    await waitFor(() => expect(router.currentRoute.value.fullPath).toBe('/dashboard'))
  })

  it('shows an error dialog when login fails', async () => {
    api.login.mockResolvedValue({ success: false, message: 'Email atau kata sandi salah' })
    renderWithProviders(LoginPage)
    await fillAndSubmit()
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Email atau kata sandi salah'))
  })

  it('has no public registration link', () => {
    renderWithProviders(LoginPage)
    expect(screen.queryByRole('link', { name: /daftar/i })).not.toBeInTheDocument()
  })
})

describe('AuthLayout', () => {
  it('shows the brand, the slot and a link back to the catalog', () => {
    renderWithProviders(AuthLayout, { slots: { default: '<p>isi form</p>' } })
    expect(screen.getByRole('heading', { name: 'DelLib Staff' })).toBeInTheDocument()
    expect(screen.getByText('isi form')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kembali ke katalog buku' })).toHaveAttribute('href', '/')
  })
})
