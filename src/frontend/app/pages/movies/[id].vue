<template>
  <div v-if="loading" class="flex justify-center py-16">
    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
  </div>

  <div v-else-if="movie" class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div class="lg:col-span-1">
        <div class="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
          <img
            v-if="movie.poster_url"
            :src="movie.poster_url"
            :alt="movie.title"
            class="w-full h-full object-cover"
          >
          <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
            <span class="text-gray-400 text-8xl">🎬</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="mb-4">
          <h1 class="text-4xl font-bold text-white mb-4">{{ movie.title }}</h1>
          <div class="flex flex-wrap gap-3 mb-4">
            <span class="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              {{ movie.genre }}
            </span>
            <span v-if="movie.rating" class="bg-[#F7C600] text-black px-3 py-1 rounded-full text-sm font-bold">
              ★ {{ movie.rating.toFixed(1) }}
            </span>
            <span class="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
              {{ movie.duration }} min
            </span>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-semibold text-white mb-2">Sinopsi</h2>
          <p class="text-gray-300 leading-relaxed">{{ movie.description }}</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div class="bg-[#1A2238] rounded-lg p-4 text-center">
            <div class="text-gray-400 text-sm mb-1">Duració</div>
            <div class="text-white font-bold">{{ movie.duration }} min</div>
          </div>
          <div class="bg-[#1A2238] rounded-lg p-4 text-center">
            <div class="text-gray-400 text-sm mb-1">Gènere</div>
            <div class="text-white font-bold">{{ movie.genre }}</div>
          </div>
          <div v-if="movie.director" class="bg-[#1A2238] rounded-lg p-4 text-center">
            <div class="text-gray-400 text-sm mb-1">Director</div>
            <div class="text-white font-bold">{{ movie.director }}</div>
          </div>
          <div v-if="movie.classification" class="bg-[#1A2238] rounded-lg p-4 text-center">
            <div class="text-gray-400 text-sm mb-1">Classificació</div>
            <div class="text-white font-bold">{{ movie.classification }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#1A2238] rounded-xl p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 class="text-2xl font-bold text-white">Sessions disponibles</h2>

        <div class="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <USelect
            v-model="selectedCinema"
            :options="cinemaOptions"
            placeholder="Tots els cinemes"
            size="lg"
            class="w-full sm:w-56"
          />
          <input
            v-model="selectedDate"
            type="date"
            class="bg-[#0A0F1F] text-white border border-gray-700 rounded-lg px-4 py-2"
          >
        </div>
      </div>

      <div v-if="filteredSessions.length > 0">
        <SessionList
          :sessions="filteredSessions"
          @select="handleSessionSelect"
        />
      </div>

      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">
          No hi ha sessions disponibles per als filtres seleccionats
        </div>
        <UButton variant="ghost" @click="resetFilters">
          Veure totes les sessions
        </UButton>
      </div>
    </div>
  </div>

  <div v-else class="container mx-auto px-4 py-16 text-center">
    <div class="text-gray-400 text-xl mb-4">Pel·lícula no trobada</div>
    <NuxtLink to="/movies">
      <UButton color="primary">
        Tornar a les pel·lícules
      </UButton>
    </NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const id = route.params.id

const movie = ref(null)
const loading = ref(true)
const selectedCinema = ref('')
const selectedDate = ref('')

const publicMovies = usePublicMovies()
const bookingStore = useBookingStore()

onMounted(async () => {
  try {
    movie.value = await publicMovies.getMovie(parseInt(id))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const cinemaOptions = computed(() => {
  if (!movie.value?.sessions) return []

  const cinemas = [...new Set(movie.value.sessions.map(s => s.cinema_name))]
  return [
    { label: 'Tots els cinemes', value: '' },
    ...cinemas.map(c => ({ label: c, value: c }))
  ]
})

const filteredSessions = computed(() => {
  if (!movie.value?.sessions) return []

  let sessions = [...movie.value.sessions]

  if (selectedCinema.value) {
    sessions = sessions.filter(s => s.cinema_name === selectedCinema.value)
  }

  if (selectedDate.value) {
    const selected = new Date(selectedDate.value)
    sessions = sessions.filter(s => {
      const sessionDate = new Date(s.date)
      return sessionDate.toDateString() === selected.toDateString()
    })
  }

  return sessions.sort((a, b) => new Date(a.date) - new Date(b.date))
})

function handleSessionSelect(session) {
  bookingStore.setSession(session)
  const token = localStorage.getItem('token')

  if (token) {
    router.push(`/sessions/${session.id}/seats`)
  } else {
    router.push(`/login?redirect=/sessions/${session.id}/seats`)
  }
}

function resetFilters() {
  selectedCinema.value = ''
  selectedDate.value = ''
}
</script>
