import { login, logout } from './authApi.js'

describe('authApi', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 200, json: async () => ({ status: 'success', data: { token: 't' } }) })))
  afterEach(() => vi.unstubAllGlobals())

  it('posts only email and password to the login endpoint', async () => {
    const res = await login({ email: 'a@b.id', password: 'rahasia', extra: 1 })
    expect(fetch).toHaveBeenCalledWith('/api/v1/auth/login', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.id', password: 'rahasia' }),
    })
    expect(res.success).toBe(true)
  })

  it('sends the bearer token when logging out', async () => {
    localStorage.setItem('accessToken', 'abc')
    await logout()
    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('/api/v1/auth/logout')
    expect(options.method).toBe('POST')
    expect(options.headers.Authorization).toBe('Bearer abc')
  })
})
