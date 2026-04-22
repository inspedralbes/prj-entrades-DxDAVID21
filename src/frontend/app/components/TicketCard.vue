<template>
  <div class="ticket-card bg-[#1A2238] rounded-xl overflow-hidden shadow-lg">
    <div class="flex flex-col md:flex-row">
      <div class="md:w-1/3 relative">
        <img
          v-if="ticket.movie?.poster_url"
          :src="ticket.movie.poster_url"
          :alt="ticket.movie.title"
          class="w-full h-48 md:h-full object-cover"
        >
        <div v-else class="w-full h-48 md:h-full bg-gray-700 flex items-center justify-center">
          <span class="text-gray-400 text-6xl">🎬</span>
        </div>
        <div
          :class="getStatusClass(ticket.status)"
          class="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold"
        >
          {{ getStatusLabel(ticket.status) }}
        </div>
      </div>

      <div class="flex-1 p-4">
        <h3 class="text-white font-bold text-lg mb-2">{{ ticket.movie?.title }}</h3>

        <div class="space-y-2 mb-4">
          <div class="flex items-center gap-2 text-gray-400 text-sm">
            <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
            <span>{{ formatDate(ticket.session?.date) }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400 text-sm">
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            <span>{{ formatTime(ticket.session?.date) }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-400 text-sm">
            <UIcon name="i-heroicons-building-office" class="w-4 h-4" />
            <span>{{ ticket.session?.cinema_name }} - Sala {{ ticket.session?.room_number }}</span>
          </div>
        </div>

        <div class="border-t border-gray-700 pt-4">
          <div class="text-gray-400 text-sm mb-2">Seients:</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="seat in ticket.seats"
              :key="seat.id"
              class="bg-[#0068C8] text-white text-xs px-2 py-1 rounded"
            >
              {{ seat.row }}{{ seat.number }}
            </span>
          </div>
        </div>

        <div v-if="ticket.status === 'pending'" class="mt-4 flex justify-end">
          <UButton color="primary" size="sm" @click="$emit('showQr', ticket)">
            Mostrar codi QR
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

defineEmits(['showQr'])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
}

function getStatusClass(status) {
  const classes = {
    pending: 'bg-yellow-600 text-white',
    used: 'bg-gray-600 text-gray-300',
    cancelled: 'bg-red-600 text-white'
  }
  return classes[status] || classes.pending
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Pendent',
    used: 'Utilitzada',
    cancelled: 'Cancel·lada'
  }
  return labels[status] || 'Pendent'
}
</script>
