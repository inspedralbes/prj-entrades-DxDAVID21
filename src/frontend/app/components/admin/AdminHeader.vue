<template>
  <header class="admin-header bg-[#0A0F1F] border-b border-gray-800 px-4 py-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          class="lg:hidden text-gray-400 hover:text-white"
          @click="$emit('toggle-sidebar')"
        >
          <UIcon name="i-heroicons-bars-3" class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-bold text-white">{{ title }}</h1>
      </div>

      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="text-gray-400 hover:text-[#F7C600] transition-colors">
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Administració'
  }
})

defineEmits(['toggle-sidebar'])
</script>