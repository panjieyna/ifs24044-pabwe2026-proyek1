import { CATEGORIES } from './categories.js'

export const LOW_STOCK = 2
const ISBN_PATTERN = /^(\d{9}[\dX]|\d{13})$/
const URL_PATTERN = /^https?:\/\/\S+$/i

/** ISBN disimpan tanpa tanda hubung/spasi dan berhuruf kapital. */
export const normalizeIsbn = (value) => String(value ?? '').replace(/[\s-]/g, '').toUpperCase()

/** Pencarian instan (judul, penulis, ISBN) dan filter kategori di sisi klien. */
export function filterBooks(books, search = '', category = 'Semua') {
  const query = search.trim().toLowerCase()
  const isbn = normalizeIsbn(search)
  return books.filter((b) => {
    if (category !== 'Semua' && b.category !== category) return false
    if (!query) return true
    return b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query) || (isbn !== '' && b.isbn.includes(isbn))
  })
}

export function stockStatus(stock) {
  if (stock === 0) return { key: 'empty', label: 'Habis' }
  if (stock <= LOW_STOCK) return { key: 'low', label: 'Menipis' }
  return { key: 'ok', label: 'Tersedia' }
}

export const emptyBookForm = () => ({
  isbn: '', title: '', author: '', publisher: '', year: '', category: '', shelf: '', stock: '', cover_url: '', synopsis: '',
})

export const bookToForm = (book) => ({
  isbn: book.isbn, title: book.title, author: book.author, publisher: book.publisher, year: String(book.year),
  category: book.category, shelf: book.shelf, stock: String(book.stock), cover_url: book.cover_url, synopsis: book.synopsis,
})

const trimmed = (value) => String(value ?? '').trim()

/** Validasi form buku; mengembalikan objek { namaField: pesan } (kosong jika valid). */
export function validateBook(form, maxYear = new Date().getFullYear() + 1) {
  const errors = {}
  const required = (key, label, max) => {
    const value = trimmed(form[key])
    if (!value) errors[key] = `${label} wajib diisi`
    else if (value.length > max) errors[key] = `${label} maksimal ${max} karakter`
  }
  const whole = (key, label, min, max) => {
    const raw = trimmed(form[key])
    const n = Number(raw)
    if (raw === '' || !Number.isInteger(n) || n < min || n > max) errors[key] = `${label} harus berupa bilangan bulat antara ${min} dan ${max}`
  }

  const isbn = normalizeIsbn(form.isbn)
  if (!isbn) errors.isbn = 'ISBN wajib diisi'
  else if (!ISBN_PATTERN.test(isbn)) errors.isbn = 'ISBN harus berupa 10 atau 13 digit'
  required('title', 'Judul', 200)
  required('author', 'Penulis', 150)
  required('publisher', 'Penerbit', 150)
  required('shelf', 'Nomor rak', 30)
  required('synopsis', 'Sinopsis', 5000)
  whole('year', 'Tahun terbit', 1900, maxYear)
  whole('stock', 'Jumlah stok', 0, 100000)
  if (!CATEGORIES.includes(form.category)) errors.category = 'Pilih kategori buku'
  const cover = trimmed(form.cover_url)
  if (cover.length > 500) errors.cover_url = 'URL sampul maksimal 500 karakter'
  else if (cover && !URL_PATTERN.test(cover)) errors.cover_url = 'URL sampul harus diawali http:// atau https://'
  return errors
}

export const toPayload = (form) => ({
  isbn: normalizeIsbn(form.isbn),
  title: trimmed(form.title),
  author: trimmed(form.author),
  publisher: trimmed(form.publisher),
  year: Number(form.year),
  category: form.category,
  shelf: trimmed(form.shelf),
  stock: Number(form.stock),
  cover_url: trimmed(form.cover_url),
  synopsis: trimmed(form.synopsis),
})
