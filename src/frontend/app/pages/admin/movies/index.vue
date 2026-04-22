<template>
  <div>
    <AdminCard title="Gestió de Pel·lícules">
      <template #actions>
        <NuxtLink to="/admin/movies/create">
          <AdminButton color="primary" icon="i-heroicons-plus">
            Afegir pel·lícula
          </AdminButton>
        </NuxtLink>
      </template>

      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
      </div>

      <AdminTable
        v-else-if="movies && movies.length > 0"
        :columns="columns"
        :data="movies"
      >
        <template #cell-poster="{ row }">
          <div class="w-16 h-24 rounded-lg overflow-hidden bg-gray-700">
            <img
              v-if="row.poster_url"
              :src="row.poster_url"
              :alt="row.title"
              class="w-full h-full object-cover"
              @error="handleImageError($event)"
            >
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-500 text-xs">Sense imatge</span>
            </div>
          </div>
        </template>

        <template #cell-title="{ row }">
          <span class="font-medium text-white">{{ row.title }}</span>
        </template>

        <template #cell-genre="{ row }">
          <AdminBadge color="info">{{ row.genre }}</AdminBadge>
        </template>

        <template #cell-duration="{ row }">
          <span class="text-gray-400">{{ row.duration }} min</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2 justify-end">
            <NuxtLink :to="`/admin/movies/${row.id}/edit`">
              <AdminButton variant="outline" size="sm" icon="i-heroicons-pencil">
                Editar
              </AdminButton>
            </NuxtLink>
            <AdminButton
              variant="ghost"
              color="error"
              size="sm"
              icon="i-heroicons-trash"
              @click="handleDelete(row.id)"
            >
              Eliminar
            </AdminButton>
          </div>
        </template>
      </AdminTable>

      <div v-else class="text-center py-12 text-gray-500">
        No hi ha pel·lícules
      </div>
    </AdminCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const movies = ref(null)
const loading = ref(true)
const moviesApi = useMovies()

const columns = [
  { key: 'poster', label: '', align: 'center' },
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Títol' },
  { key: 'genre', label: 'Gènere' },
  { key: 'duration', label: 'Duració' },
  { key: 'actions', label: '', align: 'right' }
]

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
  if (confirm('Estàs segur d\'eliminar aquesta pel·lícula?')) {
    try {
      await moviesApi.deleteMovie(id)
      movies.value = await moviesApi.getMovies()
    } catch (error) {
      console.error('Error eliminant:', error)
    }
  }
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/64x96?text=Error'
}
</script>