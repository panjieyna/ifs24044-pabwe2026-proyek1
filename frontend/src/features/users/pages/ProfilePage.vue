<script setup>
import { reactive, onMounted } from 'vue'
import { useUsersStore } from '../states/usersStore.js'
import UserAvatar from '../components/UserAvatar.vue'
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper.js'

const store = useUsersStore()
const form = reactive({ name: '', email: '' })
const pw = reactive({ password: '', new_password: '', new_password_confirmation: '' })
const notify = (res) => (res.success ? showSuccessDialog : showErrorDialog)(res.message)

onMounted(async () => {
  await store.loadProfile()
  if (store.profile) Object.assign(form, { name: store.profile.name, email: store.profile.email })
})
const submitProfile = async () => notify(await store.saveProfile({ name: form.name, email: form.email }))
async function submitPassword() {
  const res = await store.savePassword({ ...pw })
  if (res.success) Object.assign(pw, { password: '', new_password: '', new_password_confirmation: '' })
  notify(res)
}
</script>

<template>
  <section aria-label="Profil" class="max-w-2xl space-y-6">
    <h1 class="text-2xl font-extrabold text-brand">Profil staf</h1>
    <div v-if="store.profile" class="flex items-center gap-4 rounded-2xl bg-white p-6 shadow">
      <UserAvatar :name="store.profile.name" size="lg" />
      <div>
        <h2 class="text-xl font-bold">{{ store.profile.name }}</h2>
        <p class="text-sm text-stone-700">{{ store.profile.email }}</p>
        <p class="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">Staf perpustakaan yang bertugas</p>
      </div>
    </div>
    <form class="space-y-3 rounded-2xl bg-white p-6 shadow" @submit.prevent="submitProfile">
      <h2 class="text-lg font-bold">Data diri</h2>
      <label for="profile-name" class="block text-sm font-semibold">Nama</label>
      <input id="profile-name" v-model="form.name" aria-label="Nama" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <label for="profile-email" class="block text-sm font-semibold">Email</label>
      <input id="profile-email" v-model="form.email" type="email" aria-label="Email" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <button type="submit" aria-label="Simpan profil" class="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand/90">Simpan profil</button>
    </form>
    <form class="space-y-3 rounded-2xl bg-white p-6 shadow" @submit.prevent="submitPassword">
      <h2 class="text-lg font-bold">Ubah kata sandi</h2>
      <label for="profile-password" class="block text-sm font-semibold">Kata sandi saat ini</label>
      <input id="profile-password" v-model="pw.password" type="password" aria-label="Kata sandi saat ini" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <label for="profile-new-password" class="block text-sm font-semibold">Kata sandi baru</label>
      <input id="profile-new-password" v-model="pw.new_password" type="password" aria-label="Kata sandi baru" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <label for="profile-confirm-password" class="block text-sm font-semibold">Konfirmasi kata sandi baru</label>
      <input id="profile-confirm-password" v-model="pw.new_password_confirmation" type="password" aria-label="Konfirmasi kata sandi baru" class="w-full rounded-lg border border-stone-500 px-3 py-2" />
      <button type="submit" aria-label="Ubah kata sandi" class="rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand/90">Ubah kata sandi</button>
    </form>
  </section>
</template>
