<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard de Sessió</h1>
        <p class="text-gray-400">{{ session?.movie?.title }} - {{ session?.room?.name }}</p>
      </div>
      <NuxtLink to="/admin/sessions/">
        <AdminButton variant="ghost" icon="i-heroicons-arrow-left">
          Tornar
        </AdminButton>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <AdminCard title="">
        <div class="text-center">
          <div class="text-sm text-gray-400 mb-1">Usuaris Connectats</div>
          <div class="text-3xl font-bold text-[#0068C8]">{{ connectedUsers }}</div>
        </div>
      </AdminCard>

      <AdminCard title="">
        <div class="text-center">
          <div class="text-sm text-gray-400 mb-1">Seients Disponibles</div>
          <div class="text-3xl font-bold text-green-500">{{ availableSeats }}</div>
          <div class="text-xs text-gray-500">{{ occupancyPercentage }}% ocupació</div>
        </div>
      </AdminCard>

      <AdminCard title="">
        <div class="text-center">
          <div class="text-sm text-gray-400 mb-1">Seients Reservats</div>
          <div class="text-3xl font-bold text-yellow-500">{{ reservedSeats }}</div>
        </div>
      </AdminCard>

      <AdminCard title="">
        <div class="text-center">
          <div class="text-sm text-gray-400 mb-1">Seients Venuts</div>
          <div class="text-3xl font-bold text-purple-500">{{ purchasedSeats }}</div>
        </div>
      </AdminCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <AdminCard title="Mapa de Seients">
          <div class="screen-indicator mb-6">
            <div class="screen bg-gradient-to-r from-transparent via-gray-500 to-transparent h-1 rounded-full relative">
              <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm">PANTALLA</span>
            </div>
          </div>

          <div class="seat-grid flex flex-col items-center gap-2">
            <div
              v-for="rowLabel in orderedRows"
              :key="rowLabel"
              class="seat-row flex items-center gap-1"
            >
              <span class="row-label text-gray-500 text-xs w-6">{{ rowLabel }}</span>
              <div
                v-for="seat in seatsByRow[rowLabel]"
                :key="seat.id"
                :class="getAdminSeatClass(seat)"
                :title="getSeatTooltip(seat)"
                class="seat w-8 h-8 rounded-t-lg text-xs font-medium flex items-center justify-center"
              >
                {{ seat.number }}
              </div>
              <span class="row-label text-gray-500 text-xs w-6">{{ rowLabel }}</span>
            </div>
          </div>

          <div class="legend mt-6 flex flex-wrap gap-4 justify-center">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-green-500 rounded"></div>
              <span class="text-sm text-gray-400">Disponible</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-yellow-500 rounded"></div>
              <span class="text-sm text-gray-400">Reservat</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-purple-500 rounded"></div>
              <span class="text-sm text-gray-400">Vet</span>
            </div>
          </div>
        </AdminCard>
      </div>

      <div class="space-y-6">
        <AdminCard title="Recaptació">
          <div class="text-center">
            <div class="text-4xl font-bold text-green-500">{{ totalRevenue }}€</div>
            <div class="text-sm text-gray-400 mt-1">{{ purchasedSeats }} entrades venudes</div>
          </div>
        </AdminCard>

        <AdminCard title="Activitat Recent">
          <div v-if="recentActivity.length === 0" class="text-gray-500 text-sm text-center py-4">
            No hi ha activitat recent
          </div>
          <div v-else class="space-y-3 max-h-64 overflow-y-auto">
            <div
              v-for="(activity, index) in recentActivity"
              :key="index"
              class="pb-3 border-b border-gray-700 last:border-0"
              :class="getActivityClass(activity.type)"
            >
              <div class="font-medium text-white text-sm">{{ activity.message }}</div>
              <div class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</div>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const sessionId = parseInt(route.params.id)

const authStore = useAuthStore()

const session = ref(null)
const seats = ref([])
const connectedUsers = ref(0)
const recentActivity = ref([])
const totalRevenue = ref(0)

const publicSessions = usePublicSessions()
const adminSessions = useSessions()
const socketInstance = useSocket()
let rawSocket = null

const availableSeats = computed(() =>
  seats.value.filter(s => s.status === 'available').length
)

const reservedSeats = computed(() =>
  seats.value.filter(s => s.status === 'blocked').length
)

const purchasedSeats = computed(() =>
  seats.value.filter(s => s.status === 'purchased').length
)

const occupancyPercentage = computed(() => {
  if (seats.value.length === 0) return 0
  return Math.round((purchasedSeats.value / seats.value.length) * 100)
})

const seatsByRow = computed(() => {
  const rows = {}
  seats.value.forEach(seat => {
    if (!rows[seat.row_label]) {
      rows[seat.row_label] = []
    }
    rows[seat.row_label].push(seat)
  })
  Object.keys(rows).forEach(row => {
    rows[row].sort((a, b) => a.number - b.number)
  })
  return rows
})

const orderedRows = computed(() => Object.keys(seatsByRow.value).sort())

onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    router.push('/login')
    return
  }

  try {
    const data = await publicSessions.getSessionSeats(sessionId)
    session.value = data.session
    seats.value = data.seats
    const basePrice = parseFloat(session.value?.price || 0)
    totalRevenue.value = data.seats
      .filter(s => s.status === 'purchased')
      .reduce((sum, s) => sum + (basePrice * (s.price_modifier || 1)), 0)

    rawSocket = socketInstance.connect(sessionId)

    rawSocket.on('users:count', (data) => {
      if (data.sessionId === sessionId) {
        connectedUsers.value = data.count
      }
    })

    rawSocket.on('seat:status', (data) => {
      if (data.sessionId === sessionId) {
        const seat = seats.value.find(s => s.id === data.seatId)
        if (seat) {
          seat.status = data.status
          if (data.blockedBy) {
            seat.blocked_by = data.blockedBy
            seat.lock_expires_at = data.lockedUntil
          }
        }

        if (data.status === 'purchased') {
          totalRevenue.value += parseFloat(session.value?.price || 0)
        }
      }
    })

    rawSocket.on('activity', (data) => {
      if (data.sessionId === sessionId) {
        recentActivity.value.unshift(data)
        if (recentActivity.value.length > 20) {
          recentActivity.value.pop()
        }
      }
    })
  } catch (error) {
    console.error('Error loading session:', error)
  }
})

onUnmounted(() => {
  if (socketInstance) {
    socketInstance.disconnect()
  }
})

const getAdminSeatClass = (seat) => {
  switch (seat.status) {
    case 'purchased':
      return 'bg-purple-500 text-white cursor-not-allowed'
    case 'blocked':
      return 'bg-yellow-500 text-white'
    default:
      return 'bg-green-500 text-white hover:bg-green-600'
  }
}

const getSeatTooltip = (seat) => {
  let tooltip = `Fila ${seat.row_label}, Seient ${seat.number}`

  if (seat.status === 'blocked') {
    tooltip += `\nReservat per usuari #${seat.blocked_by}`
    if (seat.lock_expires_at) {
      tooltip += `\nExpira: ${new Date(seat.lock_expires_at).toLocaleTimeString()}`
    }
  } else if (seat.status === 'purchased') {
    tooltip += '\nEstat: Vt'
  } else {
    tooltip += '\nEstat: Disponible'
  }

  return tooltip
}

const getActivityClass = (type) => {
  switch (type) {
    case 'seats_purchased': return 'text-purple-500'
    case 'seat_blocked': return 'text-yellow-500'
    case 'seat_released': return 'text-green-500'
    default: return 'text-gray-400'
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('ca-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.seat-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.row-label {
  width: 24px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}
</style>