import { render, screen } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import GuidePage from './GuidePage.vue'
import NotFoundPage from './NotFoundPage.vue'
import StatBarList from '../components/StatBarList.vue'

describe('GuidePage', () => {
  it('shows the visitor rules and the staff procedures', () => {
    renderWithProviders(GuidePage)
    expect(screen.getByRole('heading', { name: 'Panduan Perpustakaan' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tata tertib pengunjung' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mencatat buku baru' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Memperbarui stok dan lokasi rak' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Menghapus buku dari koleksi' })).toBeInTheDocument()
  })
})

describe('NotFoundPage', () => {
  it('shows 404 with a link back to the catalog', () => {
    renderWithProviders(NotFoundPage)
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Kembali ke katalog' })).toHaveAttribute('href', '/')
  })
})

describe('StatBarList', () => {
  it('scales bars to the largest value', () => {
    const { container } = render(StatBarList, { props: { items: [{ label: 'A', value: 10 }, { label: 'B', value: 5 }] } })
    const bars = container.querySelectorAll('li > span:nth-child(2) > span')
    expect(bars[0]).toHaveStyle({ width: '100%' })
    expect(bars[1]).toHaveStyle({ width: '50%' })
  })
  it('does not divide by zero when every value is 0', () => {
    const { container } = render(StatBarList, { props: { items: [{ label: 'A', value: 0 }] } })
    expect(container.querySelector('li > span:nth-child(2) > span')).toHaveStyle({ width: '0%' })
  })
})
