<template>
  <div class="min-h-screen bg-[#0A0F1F] flex flex-col">
    <AppHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.initFromStorage()
})
</script>
