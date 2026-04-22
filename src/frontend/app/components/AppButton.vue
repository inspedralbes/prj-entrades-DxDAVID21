<template>
  <UButton
    :color="variant"
    :variant="variant === 'primary' ? 'solid' : variant === 'secondary' ? 'solid' : 'solid'"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    :icon="icon"
    :to="to"
    @click="$emit('click')"
  >
    <slot />
  </UButton>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script>
