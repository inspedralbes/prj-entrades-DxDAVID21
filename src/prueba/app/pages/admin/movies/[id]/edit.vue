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
      </div>

      <button type="submit" class="ml-4">Guardar Cambios</button>

      <NuxtLink to="/admin/movies" class="ml-4">Cancelar</NuxtLink>
    </form>
  </div>
</template>

<script setup>
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
</script>
