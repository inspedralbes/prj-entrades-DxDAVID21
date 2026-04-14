<template>
    <div class="p-8">
        <h1 class="text-2xl">Crear</h1>

        <form @submit.prevent="handleSubmit" class="max-w-lg">
            <div class="mb-4">
                <label class="block">Pelicula</label>
                <select v-model="form.movie_id" class="w-full"  required>
                    <option value="">Seleciona una pelicula</option>
                    <option v-for="movie in movies" :key="movie.id" :value="movie.id">
                        {{ movie.title }}
                    </option>
                </select>
            </div>
            
            <div class="mb-4">
                <label class="block">Salas</label>
                <select v-model="form.room_id" class="w-full" required>
                    <option value="">Seleciona una sala</option>
                    <option v-for="room in rooms" :key="room.id" :value="room.id">
                        {{ room.name }}
                    </option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block">Hora de Incio</label>
                <input v-model="form.start_time" type="datetime-local" class="w-full"  required/>
            </div>

            <div class="mb-4">
                <label class="block">Precio</label>
                <input v-model="form.price" type="number" step="0.01" class="w-full"  required/>
            </div>

            <button type="submit" class="bg-blue-500">Crear Sesion</button>
            <NuxtLink to="/admin/sessions" class="ml-4">Cancelar</NuxtLink>
        </form>
    </div>
</template>

<script setup>
const form = ref({
    movie_id: '',
    room_id: '',
    start_time: '',
    price: ''
})

const loading = ref(true)
const movies = ref([])
const rooms = ref([])
const authStore = useAuthStore()
const sessionsApi = useSessions()
const moviesApi = useMovies()
const roomsApi = useRooms()

onMounted(async() => {
    authStore.initFromStorage()

    if (!authStore.isAuthenticated){
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
    try {
        await sessionsApi.createSession({
            movie_id: parseInt(form.value.movie_id),
            room_id: parseInt(form.value.room_id),
            start_time: form.value.start_time,
            price: parseFloat(form.value.price),
        })
        navigateTo('/admin/sessions')
    } catch (error) {
        alert('Error al crear sala')
    }
}
</script>