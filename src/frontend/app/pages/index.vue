<template>
  <div class="p-8">
    <div v-if="authStore.isAuthenticated" class="text-center">
      <h1 class="text-3xl font-bold">Benvingut, {{ authStore.user?.name }}!</h1>

      <button
        @click="authStore.logout()"
        class="bg-red-500 text-white px-4 py-2 rounded mt-2"
      >
        Cerrar Sesión
      </button>
    </div>
    <div v-else class="p-4">
      <NuxtLink to="/login" class="text-blue-500 mr-4">Iniciar Sesión</NuxtLink>
      <NuxtLink to="/register" class="text-blue-500">Registrarse</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
onMounted(() => {
  authStore.initFromStorage()
})
</script>
