export const makeBook = (extra = {}) => ({
  id: 1, isbn: '9780132350884', title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', year: 2008,
  category: 'Informatika', shelf: 'A-03', stock: 4, cover_url: '', synopsis: 'Panduan kode bersih.',
  created_at: '2026-03-10T08:00:00.000Z', updated_at: '2026-03-15T12:00:00.000Z', ...extra,
})

export const books = [
  makeBook(),
  makeBook({ id: 2, isbn: '9780133923605', title: 'Electric Circuits', author: 'James Nilsson', category: 'Elektro', shelf: 'B-01', stock: 0, cover_url: 'http://x/c.png' }),
]
