<template>
  <div>
    <AdminCard title="Editar Pel·lícula">
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Títol</label>
            <UInput
              v-model="form.title"
              placeholder="Títol de la pel·lícula"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Gènere</label>
            <UInput
              v-model="form.genre"
              placeholder="Gènere cinematogràfic"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Sinopsi</label>
          <UTextarea
            v-model="form.description"
            placeholder="Descripció de la pel·lícula"
            :rows="4"
            :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Duració (minuts)</label>
            <UInput
              v-model="form.duration"
              type="number"
              placeholder="120"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Data d'estrena</label>
            <UInput
              v-model="form.release_date"
              type="date"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white' }"
              required
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">URL del cartell</label>
          <UInput
            v-model="form.poster_url"
            placeholder="https://example.com/poster.jpg"
            size="lg"
            :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
          />
          <div v-if="form.poster_url" class="mt-4">
            <p class="text-sm text-gray-400 mb-2">Vista prèvia:</p>
            <div class="w-32 h-48 rounded-lg overflow-hidden bg-gray-700 border border-gray-600">
              <img
                :src="form.poster_url"
                alt="Vista prèvia del cartell"
                class="w-full h-full object-cover"
                @error="handleImageError"
              >
            </div>
          </div>
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
          <NuxtLink to="/admin/movies">
            <AdminButton
              variant="ghost"
              size="lg"
            >
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

const imageLoaded = ref(false)
const route = useRoute()
const id = route.params.id
const form = ref({})
const loading = ref(true)
const saving = ref(false)
const moviesApi = useMovies()

onMounted(async () => {
  try {
    const movie = await moviesApi.getMovie(parseInt(id))
    form.value = { ...movie }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  saving.value = true
  try {
    await moviesApi.updateMovie(parseInt(id), {
      ...form.value,
      duration: parseInt(form.value.duration)
    })
    navigateTo('/admin/movies')
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

const handleImageError = (event) => {
  imageLoaded.value = false
  event.target.src = 'https://via.placeholder.com/128x192?text=Error'
}
</script>