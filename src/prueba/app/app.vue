<template>
  <header>
    <nav>
      <ul>
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/movies">Movies</NuxtLink></li>
        <li v-if="authStore.isAuthenticated">
          <NuxtLink to="/tickets">My Tickets</NuxtLink>
        </li>
        <li v-if="authStore.isAuthenticated">
          <button @click="authStore.logout()">
            Logout
          </button>
        </li>
        <li v-else>
          <NuxtLink to="/login">Login</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.initFromStorage()
})
</script>
