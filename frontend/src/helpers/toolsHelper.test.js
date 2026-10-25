import Swal from 'sweetalert2'
import { showSuccessDialog, showErrorDialog, showConfirmDialog, formatNumber, formatDate } from './toolsHelper.js'

vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }))

describe('toolsHelper', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows success and error dialogs', () => {
    showSuccessDialog('ok')
    expect(Swal.fire).toHaveBeenLastCalledWith({ icon: 'success', title: 'Berhasil', text: 'ok' })
    showErrorDialog('gagal')
    expect(Swal.fire).toHaveBeenLastCalledWith({ icon: 'error', title: 'Gagal', text: 'gagal' })
  })

  it('returns whether the confirm dialog was accepted', async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true }).mockResolvedValueOnce({ isConfirmed: false })
    expect(await showConfirmDialog('Hapus?')).toBe(true)
    expect(await showConfirmDialog('Hapus?')).toBe(false)
    expect(Swal.fire.mock.calls[0][0]).toMatchObject({ icon: 'question', text: 'Hapus?', showCancelButton: true })
  })

  it('formats numbers with Indonesian separators', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
  })

  it('formats an ISO date in Indonesian', () => {
    expect(formatDate('2026-03-15T12:00:00.000Z')).toBe('15 Maret 2026')
  })
})
