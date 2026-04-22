<template>
  <UButton
    :color="color"
    :variant="variant"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    :icon="icon"
    :to="to"
    class="font-semibold"
    @click="$emit('click')"
  >
    <slot />
  </UButton>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'solid',
    validator: (value) => ['solid', 'outline', 'ghost'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) =>
      ['primary', 'secondary', 'danger', 'success', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  loading: Boolean,
  disabled: Boolean,
  block: Boolean,
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
