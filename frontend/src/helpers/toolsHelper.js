import Swal from 'sweetalert2'

export const showSuccessDialog = (msg) => Swal.fire({ icon: 'success', title: 'Berhasil', text: msg })
export const showErrorDialog = (msg) => Swal.fire({ icon: 'error', title: 'Gagal', text: msg })
export const showConfirmDialog = async (msg) => {
  const result = await Swal.fire({
    icon: 'question', title: 'Konfirmasi', text: msg,
    showCancelButton: true, confirmButtonText: 'Ya', cancelButtonText: 'Batal',
  })
  return result.isConfirmed
}

export const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(value)

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
