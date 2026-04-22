<template>
  <div>
    <AdminCard title="Editar Sessió">
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Pel·lícula</label>
          <USelect
            v-model="form.movie_id"
            :options="movieOptions"
            options-attribute="label"
            value-attribute="value"
            placeholder="Selecciona una pel·lícula"
            size="lg"
            :ui="{ 
              root: 'bg-[#0A0F1F] border-gray-700',
              input: 'text-white placeholder-gray-400',
              icon: 'text-[#F7C600]',
              options: 'bg-[#0A0F1F] text-white border border-gray-700',
              option: 'hover:bg-[#1A2238] hover:text-[#F7C600]'
            }"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Sala</label>
          <USelect
            v-model="form.room_id"
            :options="roomOptions"
            option-attribute="label"
            value-attribute="value"
            placeholder="Selecciona una sala"
            size="lg"
            :ui="{
              root: 'bg-[#0A0F1F] border border-gray-600 text-white',
              input: 'text-white placeholder-gray-400',
              icon: 'text-[#F7C600]',
              options: 'bg-[#0A0F1F] text-white border border-gray-700',
              option: 'hover:bg-[#1A2238] hover:text-[#F7C600]'
            }"
            required
          />
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
            Guardar canvis
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

const route = useRoute()
const id = route.params.id
const form = ref({})
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
    return
  }

  try {
    const session = await sessionsApi.getSession(parseInt(id))
    form.value = { ...session }

    movies.value = await moviesApi.getMovies()
    rooms.value = await roomsApi.getRooms()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  saving.value = true
  try {
    await sessionsApi.updateSession(parseInt(id), {
      movie_id: parseInt(form.value.movie_id),
      room_id: parseInt(form.value.room_id),
      start_time: form.value.start_time,
      price: parseFloat(form.value.price),
    })
    navigateTo('/admin/sessions')
  } catch (error) {
    console.error('Error actualitzant:', error)
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