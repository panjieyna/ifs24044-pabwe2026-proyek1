import { requestJson } from '../../../helpers/apiHelper.js'

const send = (method, body) => ({ method, body: JSON.stringify(body) })

export const getBooks = () => requestJson('/books')
export const getBook = (id) => requestJson(`/books/${id}`)
export const addBook = (body) => requestJson('/books', send('POST', body))
export const changeBook = (id, body) => requestJson(`/books/${id}`, send('PUT', body))
export const deleteBook = (id) => requestJson(`/books/${id}`, { method: 'DELETE' })
export const getStats = () => requestJson('/stats')
