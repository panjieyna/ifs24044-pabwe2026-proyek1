import { screen, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import DashboardPage from './DashboardPage.vue'
import { useUsersStore } from '../../users/states/usersStore.js'
import * as api from '../../books/api/bookApi.js'

vi.mock('../../books/api/bookApi.js')

const stats = {
  total_titles: 12, total_copies: 1234, out_of_stock: 2,
  by_category: [
    { name: 'Informatika', titles: 6, copies: 800 }, { name: 'Elektro', titles: 3, copies: 300 },
    { name: 'Manajemen Rekayasa', titles: 1, copies: 100 }, { name: 'Bioproses', titles: 0, copies: 0 }, { name: 'Umum', titles: 2, copies: 34 },
  ],
}

describe('DashboardPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the metrics and the per-category charts', async () => {
    api.getStats.mockResolvedValue({ success: true, data: { stats } })
    const { pinia } = renderWithProviders(DashboardPage)
    useUsersStore(pinia).profile = { name: 'Budi' }
    expect(screen.getByRole('status')).toHaveTextContent('Memuat statistik')
    const list = await screen.findByRole('list', { name: 'Statistik' })
    expect(list).toHaveTextContent('12')
    expect(list).toHaveTextContent('1.234')
    expect(list).toHaveTextContent('Total eksemplar fisik')
    expect(list).toHaveTextContent('Judul dengan stok habis')
    expect(screen.getByRole('region', { name: 'Judul per program studi' })).toHaveTextContent('Informatika')
    expect(screen.getByRole('region', { name: 'Eksemplar per program studi' })).toHaveTextContent('800')
    expect(screen.getByText(/Halo, Budi/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kelola inventaris' })).toHaveAttribute('href', '/buku')
  })

  it('shows an error when statistics fail to load', async () => {
    api.getStats.mockResolvedValue({ success: false, message: 'Gagal memuat' })
    renderWithProviders(DashboardPage)
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Gagal memuat'))
    expect(screen.getByText(/Halo\./)).toBeInTheDocument()
  })
})
