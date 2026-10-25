import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import CatalogPage from './CatalogPage.vue'
import * as api from '../api/bookApi.js'
import { books } from '../fixtures.js'

vi.mock('../api/bookApi.js')

describe('CatalogPage (publik)', () => {
  beforeEach(() => { vi.clearAllMocks(); api.getBooks.mockResolvedValue({ success: true, data: { books } }) })

  it('shows loading, then the catalog with stock information', async () => {
    renderWithProviders(CatalogPage)
    expect(screen.getByRole('status')).toHaveTextContent('Memuat katalog')
    expect(await screen.findByRole('heading', { name: 'Clean Code' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Electric Circuits' })).toBeInTheDocument()
    expect(screen.getByText('Tersedia · 4 eks.')).toBeInTheDocument()
    expect(screen.getByText('Habis · 0 eks.')).toBeInTheDocument()
    expect(screen.getByText('Menampilkan 2 judul')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Sampul Electric Circuits' })).toBeInTheDocument()
  })

  it('searches instantly by title, author or ISBN and filters by category', async () => {
    renderWithProviders(CatalogPage)
    await screen.findByRole('heading', { name: 'Clean Code' })
    await fireEvent.update(screen.getByLabelText('Cari buku'), 'nilsson')
    expect(screen.queryByRole('heading', { name: 'Clean Code' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Electric Circuits' })).toBeInTheDocument()
    await fireEvent.update(screen.getByLabelText('Cari buku'), '978-0-13-235')
    expect(screen.getByRole('heading', { name: 'Clean Code' })).toBeInTheDocument()
    await fireEvent.update(screen.getByLabelText('Cari buku'), '')
    await fireEvent.click(screen.getByRole('button', { name: 'Kategori Elektro' }))
    expect(screen.queryByRole('heading', { name: 'Clean Code' })).not.toBeInTheDocument()
    await fireEvent.click(screen.getByRole('button', { name: 'Kategori Bioproses' }))
    expect(screen.getByText('Tidak ada buku yang cocok.')).toBeInTheDocument()
  })

  it('opens and closes the book detail dialog', async () => {
    renderWithProviders(CatalogPage)
    await fireEvent.click(await screen.findByRole('button', { name: 'Lihat detail Clean Code' }))
    const dialog = screen.getByRole('dialog', { name: 'Clean Code' })
    expect(dialog).toHaveTextContent('Panduan kode bersih.')
    await fireEvent.click(screen.getByRole('button', { name: 'Tutup' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows an error when the catalog cannot be loaded', async () => {
    api.getBooks.mockResolvedValue({ success: false, message: 'Server tidak dapat dihubungi' })
    renderWithProviders(CatalogPage)
    expect(await screen.findByRole('alert')).toHaveTextContent('Server tidak dapat dihubungi')
  })
})
