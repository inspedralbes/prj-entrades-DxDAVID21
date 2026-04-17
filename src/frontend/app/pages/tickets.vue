<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">My Tickets</h1>

    <div v-if="loading" class="text-center py-12">
      <p>Cargant...</p>
    </div>

    <div v-else-if="!authStore.isAuthenticated" class="text-center py-12">
      <p class="text-gray-600 mb-4">Please login to view your tickets</p>
      <NuxtLink to="/login" class="text-blue-500 hover:underline">Login</NuxtLink>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-12">
      <p class="text-gray-600 mb-4">No tickets yet</p>
      <NuxtLink to="/movies" class="text-blue-500 hover:underline">Book your first movie</NuxtLink>
    </div>

    <div v-else>
      <div v-for="order in orders" :key="order.id" class="mb-8">
        <div class="bg-white border rounded-lg overflow-hidden">
          <div class="bg-gray-100 px-4 py-3 border-b">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-semibold">{{ order.session?.movie?.title }}</span>
                <span class="text-gray-600 ml-2">{{ formatDate(order.session?.start_time) }}</span>
              </div>
              <span
                :class="order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                class="px-3 py-1 rounded text-sm"
              >
                {{ order.status }}
              </span>
            </div>
            <div class="text-sm text-gray-600 mt-1">
              {{ order.session?.room?.name }} • Order #{{ order.id }}
            </div>
          </div>

          <div class="p-4">
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="ticket in order.tickets"
                :key="ticket.id"
                class="border rounded p-4 text-center"
              >
                <div class="text-sm text-gray-600 mb-2">Seat {{ ticket.sessions_seat?.seat?.row_label }}{{ ticket.sessions_seat?.seat?.number }}</div>
                <div class="bg-gray-100 p-2 rounded text-xs font-mono">{{ ticket.qr_code }}</div>
              </div>
            </div>
          </div>

          <div class="border-t px-4 py-3 bg-gray-50">
            <div class="flex justify-between">
              <span>{{ order.tickets?.length }} seats</span>
              <span class="font-bold">Total: {{ order.total_amount }}€</span>
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

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleString('es-ES', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
</script>