<template>
    <div class="p-8">
        <h1 class="text-2xl">Crear pelicules</h1>

        <form @submit.prevent="handleSubmit" class="max-w-lg">
            <div class="mb-4">
                <label class="block">Titulo</label>
                <input v-model="form.title" type="text" class="w-full" required />
            </div>

            <div class="mb-4">
                <label class="block">Description</label>
                <textarea v-model="form.description" class="w-full"></textarea>
            </div>

            <div class="mb-4">
                <label class="block">Genero</label>
                <input v-model="form.genre" type="text" class="w-full" required />
            </div>

            <div class="mb-4">
                <label class="block">Duracion (minutos)</label>
                <input v-model="form.duration" type="number" class="w-full" required />
            </div>

            <div class="mb-4">
                <label class="block">Fecha de estreno</label>
                <input v-model="form.release_date" type="date" class="w-full" required />
            </div>

            <div class="mb-4">
                <label class="block">URL poster</label>
                <input v-model="form.poster_url" type="text" class="w-full"/>

                <div class="mt-4">
                    <p class="text-sm">Vista previa:</p>
                    <img 
                        :src="form.poster_url" 
                        alt="Poster preview"
                        class="w-32 h-48 object-cover rounded border"    
                    >
                </div>
            </div>

            <button type="submit" class="bg-blue-500">
                Crear pelicula
            </button>

            <NuxtLink to="/admin/movies" class="ml-4">Cancelar</NuxtLink>
        </form>
    </div>
</template>

<script setup>
    const form = ref({
        title: '',
        description: '',
        genre: '',
        duration: '',
        release_date: '',
        poster_url: ''
    })

    const moviesApi = useMovies()

    const handleSubmit = async () => {
        try {
            await moviesApi.createMovie({
                ...form.value,
                duration: parseInt(form.value.duration)
            })
            navigateTo('/admin/movies')
        } catch (e) {
            console.error(e)
            alert('Error al crear pelicula')
        }
    }
</script>