<template>
  <UCard
    :ui="{
      root: 'bg-[#1A2238] border-gray-700 rounded-xl shadow-lg',
      header: 'border-b border-gray-700',
      body: 'text-white',
      footer: 'border-t border-gray-700'
    }"
    class="admin-card"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
        <slot name="actions" />
      </div>
    </template>
    <slot />
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>