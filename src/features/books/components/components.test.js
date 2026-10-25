import { render, screen, fireEvent } from '@testing-library/vue'
import BookCover from './BookCover.vue'
import StockBadge from './StockBadge.vue'
import BookFilter from './BookFilter.vue'
import BookInfo from './BookInfo.vue'
import { makeBook } from '../fixtures.js'

describe('BookCover', () => {
  it('shows the image and falls back to a placeholder when it fails', async () => {
    const { rerender } = render(BookCover, { props: { url: 'http://x/a.png', title: 'Clean Code' } })
    const img = screen.getByRole('img', { name: 'Sampul Clean Code' })
    expect(img).toHaveAttribute('src', 'http://x/a.png')
    await fireEvent.error(img)
    expect(screen.getByRole('img', { name: 'Sampul Clean Code tidak tersedia' })).toBeInTheDocument()
    await rerender({ url: 'http://x/b.png', title: 'Clean Code' })
    expect(screen.getByRole('img', { name: 'Sampul Clean Code' })).toHaveAttribute('src', 'http://x/b.png')
  })

  it('shows a placeholder without a url', () => {
    render(BookCover, { props: { title: 'Tanpa Sampul' } })
    expect(screen.getByRole('img', { name: 'Sampul Tanpa Sampul tidak tersedia' })).toBeInTheDocument()
  })
})

describe('StockBadge', () => {
  it.each([[0, 'Habis · 0 eks.'], [2, 'Menipis · 2 eks.'], [9, 'Tersedia · 9 eks.']])('labels stock %i', (stock, text) => {
    render(StockBadge, { props: { stock } })
    expect(screen.getByText(text)).toBeInTheDocument()
  })
})

describe('BookFilter', () => {
  it('emits search and category changes and marks the active category', async () => {
    const { emitted } = render(BookFilter, { props: { search: '', category: 'Semua' } })
    expect(screen.getByRole('button', { name: 'Kategori Semua' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Kategori Elektro' })).toHaveAttribute('aria-pressed', 'false')
    for (const name of ['Informatika', 'Elektro', 'Manajemen Rekayasa', 'Bioproses', 'Umum']) {
      expect(screen.getByRole('button', { name: `Kategori ${name}` })).toBeInTheDocument()
    }
    await fireEvent.update(screen.getByLabelText('Cari buku'), 'clean')
    expect(emitted()['update:search'][0]).toEqual(['clean'])
    await fireEvent.click(screen.getByRole('button', { name: 'Kategori Elektro' }))
    expect(emitted()['update:category'][0]).toEqual(['Elektro'])
  })
})

describe('BookInfo', () => {
  it('lists the book details and stock', () => {
    render(BookInfo, { props: { book: makeBook() } })
    for (const text of ['9780132350884', 'Robert C. Martin', 'Prentice Hall', '2008', 'Informatika', 'A-03', '15 Maret 2026', 'Tersedia · 4 eks.']) {
      expect(screen.getByText(text)).toBeInTheDocument()
    }
  })
})
