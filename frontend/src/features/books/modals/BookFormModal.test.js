import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import BookFormModal from './BookFormModal.vue'
import * as api from '../api/bookApi.js'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper.js'
import { makeBook } from '../fixtures.js'

vi.mock('../api/bookApi.js')
vi.mock('../../../helpers/toolsHelper.js', async (orig) => ({
  ...(await orig()), showSuccessDialog: vi.fn(), showErrorDialog: vi.fn(),
}))

async function fillAll() {
  const values = {
    Judul: 'Clean Code', ISBN: '978-0-13-235088-4', Penulis: 'Robert C. Martin', Penerbit: 'Prentice Hall',
    'Tahun terbit': '2008', 'Nomor rak': 'A-03', 'Jumlah stok': '4', 'URL sampul (opsional)': 'https://x.id/c.png', Sinopsis: 'Panduan kode bersih.',
  }
  for (const [label, value] of Object.entries(values)) await fireEvent.update(screen.getByLabelText(label), value)
  await fireEvent.update(screen.getByLabelText('Kategori / Program studi'), 'Informatika')
}
const save = () => fireEvent.click(screen.getByRole('button', { name: 'Simpan buku' }))

describe('BookFormModal (tambah)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows validation errors and does not call the API', async () => {
    renderWithProviders(BookFormModal)
    expect(screen.getByRole('dialog', { name: 'Tambah buku' })).toBeInTheDocument()
    await save()
    expect(await screen.findByText('Judul wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('ISBN wajib diisi')).toBeInTheDocument()
    expect(screen.getByText('Pilih kategori buku')).toBeInTheDocument()
    expect(screen.getByText('Sinopsis wajib diisi')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveAttribute('aria-invalid', 'true')
    expect(api.addBook).not.toHaveBeenCalled()
  })

  it('creates a book, then closes and asks the parent to reload', async () => {
    api.addBook.mockResolvedValue({ success: true, message: 'Buku berhasil ditambahkan' })
    const { emitted } = renderWithProviders(BookFormModal)
    await fillAll()
    await save()
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith('Buku berhasil ditambahkan'))
    expect(api.addBook).toHaveBeenCalledWith({
      isbn: '9780132350884', title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', year: 2008,
      category: 'Informatika', shelf: 'A-03', stock: 4, cover_url: 'https://x.id/c.png', synopsis: 'Panduan kode bersih.',
    })
    expect(emitted().close).toHaveLength(1)
    expect(emitted().saved).toHaveLength(1)
  })

  it('shows the server error and stays open', async () => {
    api.addBook.mockResolvedValue({ success: false, message: 'ISBN sudah terdaftar' })
    const { emitted } = renderWithProviders(BookFormModal)
    await fillAll()
    await save()
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('ISBN sudah terdaftar'))
    expect(emitted().close).toBeUndefined()
    expect(screen.getByRole('button', { name: 'Simpan buku' })).toBeEnabled()
  })
})

describe('BookFormModal (edit)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('prefills the form and updates the book', async () => {
    api.changeBook.mockResolvedValue({ success: true, message: 'Buku berhasil diperbarui' })
    const { emitted } = renderWithProviders(BookFormModal, { props: { book: makeBook() } })
    expect(screen.getByRole('dialog', { name: 'Edit buku' })).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toHaveValue('Clean Code')
    expect(screen.getByLabelText('Jumlah stok')).toHaveValue(4)
    expect(screen.getByLabelText('Kategori / Program studi')).toHaveValue('Informatika')
    await fireEvent.update(screen.getByLabelText('Jumlah stok'), '9')
    await save()
    await waitFor(() => expect(api.changeBook).toHaveBeenCalledWith(1, expect.objectContaining({ stock: 9, title: 'Clean Code' })))
    await waitFor(() => expect(emitted().saved).toHaveLength(1))
  })
})
