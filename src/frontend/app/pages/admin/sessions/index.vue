<template>
  <div>
    <AdminCard title="Gestió de Sessions">
      <template #actions>
        <NuxtLink to="/admin/sessions/create">
          <AdminButton color="primary" icon="i-heroicons-plus">
            Afegir sessió
          </AdminButton>
        </NuxtLink>
      </template>

      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
      </div>

      <AdminTable
        v-else-if="sessions && sessions.length > 0"
        :columns="columns"
        :data="sessions"
      >
        <template #cell-movie="{ row }">
          <span class="font-medium text-white">{{ row.movie?.title }}</span>
        </template>

        <template #cell-room="{ row }">
          <AdminBadge color="info">{{ row.room?.name }}</AdminBadge>
        </template>

        <template #cell-start_time="{ row }">
          <span class="text-gray-400">{{ formatDate(row.start_time) }}</span>
        </template>

        <template #cell-price="{ row }">
          <span class="text-[#F7C600] font-semibold">{{ row.price }}€</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2 justify-end">
            <NuxtLink :to="`/admin/sessions/${row.id}/dashboard`">
              <AdminButton variant="outline" size="sm" icon="i-heroicons-chart-bar">
                Dashboard
              </AdminButton>
            </NuxtLink>
            <NuxtLink :to="`/admin/sessions/${row.id}/edit`">
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
        No hi ha sessions
      </div>
    </AdminCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const sessions = ref(null)
const loading = ref(true)
const sessionsApi = useSessions()

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'movie', label: 'Pel·lícula' },
  { key: 'room', label: 'Sala' },
  { key: 'start_time', label: 'Hora d\'inici' },
  { key: 'price', label: 'Preu' },
  { key: 'actions', label: '', align: 'right' }
]

onMounted(async () => {
  authStore.initFromStorage()

  if (!authStore.isAuthenticated) {
    navigateTo('/')
    return
  }

  try {
    sessions.value = await sessionsApi.getSessions()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('ca-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleDelete = async (id) => {
  if (confirm('Estàs segur d\'eliminar aquesta sessió?')) {
    try {
      await sessionsApi.deleteSession(id)
      sessions.value = await sessionsApi.getSessions()
    } catch (error) {
      console.error('Error eliminant:', error)
    }
  }
}
</script>