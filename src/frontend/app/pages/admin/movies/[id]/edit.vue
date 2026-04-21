<template>
  <div class="p-8">
    <h1 class="text-2xl">Editar</h1>

    <div v-if="loading">Cargando...</div>

    <form v-else @submit.prevent="handleSubmit" class="max-w-lg">
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
        <input
          v-model="form.release_date"
          type="date"
          class="w-full"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block">URL poster</label>
        <input v-model="form.poster_url" type="text" class="w-full" />

        <div v-if="form.poster_url" class="mt-4">
          <p class="text-sm text-gray-500 mb-2">Vista previa:</p>
          <img 
            :src="form.poster_url" 
            alt="Poster preview"
            class="w-32 h-48 object-cover rounded border"
            @error="handleImageError"
            @load="imageLoaded = true"
          />
          <p v-if="!imageLoaded" class="text-red-500 text-sm mt-2">Error: No se pudo cargar la imagen</p>
        </div>
      </div>

      <button type="submit" class="ml-4">Guardar Cambios</button>

      <NuxtLink to="/admin/movies" class="ml-4">Cancelar</NuxtLink>
    </form>
  </div>
</template>

<script setup>
const imageLoaded = ref(false)
const route = useRoute();
const id = route.params.id;
const form = ref({});
const loading = ref(true);
const moviesApi = useMovies();

onMounted(async () => {
  try {
    const movie = await moviesApi.getMovie(parseInt(id));
    form.value = { ...movie };
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  try {
    await moviesApi.updateMovie(parseInt(id), {
      ...form.value,
      duration: parseInt(form.value.duration),
    });

    navigateTo("/admin/movies");
  } catch (e) {
    console.error(e);
    alert("Error al actualizar pelicula");
  }
};
const handleImageError = (event) => {
  imageLoaded.value = false
  event.target.src = 'https://via.placeholder.com/128x192?text=Error'
}
</script>
