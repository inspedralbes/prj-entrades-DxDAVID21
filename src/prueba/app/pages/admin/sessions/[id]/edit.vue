<template>
    <div class="p-8">
        <h1 class="text-2xl">Editar Sesion</h1>
        <div v-if="loading">Cargando...</div>
    
        <form v-else @submit.prevent="handleSubmit" class="max-w-lg">
            <div class="mb-4">
                <label class="block mb-1">Pelicula</label>
                <select v-model="form.movie_id" class="w-full border p-2" required>
                    <option v-for="movie in movies" :key="movie.id" :value="movie.id">
                        {{ movie.title }}
                    </option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block mb-1">Sala</label>
                <select v-model="form.room_id" class="w-full border p-2" required>
                    <option v-for="room in rooms" :key="room.id" :value="room.id">
                        {{ room.name }}
                    </option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block mb-1">Hora de Inicios</label>
                <input v-model="form.start_time" type="datetime-local" class="w-full border p-2" required />
            </div>

            <div class="mb-4">
                <label class="block mb-1">Precio</label>
                <input v-model="form.price" type="number" step="0.01" class="w-full border p-2" required />
            </div>

            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                Guardar Cambios
            </button>
            
            <NuxtLink to="/admin/sessions" class="ml-4 text-gray-500">Cancelar</NuxtLink>
        </form>
    </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
const form = ref({})
const loading = ref(true)
const movies = ref([])
const rooms = ref([])
const authStore = useAuthStore()
const sessionsApi = useSessions()
const moviesApi = useMovies()
const roomsApi = useRooms()


onMounted(async () => {
    authStore.initFromStorage()

    if (!authStore.isAuthenticated) {
        navigateTo('/')

        return
    }
    try {
        const session = await sessionsApi.getSession(parseInt(id))
        form.value= {...session}

        movies.value = await moviesApi.getMovies()
        rooms.value = await roomsApi.getRooms()
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

const handleSubmit = async () => {
    try {
        await sessionsApi.updateSession(parseInt(id), {
            movie_id: parseInt(form.value.movie_id),
            room_id: parseInt(form.value.room_id),
            start_time: form.value.start_time,
            price: parseFloat(form.value.price),
        })
        navigateTo('/admin/sessions')
    } catch (error) {
        alert('Error al actualitzar sala')
        console.error(error)
    }
}

</script>