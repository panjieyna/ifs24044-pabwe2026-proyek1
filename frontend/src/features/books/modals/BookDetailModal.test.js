import { render, screen, fireEvent } from '@testing-library/vue'
import BookDetailModal from './BookDetailModal.vue'
import { makeBook } from '../fixtures.js'

it('shows the book synopsis and details and can be closed', async () => {
  const { emitted } = render(BookDetailModal, { props: { book: makeBook() } })
  expect(screen.getByRole('dialog', { name: 'Clean Code' })).toBeInTheDocument()
  expect(screen.getByText('Panduan kode bersih.')).toBeInTheDocument()
  expect(screen.getByText('A-03')).toBeInTheDocument()
  await fireEvent.click(screen.getByRole('button', { name: 'Tutup' }))
  expect(emitted().close).toHaveLength(1)
})
