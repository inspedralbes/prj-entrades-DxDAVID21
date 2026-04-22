<template>
  <div>
    <AdminCard title="Crear Sala">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Nom de la sala</label>
          <UInput
            v-model="form.name"
            placeholder="Sala 1"
            size="lg"
            :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nombre de files</label>
            <UInput
              v-model="form.rows"
              type="number"
              placeholder="10"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Seients per fila</label>
            <UInput
              v-model="form.seats_per_row"
              type="number"
              placeholder="15"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
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
            Crear sala
          </AdminButton>
          <NuxtLink to="/admin/rooms">
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

const form = ref({
  name: '',
  rows: '',
  seats_per_row: ''
})

const saving = ref(false)
const authStore = useAuthStore()
const roomsApi = useRooms()

onMounted(() => {
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) {
    navigateTo('/')
  }
})

const handleSubmit = async () => {
  saving.value = true
  try {
    await roomsApi.createRoom(form.value)
    navigateTo('/admin/rooms')
  } catch (error) {
    console.error('Error creant:', error)
  } finally {
    saving.value = false
  }
}
</script>