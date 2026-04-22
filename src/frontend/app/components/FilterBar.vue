<template>
  <div class="filter-bar bg-[#1A2238] rounded-lg p-4 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          placeholder="Buscar pel·lícules..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          :ui="{ icon: { base: 'text-gray-400' } }"
          class="w-full"
          @update:model-value="$emit('search', $event)"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <USelect
          v-model="selectedGenre"
          :options="genreOptions"
          placeholder="Tots els gèneres"
          size="lg"
          class="w-full sm:w-48"
          @update:model-value="$emit('filterGenre', $event)"
        />

        <USelect
          v-model="selectedSort"
          :options="sortOptions"
          placeholder="Ordenar per..."
          size="lg"
          class="w-full sm:w-48"
          @update:model-value="$emit('sort', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const selectedGenre = ref('')
const selectedSort = ref('')

const genreOptions = ref([
  { label: 'Tots els gèneres', value: '' },
  { label: 'Acció', value: 'action' },
  { label: 'Comèdia', value: 'comedy' },
  { label: 'Drama', value: 'drama' },
  { label: 'Terror', value: 'horror' },
  { label: 'Ciència ficció', value: 'sci-fi' },
  { label: 'Romàntic', value: 'romance' },
  { label: 'Animació', value: 'animation' }
])

const sortOptions = ref([
  { label: 'Ordenar per...', value: '' },
  { label: 'Estrena recent', value: 'date_desc' },
  { label: 'Estrena antiga', value: 'date_asc' },
  { label: 'Popularitat', value: 'popularity' },
  { label: 'Valoració', value: 'rating' }
])

defineEmits(['search', 'filterGenre', 'sort'])
</script>
