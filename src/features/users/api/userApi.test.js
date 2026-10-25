import { getMe, updateMe, changePassword } from './userApi.js'

describe('userApi', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 200, json: async () => ({ status: 'success' }) })))
  afterEach(() => vi.unstubAllGlobals())

  it('reads the own profile', async () => {
    await getMe()
    expect(fetch.mock.calls[0][0]).toBe('/api/v1/users/me')
  })

  it('updates the profile with PUT', async () => {
    await updateMe({ name: 'A', email: 'a@x.id' })
    const [url, options] = fetch.mock.calls[0]
    expect([url, options.method, options.body]).toEqual(['/api/v1/users/me', 'PUT', JSON.stringify({ name: 'A', email: 'a@x.id' })])
  })

  it('changes the password with PUT', async () => {
    await changePassword({ password: 'a' })
    const [url, options] = fetch.mock.calls[0]
    expect([url, options.method, options.body]).toEqual(['/api/v1/users/password', 'PUT', JSON.stringify({ password: 'a' })])
  })
})
