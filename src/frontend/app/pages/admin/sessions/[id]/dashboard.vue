<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Panell d'Administració</h1>
        <p class="text-gray-600">{{ session?.movie?.title }} - {{ session?.room?.name }}</p>
      </div>
      <NuxtLink
        :to="`/admin/sessions/`"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Tornar
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white border rounded-lg p-4">
        <div class="text-sm text-gray-500">Usuaris Connectats</div>
        <div class="text-3xl font-bold text-blue-600">{{ connectedUsers }}</div>
      </div>

      <div class="bg-white border rounded-lg p-4">
        <div class="text-sm text-gray-500">Seients Disponibles</div>
        <div class="text-3xl font-bold text-green-600">{{ availableSeats }}</div>
        <div class="text-sm text-gray-400">{{ occupancyPercentage }}% ocupacio</div>
      </div>

      <div class="bg-white border rounded-lg p-4">
        <div class="text-sm text-gray-500">Seients Reservats</div>
        <div class="text-3xl font-bold text-yellow-600">{{ reservedSeats }}</div>
      </div>

      <div class="bg-white border rounded-lg p-4">
        <div class="text-sm text-gray-500">Seients Venuts</div>
        <div class="text-3xl font-bold text-purple-600">{{ purchasedSeats }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-4">Mapa de Seients</h2>
          
          <div class="bg-gray-800 text-white text-center py-2 mb-4 rounded">
            PANTALLA
          </div>

          <div class="seat-grid">
            <div v-for="rowLabel in orderedRows" :key="rowLabel" class="seat-row">
              <span class="row-label">{{ rowLabel }}</span>
              <div class="seats">
                <div
                  v-for="seat in seatsByRow[rowLabel]"
                  :key="seat.id"
                  :class="getAdminSeatClass(seat)"
                  :title="getSeatTooltip(seat)"
                >
                  {{ seat.number }}
                </div>
              </div>
            </div>
          </div>

          <div class="legend mt-4 flex flex-wrap gap-4 justify-center">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-green-500 rounded"></div>
              <span class="text-sm">Disponible</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-yellow-500 rounded"></div>
              <span class="text-sm">Reservat (Usuari #{{ seat?.blocked_by }})</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-purple-500 rounded"></div>
              <span class="text-sm">Vdut</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="bg-white border rounded-lg p-4 mb-4">
          <h2 class="text-lg font-semibold mb-4">Recaptacio</h2>
          <div class="text-3xl font-bold text-green-600">{{ totalRevenue }}€</div>
          <div class="text-sm text-gray-500 mt-1">{{ purchasedSeats }} entrades venudes</div>
        </div>

        <div class="bg-white border rounded-lg p-4">
          <h2 class="text-lg font-semibold mb-4">Activitat Recent</h2>
          <div v-if="recentActivity.length === 0" class="text-gray-500 text-sm">
            No hi ha activitat recent
          </div>
          <div v-else class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="(activity, index) in recentActivity"
              :key="index"
              class="text-sm border-b pb-2"
              :class="getActivityClass(activity.type)"
            >
              <div class="font-medium">{{ activity.message }}</div>
              <div class="text-xs text-gray-500">{{ formatTime(activity.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  const baseClass = 'seat w-8 h-8 rounded text-xs font-medium'
  
  switch (seat.status) {
    case 'purchased':
      return `${baseClass} bg-purple-500 text-white cursor-not-allowed`
    case 'blocked':
      return `${baseClass} bg-yellow-500 text-white`
    default:
      return `${baseClass} bg-green-500 text-white hover:bg-green-600`
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
    tooltip += '\nEstat: Venut'
  } else {
    tooltip += '\nEstat: Disponible'
  }
  
  return tooltip
}

const getActivityClass = (type) => {
  switch (type) {
    case 'seats_purchased': return 'text-purple-600'
    case 'seat_blocked': return 'text-yellow-600'
    case 'seat_released': return 'text-green-600'
    default: return 'text-gray-600'
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
.seat-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-label {
  width: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.seats {
  display: flex;
  gap: 4px;
}

.seat {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>