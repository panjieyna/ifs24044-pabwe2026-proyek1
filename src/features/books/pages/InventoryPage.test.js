import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import InventoryPage from './InventoryPage.vue'
import * as api from '../api/bookApi.js'
import { books } from '../fixtures.js'

vi.mock('../api/bookApi.js')
vi.mock('../../../helpers/toolsHelper.js', async (orig) => ({
  ...(await orig()), showSuccessDialog: vi.fn(), showErrorDialog: vi.fn(),
}))

async function fillAndSave() {
  const values = {
    Judul: 'Buku Baru', ISBN: '9786020318875', Penulis: 'Penulis', Penerbit: 'Penerbit',
    'Tahun terbit': '2020', 'Nomor rak': 'E-09', 'Jumlah stok': '3', Sinopsis: 'Sinopsis buku baru.',
  }
  for (const [label, value] of Object.entries(values)) await fireEvent.update(screen.getByLabelText(label), value)
  await fireEvent.update(screen.getByLabelText('Kategori / Program studi'), 'Umum')
  await fireEvent.click(screen.getByRole('button', { name: 'Simpan buku' }))
}

describe('InventoryPage (staf)', () => {
  beforeEach(() => { vi.clearAllMocks(); api.getBooks.mockResolvedValue({ success: true, data: { books } }) })

  it('lists the inventory with links to the detail pages', async () => {
    renderWithProviders(InventoryPage)
    expect(screen.getByRole('status')).toHaveTextContent('Memuat inventaris')
    const link = await screen.findByRole('link', { name: 'Clean Code' })
    expect(link).toHaveAttribute('href', '/buku/1')
    expect(screen.getByRole('link', { name: 'Electric Circuits' })).toHaveAttribute('href', '/buku/2')
    expect(screen.getByText('B-01')).toBeInTheDocument()
    expect(screen.getByText('Habis · 0 eks.')).toBeInTheDocument()
  })

  it('searches and filters', async () => {
    renderWithProviders(InventoryPage)
    await screen.findByRole('link', { name: 'Clean Code' })
    await fireEvent.update(screen.getByLabelText('Cari buku'), 'electric')
    expect(screen.queryByRole('link', { name: 'Clean Code' })).not.toBeInTheDocument()
    await fireEvent.update(screen.getByLabelText('Cari buku'), 'zzz')
    expect(screen.getByText('Tidak ada buku yang cocok.')).toBeInTheDocument()
  })

  it('shows an error when loading fails', async () => {
    api.getBooks.mockResolvedValue({ success: false, message: 'Token tidak valid' })
    renderWithProviders(InventoryPage)
    expect(await screen.findByRole('alert')).toHaveTextContent('Token tidak valid')
  })

  it('opens the add dialog, can close it, and reloads after saving', async () => {
    api.addBook.mockResolvedValue({ success: true, message: 'Dibuat' })
    renderWithProviders(InventoryPage)
    await screen.findByRole('link', { name: 'Clean Code' })
    await fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))
    expect(screen.getByRole('dialog', { name: 'Tambah buku' })).toBeInTheDocument()
    await fireEvent.click(screen.getByRole('button', { name: 'Tutup' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await fireEvent.click(screen.getByRole('button', { name: 'Tambah Buku' }))
    await fillAndSave()
    await waitFor(() => expect(api.addBook).toHaveBeenCalledWith(expect.objectContaining({ title: 'Buku Baru', year: 2020, stock: 3, category: 'Umum' })))
    await waitFor(() => expect(api.getBooks).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
