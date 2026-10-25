import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken } from './helpers/apiHelper.js'

// Lazy load: tiap halaman hanya diunduh saat dibutuhkan
const LoginPage = () => import('./features/auth/pages/LoginPage.vue')
const CatalogPage = () => import('./features/books/pages/CatalogPage.vue')
const GuidePage = () => import('./features/common/pages/GuidePage.vue')
const DashboardPage = () => import('./features/common/pages/DashboardPage.vue')
const InventoryPage = () => import('./features/books/pages/InventoryPage.vue')
const BookDetailPage = () => import('./features/books/pages/BookDetailPage.vue')
const ProfilePage = () => import('./features/users/pages/ProfilePage.vue')
const NotFoundPage = () => import('./features/common/pages/NotFoundPage.vue')

// meta.layout menentukan kerangka halaman (lihat App.vue): 'public' | 'staff' | 'auth'
export const routes = [
  { path: '/', component: CatalogPage, meta: { layout: 'public', title: 'Katalog Buku' } },
  { path: '/panduan', component: GuidePage, meta: { layout: 'public', title: 'Panduan' } },
  { path: '/auth/login', component: LoginPage, meta: { layout: 'auth', title: 'Masuk Staf', guest: true } },
  { path: '/auth', redirect: '/auth/login' },
  { path: '/dashboard', component: DashboardPage, meta: { layout: 'staff', title: 'Dashboard', requiresAuth: true } },
  { path: '/buku', component: InventoryPage, meta: { layout: 'staff', title: 'Inventaris Buku', requiresAuth: true } },
  { path: '/buku/:bookId', component: BookDetailPage, meta: { layout: 'staff', title: 'Detail Buku', requiresAuth: true } },
  { path: '/profile', component: ProfilePage, meta: { layout: 'staff', title: 'Profil', requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFoundPage, meta: { layout: 'public', title: 'Halaman Tidak Ditemukan' } },
]

function redirectFor(meta) {
  const loggedIn = Boolean(getAccessToken())
  if (meta.requiresAuth && !loggedIn) return '/auth/login'
  if (meta.guest && loggedIn) return '/dashboard'
  return ''
}

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({ history, routes })
  router.beforeEach((to) => redirectFor(to.meta) || true)
  router.afterEach((to) => { document.title = `${to.meta.title} | DelLib Staff` })
  return router
}
