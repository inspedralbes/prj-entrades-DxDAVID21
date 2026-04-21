<template>
  <div class="p-8">
    <div class="flex">
      <h1 class="text-2xl">Peliculas</h1>
      <NuxtLink to="/admin/movies/create" class="bg-blue-500"
        >Nueva pelicula</NuxtLink
      >
    </div>
    <div v-if="loading">Cargando ...</div>

    <div v-else-if="movies && movies.length > 0">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200">
            <th class="border">ID</th>
            <th class="border">Titulo</th>
            <th class="border">Genero</th>
            <th class="border">Duracion</th>
            <th class="border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in movies" :key="movie.id" class="text-center">
            <td class="border">
              <img
                v-if="movie.poster_url" 
                :src="movie.poster_url" 
                :alt="movie.poster_url"
                class="w-16 h-24 object-cover mx-auto rounded"
                @error="handleImageErro($event)" 
              >
              <span v-else class="text-gray-400 text-xs">Sin poster</span>
            </td>
            <td class="border">{{ movie.id }}</td>
            <td class="border">{{ movie.title }}</td>
            <td class="border">{{ movie.genre }}</td>
            <td class="border">{{ movie.duration }}</td>
            <td class="border">
              <NuxtLink
                :to="`/admin/movies/${movie.id}/edit`"
                class="text-blue-500"
                >Editar</NuxtLink
              >
              <button @click="handleDelete(movie.id)" class="text-red-500"
                >Eliminar</button
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>No hay peliculas</div>
  </div>
</template>

<script setup>
    const movies = ref(null)
    const loading = ref(true)
    const moviesApi = useMovies()

    onMounted(async () => {
        try {
            movies.value = await moviesApi.getMovies()
        } catch (e) {
            console.error(e)
        } finally {
            loading.value = false
        }
    })

    const handleDelete = async (id) => {
        if (confirm('Estas seguro de eliminar esta pelicula')) {
            await moviesApi.deleteMovie(id)
            movies.value = await moviesApi.getMovies()
        }
    }
    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/64x96?text=Error'
    }
</script> 