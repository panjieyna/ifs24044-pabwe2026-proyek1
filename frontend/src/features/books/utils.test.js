import { normalizeIsbn, filterBooks, stockStatus, emptyBookForm, bookToForm, validateBook, toPayload } from './utils.js'
import { makeBook, books } from './fixtures.js'

const valid = () => ({ ...bookToForm(makeBook()) })

describe('normalizeIsbn', () => {
  it('removes hyphens and spaces and uppercases', () => {
    expect(normalizeIsbn(' 0-8044-2957-x ')).toBe('080442957X')
    expect(normalizeIsbn(undefined)).toBe('')
  })
})

describe('filterBooks', () => {
  it('returns everything without search or category', () => {
    expect(filterBooks(books)).toHaveLength(2)
    expect(filterBooks(books, '   ', 'Semua')).toHaveLength(2)
  })
  it('searches title, author and ISBN (with hyphens)', () => {
    expect(filterBooks(books, 'CLEAN').map((b) => b.id)).toEqual([1])
    expect(filterBooks(books, 'nilsson').map((b) => b.id)).toEqual([2])
    expect(filterBooks(books, '978-0-13-392').map((b) => b.id)).toEqual([2])
    expect(filterBooks(books, '-')).toEqual([])
    expect(filterBooks(books, 'tidak ada')).toEqual([])
  })
  it('filters by category', () => {
    expect(filterBooks(books, '', 'Elektro').map((b) => b.id)).toEqual([2])
    expect(filterBooks(books, 'clean', 'Elektro')).toEqual([])
  })
})

describe('stockStatus', () => {
  it('classifies stock levels', () => {
    expect(stockStatus(0).key).toBe('empty')
    expect(stockStatus(1).key).toBe('low')
    expect(stockStatus(2).key).toBe('low')
    expect(stockStatus(3)).toEqual({ key: 'ok', label: 'Tersedia' })
  })
})

describe('form helpers', () => {
  it('creates an empty form and converts a book to form values', () => {
    expect(emptyBookForm().title).toBe('')
    expect(bookToForm(makeBook())).toMatchObject({ year: '2008', stock: '4', title: 'Clean Code' })
  })

  it('accepts valid data', () => {
    expect(validateBook(valid(), 2027)).toEqual({})
    expect(validateBook({ ...valid(), isbn: '0-8044-2957-X', cover_url: 'https://x.id/c.png', stock: '0' }, 2027)).toEqual({})
  })

  it('reports every invalid field', () => {
    const errors = validateBook(emptyBookForm(), 2027)
    expect(Object.keys(errors).sort()).toEqual(['author', 'category', 'isbn', 'publisher', 'shelf', 'stock', 'synopsis', 'title', 'year'])
    expect(errors.title).toBe('Judul wajib diisi')
    expect(errors.isbn).toBe('ISBN wajib diisi')
    expect(errors.category).toBe('Pilih kategori buku')
  })

  it('checks lengths, numbers, ISBN and cover URL', () => {
    const errors = validateBook({
      ...valid(), isbn: '123', title: 'x'.repeat(201), year: '1800', stock: '-1', cover_url: 'ftp://x',
    }, 2027)
    expect(errors).toEqual({
      isbn: 'ISBN harus berupa 10 atau 13 digit',
      title: 'Judul maksimal 200 karakter',
      year: 'Tahun terbit harus berupa bilangan bulat antara 1900 dan 2027',
      stock: 'Jumlah stok harus berupa bilangan bulat antara 0 dan 100000',
      cover_url: 'URL sampul harus diawali http:// atau https://',
    })
    expect(validateBook({ ...valid(), year: '20.5' }, 2027).year).toBeDefined()
    expect(validateBook({ ...valid(), cover_url: `https://x.id/${'a'.repeat(500)}` }, 2027).cover_url).toBe('URL sampul maksimal 500 karakter')
  })

  it('defaults the max year to next year', () => {
    expect(validateBook({ ...valid(), year: String(new Date().getFullYear() + 1) })).toEqual({})
    expect(validateBook({ ...valid(), year: String(new Date().getFullYear() + 2) }).year).toBeDefined()
  })

  it('builds the API payload with trimmed text and numeric fields', () => {
    expect(toPayload({ ...valid(), isbn: '978-0-13-235088-4', title: '  Clean Code ', year: '2008', stock: '4' })).toEqual({
      isbn: '9780132350884', title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', year: 2008,
      category: 'Informatika', shelf: 'A-03', stock: 4, cover_url: '', synopsis: 'Panduan kode bersih.',
    })
  })
})
