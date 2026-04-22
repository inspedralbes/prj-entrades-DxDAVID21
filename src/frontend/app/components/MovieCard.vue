<template>
  <NuxtLink
    :to="`/movies/${movie.id}`"
    class="movie-card group block bg-[#1A2238] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
  >
    <div class="relative aspect-[2/3] overflow-hidden">
      <img
        v-if="movie.poster_url"
        :src="movie.poster_url"
        :alt="movie.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      >
      <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
        <span class="text-gray-400 text-4xl">🎬</span>
      </div>
      <div class="absolute top-2 right-2 bg-[#0068C8] text-white text-xs font-bold px-2 py-1 rounded">
        {{ movie.duration }} min
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-white font-bold text-lg truncate group-hover:text-[#F7C600] transition-colors">
        {{ movie.title }}
      </h3>
      <div class="flex items-center gap-2 mt-2">
        <span class="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
          {{ movie.genre }}
        </span>
        <span v-if="movie.rating" class="text-[#F7C600] text-sm flex items-center gap-1">
          ★ {{ movie.rating.toFixed(1) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({
  movie: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.movie-card {
  min-width: 200px;
  max-width: 280px;
}
</style>
