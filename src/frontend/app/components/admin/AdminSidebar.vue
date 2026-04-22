<template>
  <div class="admin-sidebar">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="p-4 border-b border-gray-700">
        <NuxtLink to="/admin" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#F7C600] rounded-lg flex items-center justify-center">
            <span class="text-[#0A0F1F] font-bold text-xl">C</span>
          </div>
          <div class="hidden lg:block">
            <span class="text-white font-bold">Cinema</span>
            <span class="text-gray-500 text-sm block">Admin</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <div class="mb-4">
          <NuxtLink
            to="/"
            class="flex items-center gap-2 text-gray-400 hover:text-[#F7C600] transition-colors text-sm mb-4"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
            <span class="hidden lg:block">Tornar al lloc</span>
          </NuxtLink>
        </div>

        <div class="space-y-1">
          <div class="text-gray-500 text-xs uppercase tracking-wider mb-2 hidden lg:block">
            Gestió
          </div>

          <!-- Movies -->
          <NuxtLink
            to="/admin/movies"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-400 hover:bg-[#1A2238] hover:text-white"
            active-class="bg-[#0068C8] text-white"
          >
            <UIcon name="i-heroicons-film" class="w-5 h-5" />
            <span class="hidden lg:block">Pel·lícules</span>
          </NuxtLink>

          <!-- Rooms -->
          <NuxtLink
            to="/admin/rooms"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-400 hover:bg-[#1A2238] hover:text-white"
            active-class="bg-[#0068C8] text-white"
          >
            <UIcon name="i-heroicons-home" class="w-5 h-5" />
            <span class="hidden lg:block">Sales</span>
          </NuxtLink>

          <!-- Sessions -->
          <NuxtLink
            to="/admin/sessions"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-gray-400 hover:bg-[#1A2238] hover:text-white"
            active-class="bg-[#0068C8] text-white"
          >
            <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
            <span class="hidden lg:block">Sessions</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- User -->
      <div class="p-4 border-t border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-[#0068C8] rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">{{ userInitial }}</span>
          </div>
          <div class="hidden lg:block flex-1 min-w-0">
            <div class="text-white text-sm truncate">{{ authStore.user?.name }}</div>
            <div class="text-gray-500 text-xs">Administrador</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || 'A'
})
</script>
