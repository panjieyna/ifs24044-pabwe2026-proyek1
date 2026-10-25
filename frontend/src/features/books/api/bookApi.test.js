import * as api from './bookApi.js'

describe('bookApi', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 200, json: async () => ({ status: 'success' }) })))
  afterEach(() => vi.unstubAllGlobals())
  const last = () => fetch.mock.calls.at(-1)

  it('reads books, one book and stats', async () => {
    await api.getBooks()
    expect(last()[0]).toBe('/api/v1/books')
    await api.getBook(3)
    expect(last()[0]).toBe('/api/v1/books/3')
    await api.getStats()
    expect(last()[0]).toBe('/api/v1/stats')
  })

  it('creates, updates and deletes books', async () => {
    await api.addBook({ title: 'A' })
    expect([last()[0], last()[1].method, last()[1].body]).toEqual(['/api/v1/books', 'POST', '{"title":"A"}'])
    await api.changeBook(3, { title: 'B' })
    expect([last()[0], last()[1].method, last()[1].body]).toEqual(['/api/v1/books/3', 'PUT', '{"title":"B"}'])
    await api.deleteBook(3)
    expect([last()[0], last()[1].method]).toEqual(['/api/v1/books/3', 'DELETE'])
  })
})
