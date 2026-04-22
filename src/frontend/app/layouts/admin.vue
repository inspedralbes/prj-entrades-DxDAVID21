<template>
  <div class="admin-layout min-h-screen bg-[#0A0F1F] flex">
    <AdminSidebar
      class="hidden lg:flex lg:w-64 flex-shrink-0"
    />

    <div class="flex-1 flex flex-col min-w-0">
      <AdminHeader
        :title="pageTitle"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />

      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>

    <Transition name="slide">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-50 lg:hidden"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="sidebarOpen = false"
        />
        <div class="absolute left-0 top-0 bottom-0 w-64">
          <AdminSidebar class="h-full" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  const path = route.path
  if (path.includes('/movies')) return 'Pel·lícules'
  if (path.includes('/sessions')) return 'Sessions'
  if (path.includes('/rooms')) return 'Sales'
  return 'Administració'
})

onMounted(() => {
  authStore.initFromStorage()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>