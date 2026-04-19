<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="loading" class="text-center py-12">
      <p>Cargant sales...</p>
    </div>

    <div v-else-if="session">
      <div class="mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold">{{ session.movie?.title }}</h1>
            <div class="flex gap-4 text-gray-600 mt-2">
              <span>{{ session.room?.name }}</span>
              <span>{{ formatDate(session.start_time) }}</span>
              <span class="font-semibold text-green-600">{{ price }}€</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Usuaris connectats</div>
            <div class="text-2xl font-bold text-blue-600">{{ connectedUsers }}</div>
          </div>
        </div>
      </div>

      <div v-if="notification" class="mb-4 p-3 rounded" :class="notificationClass">
        {{ notification }}
      </div>

      <div class="bg-gray-800 text-white text-center py-2 mb-8 rounded">
        PANTALLA
      </div>

      <div class="seat-grid mb-8">
        <div v-for="rowLabel in orderedRows" :key="rowLabel" class="seat-row">
          <span class="row-label">{{ rowLabel }}</span>
          <div class="seats">
            <button
              v-for="seat in seatsByRow[rowLabel]"
              :key="seat.id"
              :disabled="seat.status === 'purchased' || (seat.status === 'blocked' && !isMyBlockedSeat(seat))"
              :class="getSeatClass(seat)"
              @click="handleSeatClick(seat)"
              :title="`Row ${seat.row_label}, Seat ${seat.number} - ${seat.status}`"
            >
              {{ seat.number }}
            </button>
          </div>
        </div>
      </div>

      <div class="legend mb-6">
        <div class="flex gap-4 justify-center flex-wrap">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gray-300 rounded"></div>
            <span>Disponible</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-green-500 rounded"></div>
            <span>Seleccionat</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-red-500 rounded"></div>
            <span>Bloquejat{{ blockedTimeRemaining ? ` (${blockedTimeRemaining})` : '' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gray-600 rounded"></div>
            <span>Vdut</span>
          </div>
        </div>
      </div>

      <div class="summary border-t pt-4">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-lg">Seients seleccionats: {{ selectedSeats.length }}</span>
            <span class="text-xl font-bold ml-4">{{ total }}€</span>
          </div>
          <button
            v-if="selectedSeats.length > 0"
            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            :disabled="processing"
            @click="proceedToCheckout"
          >
            {{ processing ? 'Processant...' : 'Continuar al Pagament' }}
          </button>
        </div>
      </div>

      <div v-if="recentActivity.length > 0" class="mt-6 border-t pt-4">
        <h3 class="text-sm font-semibold text-gray-500 mb-2">Activitat recent</h3>
        <div class="space-y-1">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="text-sm text-gray-600"
          >
            {{ activity }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p>Sessio no trobada</p>
      <NuxtLink to="/movies" class="text-blue-500 hover:underline">Tornar a pel.licules</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useBookingStore } from '~/stores/booking'

const route = useRoute()
const router = useRouter()
const sessionId = parseInt(route.params.id)

const authStore = useAuthStore()
const bookingStore = useBookingStore()

const loading = ref(true)
const processing = ref(false)
const blockedTimeRemaining = ref('')
const connectedUsers = ref(0)
const notification = ref('')
const notificationType = ref('info')
const recentActivity = ref([])
let countdownInterval = null
let notificationTimeout = null

const session = ref(null)
// const seats = computed(() => booking.seats)
const selectedSeats = ref([])
const price = ref(12)

const publicSessions = usePublicSessions()
const booking = useBooking()
const socketInstance = useSocket()
let rawSocket = null

onMounted(async () => {
    try {
        const data = await publicSessions.getSessionSeats(sessionId)
        session.value = data.session
        // seats.value = data.seats
        price.value = data.price

        bookingStore.setSessionData(data.session, data.seats, data.price)
        selectedSeats.value = []

        rawSocket = socketInstance.connect(sessionId)

        rawSocket.on('users:count', (data) => {
            if (data.sessionId === sessionId) {
                connectedUsers.value = data.count
            }
        })

        rawSocket.on('activity', (data) => {
            if (data.sessionId === sessionId && data.userId !== authStore.user?.id) {
                addActivity(data.message)

                if (data.type === 'seats_purchased') {
                    showNotification(`S\'han venut ${data.seatIds?.length || 1} seient(s)!`, 'warning')
                }
            }
        })

        rawSocket.on('seat:status', (data) => {
            if (data.sessionId === sessionId) {
                // Actualizar el estado del asiento en la tienda
                bookingStore.updateSeatStatus(data.seatId, data.status)

                if (data.status === 'blocked' && data.blockedBy !== authStore.user?.id) {
                    showNotification(`Un altre usuari ha bloquejat un seient`, 'info')
                } else if (data.status === 'purchased') {
                    showNotification(`Un asient ha estat venut!`, 'warning')
                }
            }
        })

    } catch (error) {
        console.error('Error loading session:', error)
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    socketInstance.disconnect()
    if (countdownInterval) {
        clearInterval(countdownInterval)
    }
    if (notificationTimeout) {
        clearTimeout(notificationTimeout)
    }
})

const seatsByRow = computed(() => bookingStore.getSeatsByRow)
const orderedRows = computed(() => Object.keys(seatsByRow.value).sort())
const total = computed(() => selectedSeats.value.length * price.value)

const notificationClass = computed(() => {
    switch (notificationType.value) {
        case 'success': return 'bg-green-100 text-green-800 border border-green-300'
        case 'warning': return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
        case 'error': return 'bg-red-100 text-red-800 border border-red-300'
        default: return 'bg-blue-100 text-blue-800 border border-blue-300'
    }
})

const showNotification = (message, type = 'info') => {
    notification.value = message
    notificationType.value = type

    if (notificationTimeout) {
        clearTimeout(notificationTimeout)
    }

    notificationTimeout = setTimeout(() => {
        notification.value = ''
    }, 5000)
}

const addActivity = (message) => {
    const timestamp = new Date().toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
    recentActivity.value.unshift(`[${timestamp}] ${message}`)
    if (recentActivity.value.length > 5) {
        recentActivity.value.pop()
    }
}

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('ca-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const getSeatClass = (seat) => {
    const baseClass = 'seat w-8 h-8 rounded text-xs font-medium transition-colors'

    if (seat.status === 'purchased') {
        return `${baseClass} bg-gray-600 text-gray-400 cursor-not-allowed`
    }

    if (isMyBlockedSeat(seat)) {
        return `${baseClass} bg-red-500 text-white`
    }

    if (seat.status === 'blocked') {
        return `${baseClass} bg-red-300 text-red-800 cursor-not-allowed`
    }

    if (selectedSeats.value.includes(seat.id)) {
        return `${baseClass} bg-green-500 text-white hover:bg-green-600`
    }

    return `${baseClass} bg-gray-300 text-gray-700 hover:bg-gray-400`
}

const isMyBlockedSeat = (seat) => {
    return seat.blocked_by === authStore.user?.id
}

const handleSeatClick = async (seat) => {
    if (seat.status === 'blocked' && !isMyBlockedSeat(seat)) {
        showNotification('Aquest seient esta bloquejat per un altre usuari', 'warning')
        return
    }

    if (seat.status === 'purchased') {
        showNotification('Aquest seient ya esta venut', 'error')
        return
    }

    const index = selectedSeats.value.indexOf(seat.id)
    if (index > -1) {
        selectedSeats.value.splice(index, 1)
        bookingStore.toggleSeat(seat.id)
    } else {
        selectedSeats.value.push(seat.id)
        bookingStore.toggleSeat(seat.id)
    }
}

const proceedToCheckout = async () => {
    if (selectedSeats.value.length === 0) return

    processing.value = true

    try {
        const result = await booking.blockSeats(sessionId, selectedSeats.value)

        if (result.session_seats) {
            result.session_seats.forEach((seatData) => {
                socketInstance.emitSeatBlock(sessionId, seatData.id, result.expires_at)
            })

            bookingStore.setBlockedSeats(result.session_seats, result.expires_at)

            const expiresAt = new Date(result.expires_at)
            startCountdown(expiresAt)

            showNotification('Seients bloquejats! Tens 15 minuts per completar la compra.', 'success')

            setTimeout(() => {
                router.push('/checkout')
            }, 1500)
        }
    } catch (error) {
        console.error('Error blocking seats:', error)
        showNotification(error.data?.message || 'Error en bloquejar els seients', 'error')
    } finally {
        processing.value = false
    }
}

const startCountdown = (expiresAt) => {
    const update = () => {
        const now = new Date()
        const diff = expiresAt - now

        if (diff <= 0) {
            blockedTimeRemaining.value = 'Expirat!'
            if (countdownInterval) {
                clearInterval(countdownInterval)
            }

            selectedSeats.value.forEach((seatId) => {
                socketInstance.emitSeatRelease(sessionId, seatId)
            })
            bookingStore.clearSelection()

            showNotification('Temps expirat! Els seients s\'han alliberat.', 'error')

            setTimeout(() => {
                router.push('/movies')
            }, 2000)
            return
        }

        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        blockedTimeRemaining.value = `${minutes}:${seconds.toString().padStart(2, '0')}`

        if (diff <= 60000) {
            blockedTimeRemaining.value = `Expire aviat: ${blockedTimeRemaining.value}`
        }
    }

    update()
    countdownInterval = setInterval(update, 1000)
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