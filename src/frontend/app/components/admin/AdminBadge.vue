<template>
  <UBadge
    :color="color"
    :variant="variant"
    :size="size"
    class="font-medium"
  >
    <slot />
  </UBadge>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'gray',
    validator: (value) =>
      ['gray', 'primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  variant: {
    type: String,
    default: 'solid',
    validator: (value) =>
      ['solid', 'subtle', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) =>
      ['xs', 'sm', 'md', 'lg'].includes(value)
  }
})
</script>
