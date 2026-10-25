import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '../api/bookApi.js'

export const useBooksStore = defineStore('books', () => {
  const books = ref([])
  const book = ref(null)
  const stats = ref(null)

  async function loadBooks() {
    const res = await api.getBooks()
    if (res.success) books.value = res.data.books
    return res
  }
  async function loadBook(id) {
    book.value = null
    const res = await api.getBook(id)
    if (res.success) book.value = res.data.book
    return res
  }
  async function loadStats() {
    const res = await api.getStats()
    if (res.success) stats.value = res.data.stats
    return res
  }
  const addBook = (body) => api.addBook(body)
  const changeBook = (id, body) => api.changeBook(id, body)
  const removeBook = (id) => api.deleteBook(id)

  return { books, book, stats, loadBooks, loadBook, loadStats, addBook, changeBook, removeBook }
})
