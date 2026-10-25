import { render, screen, waitFor } from '@testing-library/vue'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import App from './App.vue'
import { createAppRouter } from './router.js'
import * as bookApi from './features/books/api/bookApi.js'
import * as userApi from './features/users/api/userApi.js'
import { books } from './features/books/fixtures.js'

vi.mock('./features/books/api/bookApi.js')
vi.mock('./features/users/api/userApi.js')

async function renderAt(path) {
  const router = createAppRouter(createMemoryHistory())
  router.push(path)
  await router.isReady()
  render(App, { global: { plugins: [createPinia(), router] } })
}

describe('App routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    bookApi.getBooks.mockResolvedValue({ success: true, data: { books } })
    bookApi.getStats.mockResolvedValue({ success: false, message: 'x' })
    userApi.getMe.mockResolvedValue({ success: true, data: { user: { id: 1, name: 'Sari', email: 's@x.id' } } })
  })

  it('renders the public catalog at / without login', async () => {
    await renderAt('/')
    expect(await screen.findByRole('heading', { name: 'Katalog buku perpustakaan' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Clean Code' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Masuk staf' })).toBeInTheDocument()
  })

  it('renders the guide page', async () => {
    await renderAt('/panduan')
    expect(await screen.findByRole('heading', { name: 'Panduan Perpustakaan' })).toBeInTheDocument()
  })

  it('renders the login page in the auth layout', async () => {
    await renderAt('/auth/login')
    expect(await screen.findByText('Masuk sebagai staf perpustakaan')).toBeInTheDocument()
    await waitFor(() => expect(document.querySelector('#btn-submit')).toBeInTheDocument())
  })

  it('renders the inventory inside the staff layout for logged-in staff', async () => {
    localStorage.setItem('accessToken', 't')
    await renderAt('/buku')
    expect(await screen.findByRole('heading', { name: 'Inventaris buku' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Sari' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tambah Buku' })).toBeInTheDocument()
  })

  it('redirects guests from protected pages to the login page', async () => {
    await renderAt('/dashboard')
    expect(await screen.findByText('Masuk sebagai staf perpustakaan')).toBeInTheDocument()
  })

  it('renders 404 for unknown paths', async () => {
    await renderAt('/nope')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })
})
