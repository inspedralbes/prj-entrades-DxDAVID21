<template>
  <div class="p-8">
    <h1 class="text-2xl">
      Peliculas
    </h1>

    <div v-if="loading">
      Cargando...
    </div>

    <div v-else-if="movies && movies.length > 0" class="grid">
      <div v-for="movie in movies" :key="movie.id" class="grid">
        <NuxtLink :to="`/movies/${movie.id}`">
          <h2 class="font-bold">{{ movie.title }}</h2>
          <p>{{ movie.genre }}</p>
          <p>{{ movie.duration }} min</p>
        </NuxtLink>
      </div>
    </div>
    <div v-else>
      No hi ha pelicules desponibles
    </div>
  </div>
</template>

<script setup>
const movies = ref(null)
const loading = ref(true)
const publicMovies = usePublicMovies()

onMounted(async () => {
  try {
    movies.value = await publicMovies.getMovies()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
