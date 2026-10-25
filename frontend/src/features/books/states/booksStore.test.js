import { setActivePinia, createPinia } from 'pinia'
import { useBooksStore } from './booksStore.js'
import * as api from '../api/bookApi.js'

vi.mock('../api/bookApi.js')

describe('booksStore', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.resetAllMocks() })

  it('loads the list, ignoring failures', async () => {
    const s = useBooksStore()
    api.getBooks.mockResolvedValueOnce({ success: true, data: { books: [1] } }).mockResolvedValueOnce({ success: false })
    await s.loadBooks(); await s.loadBooks()
    expect(s.books).toEqual([1])
  })

  it('clears the current book before loading and keeps it null on failure', async () => {
    const s = useBooksStore()
    s.book = { id: 9 }
    api.getBook.mockResolvedValueOnce({ success: false })
    await s.loadBook(2)
    expect(s.book).toBeNull()
    api.getBook.mockResolvedValueOnce({ success: true, data: { book: { id: 2 } } })
    await s.loadBook(2)
    expect(s.book).toEqual({ id: 2 })
  })

  it('loads stats', async () => {
    const s = useBooksStore()
    api.getStats.mockResolvedValueOnce({ success: false }).mockResolvedValueOnce({ success: true, data: { stats: { total_titles: 1 } } })
    await s.loadStats()
    expect(s.stats).toBeNull()
    await s.loadStats()
    expect(s.stats).toEqual({ total_titles: 1 })
  })

  it('passes mutations through to the api', async () => {
    const s = useBooksStore()
    api.addBook.mockResolvedValue({ success: true })
    api.changeBook.mockResolvedValue({ success: true })
    api.deleteBook.mockResolvedValue({ success: false })
    expect((await s.addBook({ a: 1 })).success).toBe(true)
    expect((await s.changeBook(1, { a: 2 })).success).toBe(true)
    expect((await s.removeBook(1)).success).toBe(false)
    expect(api.addBook).toHaveBeenCalledWith({ a: 1 })
    expect(api.changeBook).toHaveBeenCalledWith(1, { a: 2 })
    expect(api.deleteBook).toHaveBeenCalledWith(1)
  })
})
