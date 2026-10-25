import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from './router.js'

async function go(path) {
  const router = createAppRouter(createMemoryHistory())
  await router.push(path)
  return router.currentRoute.value.fullPath
}

describe('route guard', () => {
  it('lets everyone open the two public pages', async () => {
    expect(await go('/')).toBe('/')
    expect(await go('/panduan')).toBe('/panduan')
    localStorage.setItem('accessToken', 't')
    expect(await go('/')).toBe('/')
    expect(await go('/panduan')).toBe('/panduan')
  })

  it.each(['/dashboard', '/buku', '/buku/1', '/profile'])('redirects guests from %s to the login page', async (path) => {
    expect(await go(path)).toBe('/auth/login')
  })

  it.each(['/dashboard', '/buku', '/buku/1', '/profile'])('lets logged-in staff open %s', async (path) => {
    localStorage.setItem('accessToken', 't')
    expect(await go(path)).toBe(path)
  })

  it('shows the login page to guests and sends logged-in staff to the dashboard', async () => {
    expect(await go('/auth/login')).toBe('/auth/login')
    expect(await go('/auth')).toBe('/auth/login')
    localStorage.setItem('accessToken', 't')
    expect(await go('/auth/login')).toBe('/dashboard')
  })

  it('has no public registration page', async () => {
    expect(await go('/auth/register')).toBe('/auth/register') // jatuh ke halaman 404
  })

  it('sets the document title', async () => {
    await go('/panduan')
    expect(document.title).toBe('Panduan | DelLib Staff')
  })
})
