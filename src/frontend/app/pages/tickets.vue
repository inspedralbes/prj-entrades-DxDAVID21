<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-white mb-8 text-center">Les meves entrades</h1>

    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-[#0068C8] animate-spin" />
    </div>

    <div v-else-if="!authStore.isAuthenticated" class="text-center py-16">
      <div class="text-gray-400 text-xl mb-4">Has d'iniciar sessió per veure les teves entrades</div>
      <NuxtLink to="/login">
        <UButton color="primary">
          Iniciar sessió
        </UButton>
      </NuxtLink>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-16">
      <UIcon name="i-heroicons-ticket" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <div class="text-gray-400 text-xl mb-4">No tens entrades</div>
      <NuxtLink to="/movies">
        <UButton color="primary">
          Reservar la teva primera entrada
        </UButton>
      </NuxtLink>
    </div>

    <div v-else>
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-4 justify-end">
          <USelect
            v-model="statusFilter"
            :options="filterOptions"
            placeholder="Filtrar per estat"
            class="w-full sm:w-48"
          />
        </div>
      </div>

      <div v-for="order in filteredOrders" :key="order.id" class="mb-8">
        <div class="bg-[#1A2238] rounded-xl overflow-hidden">
          <div class="bg-[#0A0F1F] px-4 py-3 border-b border-gray-700">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span class="text-white font-semibold text-lg">{{ order.session?.movie?.title }}</span>
                <span class="text-gray-400 ml-2">{{ formatDate(order.session?.start_time) }}</span>
              </div>
              <span
                :class="order.status === 'COMPLETED' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'"
                class="px-3 py-1 rounded text-sm font-medium"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ order.session?.room?.name }} • Comanda #{{ order.id }}
            </div>
          </div>

          <div class="p-4">
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="ticket in order.tickets"
                :key="ticket.id"
                class="bg-[#0A0F1F] rounded-lg p-4 text-center border border-gray-700"
              >
                <div class="text-gray-400 text-sm mb-2">
                  <UIcon name="i-heroicons-chair" class="w-4 h-4 mr-1" />
                  {{ ticket.sessions_seat?.seat?.row_label }}{{ ticket.sessions_seat?.seat?.number }}
                </div>
                <div class="bg-gray-800 p-2 rounded text-xs font-mono text-gray-500 break-all">
                  {{ ticket.qr_code }}
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-700 px-4 py-3 bg-[#0A0F1F]">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">{{ order.tickets?.length }} seients</span>
              <span class="text-[#F7C600] font-bold text-lg">Total: {{ order.total_amount }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const booking = useBooking()

const loading = ref(true)
const orders = ref([])
const statusFilter = ref('')

const filterOptions = ref([
  { label: 'Totes les entrades', value: '' },
  { label: 'Pendents', value: 'PENDING' },
  { label: 'Completades', value: 'COMPLETED' }
])

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    loading.value = false
    return
  }

  try {
    orders.value = await booking.getMyOrders()
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    loading.value = false
  }
})

const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value

  return orders.value.filter(order => order.status === statusFilter.value)
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('ca-ES', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Pendent',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancel·lada'
  }
  return labels[status] || status
}
</script>