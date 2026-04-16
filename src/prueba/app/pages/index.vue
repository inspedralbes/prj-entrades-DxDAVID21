<template>
  <div>
    <div v-if="authStore.isAuthenticated" class="p-4">
      <p>Bienvenido, {{ authStore.user?.name }}!</p>

      <button
        @click="authStore.logout()"
        class="bg-red-500 text-white px-4 py-2 rounded mt-2"
      >
        Cerrar Sesión
      </button>

      <NuxtLink to="/admin/movies">Movies</NuxtLink>
      <NuxtLink to="/admin/rooms">Rooms</NuxtLink>
      <NuxtLink to="/admin/sessions">Sessionroo</NuxtLink>
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
