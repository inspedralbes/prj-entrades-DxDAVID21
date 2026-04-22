<template>
  <div>
    <AdminCard title="Crear Sessió">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          
          <label class="block text-sm font-medium text-gray-300 mb-2">Pel·lícula</label>
          <select
            v-model="form.movie_id"
            class="w-full bg-[#0A0F1F] border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="m in movieOptions" :key="m.value" :value="m.value">
              {{ m.label }}
            </option>
          </select>


        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Sala</label>
          <select
            v-model="form.room_id"
            class="w-full bg-[#0A0F1F] border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="r in roomOptions" :key="r.value" :value="r.value">
              {{ r.label }}
            </option>
          </select>

        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Data i hora d'inici</label>
          <UInput
            v-model="form.start_time"
            type="datetime-local"
            size="lg"
            :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white' }"
            required
          />
          
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Preu (€)</label>
          <UInput
            v-model="form.price"
            type="number"
            step="0.01"
            placeholder="12.00"
            size="lg"
            :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
            required
          />
        </div>

        <div class="flex gap-4 pt-4 border-t border-gray-700">
          <AdminButton
            type="submit"
            color="primary"
            size="lg"
            icon="i-heroicons-check"
            :loading="saving"
          >
            Crear sessió
          </AdminButton>
          <NuxtLink to="/admin/sessions">
            <AdminButton variant="ghost" size="lg">
              Cancel·lar
            </AdminButton>
          </NuxtLink>
        </div>
      </form>
    </AdminCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})


const form = ref({
  movie_id: '',
  room_id: '',
  start_time: '',
  price: ''
})

const loading = ref(true)
const saving = ref(false)
const movies = ref([])
const rooms = ref([])
const authStore = useAuthStore()
const sessionsApi = useSessions()
const moviesApi = useMovies()
const roomsApi = useRooms()

const movieOptions = computed(() =>
  movies.value.map(m => ({ label: m.title, value: m.id }))
)

const roomOptions = computed(() =>
  rooms.value.map(r => ({ label: r.name, value: r.id }))
)

onMounted(async () => {
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) {
    navigateTo('/')
  }

  try {
    movies.value = await moviesApi.getMovies()
    rooms.value = await roomsApi.getRooms()
  } catch (error) {
    console.error(error)
  }
})

const handleSubmit = async () => {
  saving.value = true
  try {
    await sessionsApi.createSession({
      movie_id: parseInt(form.value.movie_id),
      room_id: parseInt(form.value.room_id),
      start_time: form.value.start_time,
      price: parseFloat(form.value.price),
    })
    navigateTo('/admin/sessions')
  } catch (error) {
    console.error('Error creant:', error)
  } finally {
    saving.value = false
  }
}

watch(movieOptions, (v) => {
  console.log("MOVIE OPTIONS:", v)
}, {deep: true})

watch(roomOptions, (v) => {
  console.log("ROOM OPTIONS:", v)
}, {deep: true})

</script>