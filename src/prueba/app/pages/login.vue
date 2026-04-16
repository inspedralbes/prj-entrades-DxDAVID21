<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold text-center mb-6">
        Inciar Sesión
      </h1>
      <form @submit.prevent="handleLogin">
        <div class="m-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input v-model="email" type="email" class="w-full" required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Password
          </label>
          <input v-model="password" type="password" class="w-full" required />
        </div>
        <button type="submit" class="mt-4">
          Entrar
        </button>
      </form>
      <p class="mt-4">
        No tienes cuenta
        <NuxtLink to="/register" class="text-blue">Regístrate</NuxtLink>
      </p>

      <p v-if="error" class="mt-4">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  error.value = ''
  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    navigateTo('/')
  } else {
    error.value = result.message || 'Error al inciar sesión'
  }
}
</script>
