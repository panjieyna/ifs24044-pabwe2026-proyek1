// Global setup Vitest: menghapus sisa build lama di frontend/ (dari sebelum frontend dipindah ke root).
// Workspace Jenkins tidak bisa di-wipe oleh mahasiswa, padahal sisa ini ikut masuk latest-app.zip
// dan membuatnya melebihi batas 5000 file server deploy. Tidak berbuat apa-apa jika folder sudah tidak ada.
import { rmSync } from 'node:fs'

export default function cleanLegacyWorkspace() {
  for (const dir of ['node_modules', '.scannerwork', 'coverage', 'dist']) {
    rmSync(`frontend/${dir}`, { recursive: true, force: true })
  }
}
