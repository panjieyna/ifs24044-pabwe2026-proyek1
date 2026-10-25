import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import BookDetailPage from './BookDetailPage.vue'
import * as api from '../api/bookApi.js'
import { showSuccessDialog, showErrorDialog, showConfirmDialog } from '../../../helpers/toolsHelper.js'
import { makeBook } from '../fixtures.js'

vi.mock('../api/bookApi.js')
vi.mock('../../../helpers/toolsHelper.js', async (orig) => ({
  ...(await orig()), showSuccessDialog: vi.fn(), showErrorDialog: vi.fn(), showConfirmDialog: vi.fn(),
}))

async function mount() {
  const utils = renderWithProviders(BookDetailPage, { route: '/buku/1' })
  await screen.findByRole('heading', { name: 'Clean Code' })
  await waitFor(() => expect(api.getBook).toHaveBeenCalledWith('1'))
  return utils
}
const click = (name) => fireEvent.click(screen.getByRole('button', { name }))

describe('BookDetailPage', () => {
  beforeEach(() => { vi.clearAllMocks(); api.getBook.mockResolvedValue({ success: true, data: { book: makeBook() } }) })

  it('shows details, synopsis, stock and the Edit and Hapus actions', async () => {
    await mount()
    expect(screen.getByText('9780132350884')).toBeInTheDocument()
    expect(screen.getByText('Tersedia · 4 eks.')).toBeInTheDocument()
    expect(screen.getByText('Panduan kode bersih.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hapus' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kembali ke inventaris' })).toHaveAttribute('href', '/buku')
  })

  it('edits the book and reloads the details', async () => {
    api.changeBook.mockResolvedValue({ success: true, message: 'Diperbarui' })
    await mount()
    const loadsBefore = api.getBook.mock.calls.length
    await click('Edit')
    expect(screen.getByRole('dialog', { name: 'Edit buku' })).toBeInTheDocument()
    await fireEvent.update(screen.getByLabelText('Nomor rak'), 'B-07')
    await click('Simpan buku')
    await waitFor(() => expect(api.changeBook).toHaveBeenCalledWith(1, expect.objectContaining({ shelf: 'B-07' })))
    await waitFor(() => expect(api.getBook.mock.calls.length).toBeGreaterThan(loadsBefore))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('does not delete when the confirmation is declined', async () => {
    showConfirmDialog.mockResolvedValue(false)
    await mount()
    await click('Hapus')
    expect(showConfirmDialog).toHaveBeenCalledWith('Hapus buku "Clean Code" dari katalog?')
    expect(api.deleteBook).not.toHaveBeenCalled()
  })

  it('deletes after confirmation and returns to the inventory', async () => {
    showConfirmDialog.mockResolvedValue(true)
    api.deleteBook.mockResolvedValue({ success: true, message: 'Dihapus' })
    const { router } = await mount()
    await click('Hapus')
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith('Dihapus'))
    expect(api.deleteBook).toHaveBeenCalledWith(1)
    await waitFor(() => expect(router.currentRoute.value.fullPath).toBe('/buku'))
  })

  it('shows an error dialog when deleting fails', async () => {
    showConfirmDialog.mockResolvedValue(true)
    api.deleteBook.mockResolvedValue({ success: false, message: 'Gagal hapus' })
    await mount()
    await click('Hapus')
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Gagal hapus'))
  })

  it('shows loading and then an error when the book does not exist', async () => {
    api.getBook.mockResolvedValue({ success: false, message: 'Buku tidak ditemukan' })
    renderWithProviders(BookDetailPage, { route: '/buku/99' })
    expect(await screen.findByRole('alert')).toHaveTextContent('Buku tidak ditemukan')
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('shows a loading state before the response arrives', async () => {
    api.getBook.mockReturnValue(new Promise(() => {}))
    renderWithProviders(BookDetailPage, { route: '/buku/1' })
    expect(screen.getByRole('status')).toHaveTextContent('Memuat detail buku')
  })
})
