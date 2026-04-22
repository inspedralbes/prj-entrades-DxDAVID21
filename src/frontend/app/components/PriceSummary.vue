<template>
  <div class="price-summary bg-[#1A2238] rounded-lg p-4">
    <h3 class="text-white font-bold text-lg mb-4">Resum del preu</h3>

    <div class="space-y-3">
      <div
        v-for="item in items"
        :key="item.label"
        class="flex justify-between items-center"
      >
        <span class="text-gray-400">{{ item.label }}</span>
        <span class="text-white font-medium">{{ formatPrice(item.amount) }}</span>
      </div>

      <div v-if="items.length > 0" class="border-t border-gray-700 pt-3 mt-3">
        <div class="flex justify-between items-center">
          <span class="text-gray-300 font-semibold">Total</span>
          <span class="text-[#F7C600] text-2xl font-bold">{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + item.amount, 0)
})

function formatPrice(amount) {
  return `${amount.toFixed(2)} €`
}
</script>
