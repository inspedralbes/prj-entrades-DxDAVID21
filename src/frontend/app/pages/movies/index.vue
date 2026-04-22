<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white mb-2">Pel·lícules</h1>
      <p class="text-gray-400">Descobreix les millors pel·lícules als nostres cinemes</p>
    </div>

    <FilterBar
      @search="handleSearch"
      @filter-genre="handleFilterGenre"
      @sort="handleSort"
    />

    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
    </div>

    <div v-else-if="filteredMovies.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <MovieCard
        v-for="movie in filteredMovies"
        :key="movie.id"
        :movie="movie"
      />
    </div>

    <div v-else class="text-center py-16">
      <div class="text-gray-400 text-lg mb-4">No s'han trobat pel·lícules</div>
      <UButton color="primary" @click="resetFilters">
        Reiniciar filtres
      </UButton>
    </div>
  </div>
</template>

<script setup>
const publicMovies = usePublicMovies()
const movies = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedGenre = ref('')
const selectedSort = ref('')

onMounted(async () => {
  try {
    movies.value = await publicMovies.getMovies()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const filteredMovies = computed(() => {
  let result = [...movies.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(movie =>
      movie.title.toLowerCase().includes(query)
    )
  }

  if (selectedGenre.value) {
    result = result.filter(movie =>
      movie.genre?.toLowerCase() === selectedGenre.value.toLowerCase()
    )
  }

  if (selectedSort.value) {
    switch (selectedSort.value) {
      case 'date_desc':
        result.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
        break
      case 'date_asc':
        result.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
        break
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'popularity':
        result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        break
    }
  }

  return result
})

function handleSearch(value) {
  searchQuery.value = value
}

function handleFilterGenre(value) {
  selectedGenre.value = value
}

function handleSort(value) {
  selectedSort.value = value
}

function resetFilters() {
  searchQuery.value = ''
  selectedGenre.value = ''
  selectedSort.value = ''
}
</script>
