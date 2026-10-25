// Global setup Vitest: menghapus sisa build lama di frontend/ (dari sebelum frontend dipindah ke root),
// misalnya node_modules, .scannerwork, dan .trivy-cache. Workspace Jenkins tidak bisa di-wipe oleh mahasiswa,
// padahal sisa ini ikut masuk latest-app.zip dan membuatnya ditolak server deploy.
// Hanya frontend/Jenkinsfile (satu-satunya file frontend/ yang ada di git) yang dibiarkan.
import { existsSync, readdirSync, rmSync } from 'node:fs'

const LEGACY_DIR = 'frontend'
const KEEP = new Set(['Jenkinsfile'])

export default function cleanLegacyWorkspace() {
  if (!existsSync(LEGACY_DIR)) return
  for (const name of readdirSync(LEGACY_DIR)) {
    if (!KEEP.has(name)) rmSync(`${LEGACY_DIR}/${name}`, { recursive: true, force: true })
  }
}
