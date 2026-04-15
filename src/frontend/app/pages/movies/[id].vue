<template>
    <div class="p-8">
        <div v-if="loading">Carregant...</div>
        <div v-else-if="movie">
            <h1 class="text-3xl">{{ movie.title }}</h1>
            <p>{{ movie.description }}</p>
            <p>Genere: {{ movie.genre }}</p>
            <p>Duració: {{ movie.duration}} min</p>

            <h2 class="text-xl">Sessions Disponibles</h2>

            <div v-if="movie.sessions && movie.sessions.length > 0">
                <div v-for="session in movie.sessions" :key="session.id" class="border">
                    <p>Fecha: {{ session.start_time }}</p>
                    <p>Sala: {{ session.room?.name }}</p>
                    <p>Preu: {{ session.price }}€</p>

                    <button @click="goToSeats(session.id)" class="bg-blue-500">
                        Seleccionar Seients
                    </button>
                </div>
            </div>
            <div v-else>No hi ha seisnts disponibles</div>
        </div>
        <div v-else>
            <p>Película no encontrada.</p>
            <NuxtLink to="/movies" class="text-blue-500">Volver a películas</NuxtLink>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
const movie = ref(null)
const loading = ref(true)
const publicMovies = usePublicMovies()

onMounted(async () => {
    try {
        movie.value = await publicMovies.getMovie(parseInt(id))
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

// const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('es-ES', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     })
// }

const goToSeats = (sessionId) => {
    const token = localStorage.getItem('token')

    if (token) {
        navigateTo(`/sessions/${sessionId}/seats`)
    } else {
        navigateTo(`/login?redirect=/sessions/${sessionId}/seats`)
    }
}
</script>