import { requestJson } from '../../../helpers/apiHelper.js'

export const getMe = () => requestJson('/users/me')
export const updateMe = (body) => requestJson('/users/me', { method: 'PUT', body: JSON.stringify(body) })
export const changePassword = (body) =>
  requestJson('/users/password', { method: 'PUT', body: JSON.stringify(body) })
