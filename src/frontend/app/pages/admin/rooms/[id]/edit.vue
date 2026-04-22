<template>
  <div>
    <AdminCard title="Editar Sala">
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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

const route = useRoute()
const id = route.params.id
const form = ref({})
const loading = ref(true)
const saving = ref(false)
const roomsApi = useRooms()
const authStore = useAuthStore()

onMounted(async () => {
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) {
    navigateTo('/')
    return
  }

  try {
    const room = await roomsApi.getRoom(parseInt(id))
    form.value = { ...room }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  saving.value = true
  try {
    await roomsApi.updateRoom(parseInt(id), form.value)
    navigateTo('/admin/rooms')
  } catch (error) {
    console.error('Error actualitzant:', error)
  } finally {
    saving.value = false
  }
}
</script>