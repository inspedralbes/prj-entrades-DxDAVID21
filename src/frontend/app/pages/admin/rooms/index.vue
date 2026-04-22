<template>
  <div>
    <AdminCard title="Gestió de Sales">
      <template #actions>
        <NuxtLink to="/admin/rooms/create">
          <AdminButton color="primary" icon="i-heroicons-plus">
            Afegir sala
          </AdminButton>
        </NuxtLink>
      </template>

      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
      </div>

      <AdminTable
        v-else-if="rooms && rooms.length > 0"
        :columns="columns"
        :data="rooms"
      >
        <template #cell-name="{ row }">
          <span class="font-medium text-white">{{ row.name }}</span>
        </template>

        <template #cell-capacity="{ row }">
          <AdminBadge color="info">{{ row.capacity }} localitats</AdminBadge>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2 justify-end">
            <NuxtLink :to="`/admin/rooms/${row.id}/edit`">
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
        No hi ha sales
      </div>
    </AdminCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

const authStore = useAuthStore()
const rooms = ref(null)
const loading = ref(true)
const roomsApi = useRooms()

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nom' },
  { key: 'capacity', label: 'Capacitat' },
  { key: 'actions', label: '', align: 'right' }
]

onMounted(async () => {
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) {
    navigateTo('/')
    return
  }

  try {
    rooms.value = await roomsApi.getRooms()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const handleDelete = async (id) => {
  if (confirm('Estàs segur d\'eliminar aquesta sala?')) {
    try {
      await roomsApi.deleteRoom(id)
      rooms.value = await roomsApi.getRooms()
    } catch (error) {
      console.error('Error eliminant:', error)
    }
  }
}
</script>