<template>
  <div class="admin-table overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b border-gray-700">
          <th
            v-for="column in columns"
            :key="column.key"
            class="text-left text-gray-400 font-medium text-sm py-3 px-4"
            :class="{ 'text-right': column.align === 'right' }"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
          class="border-b border-gray-700/50 hover:bg-[#252d4a] transition-colors"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="py-4 px-4"
            :class="{ 'text-right': column.align === 'right' }"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="text-center py-8 text-gray-500">
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  emptyText: {
    type: String,
    default: 'No hi ha dades'
  }
})
</script>