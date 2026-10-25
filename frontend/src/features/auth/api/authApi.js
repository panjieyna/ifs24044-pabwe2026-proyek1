import { readJson, requestJson } from '../../../helpers/apiHelper.js'

export const login = ({ email, password }) =>
  readJson(fetch(`${API_BASEURL}/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }))
export const logout = () => requestJson('/auth/logout', { method: 'POST' })
