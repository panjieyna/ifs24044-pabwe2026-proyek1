import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const apiProxy = {
  '/api': {
    target: process.env.API_TARGET || 'http://localhost:5000',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: { API_BASEURL: JSON.stringify('/api/v1') },
  server: {
    port: Number(process.env.APP_PORT || process.env.VITE_APP_PORT || 3000),
    proxy: apiProxy,
  },
  preview: { proxy: apiProxy },
  build: {
    sourcemap: true,
    target: 'es2020',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globalSetup: ['./scripts/clean-legacy-workspace.js'],
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js', 'src/setupTests.js', 'src/test-utils.js', 'src/**/fixtures.js', '**/*.test.js'],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
  },
})