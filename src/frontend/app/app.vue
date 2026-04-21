<template>
  <header>
    <nav>
      <ul class="flex gap-6 items-center">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/movies">Pel·licules</NuxtLink></li>

        <li v-if="authStore.isAuthenticated">
          <NuxtLink to="/tickets">Els mues Tickets</NuxtLink>
        </li>

        <li v-if="authStore.isAdmin" class="relative group">
          <span class="cursor-pointer">Admin ▼</span>
          <ul>
            <li class="block">
              <NuxtLink to="/admin/movies" class="block">Pel·licules</NuxtLink>
            </li>
            <li class="block">
              <NuxtLink to="/admin/rooms" class="block">Sales</NuxtLink>
            </li>
            <li class="block">
              <NuxtLink to="/admin/sessions" class="block">Sessions</NuxtLink>
            </li>
          </ul>
        </li>
      </ul>

      <ul class="flex">
        <li v-if="authStore.isAuthenticated">
          <span class="text-sm">
            {{ authStore.user?.name }}
            <span v-if="authStore.isAdmin" class="text-yellow-400">(Admin)</span>
          </span>
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
