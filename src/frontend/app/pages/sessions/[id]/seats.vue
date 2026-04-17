<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="loading" class="text-center py-12">
      <p>Cargant sales...</p>
    </div>

    <div v-else-if="session">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">{{ session.movie?.title }}</h1>
        <div class="flex gap-4 text-gray-600 mt-2">
          <span>{{ session.room?.name }}</span>
          <span>{{ formatDate(session.start_time) }}</span>
          <span class="font-semibold text-green-600">{{ price }}€</span>
        </div>
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
              :title="`Row ${seat.row_label}, Seat ${seat.number}`"
            >
              {{ seat.number }}
            </button>
          </div>
        </div>
      </div>

      <div class="legend mb-6">
        <div class="flex gap-4 justify-center">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-green-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-red-500 rounded"></div>
            <span>Blocked{{ blockedTimeRemaining ? ` (${blockedTimeRemaining})` : '' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-gray-600 rounded"></div>
            <span>Purchased</span>
          </div>
        </div>
      </div>

      <div class="summary border-t pt-4">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-lg">Selected: {{ selectedSeats.length }} seats</span>
            <span class="text-xl font-bold ml-4">{{ total }}€</span>
          </div>
          <button
            v-if="selectedSeats.length > 0"
            class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            :disabled="processing"
            @click="proceedToCheckout"
          >
            {{ processing ? 'Processing...' : 'Proceed to Pay' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p>Session not found</p>
      <NuxtLink to="/movies" class="text-blue-500 hover:underline">Back to movies</NuxtLink>
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
let countdownInterval = null

const session = ref(null)
const seats = ref([])
const selectedSeats = ref([])
const price = ref(12)

const publicSessions = usePublicSessions()
const booking = useBooking()
const socket = useSocket()

onMounted(async () => {
    try {
        const data = await publicSessions.getSessionSeats(sessionId)
        session.value = data.session
        seats.value = data.seats
        price.value = data.price

        bookingStore.setSessionData(data.session, data.seats, data.price)
        selectedSeats.value = []

        socket.connect(sessionId)
    } catch (error) {
        console.error('Error loading session:', error)
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    socket.disconnect()
    if (countdownInterval) {
        clearInterval(countdownInterval)
    }
})

const seatsByRow = computed(() => bookingStore.getSeatsByRow)
const orderedRows = computed(() => Object.keys(seatsByRow.value).sort())
const total = computed(() => selectedSeats.value.length * price.value)

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('es-ES', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
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
        return
    }

    const index = selectedSeats.value.indexOf(seat.id)
    if (index > -1) {
        selectedSeats.value.splice(index, 1)
    } else {
        selectedSeats.value.push(seat.id)
    }
    bookingStore.toggleSeat(seat.id)
}

const proceedToCheckout = async () => {
    if (selectedSeats.value.length === 0) return

    processing.value = true

    try {
        const result = await booking.blockSeats(sessionId, selectedSeats.value)

        if (result.session_seats) {
            bookingStore.setBlockedSeats(result.session_seats, result.expires_at)

            const expiresAt = new Date(result.expires_at)
            startCountdown(expiresAt)

            router.push('/checkout')
        }
    } catch (error) {
        console.error('Error blocking seats:', error)
        alert(error.data?.message || 'Error blocking seats')
    } finally {
        processing.value = false
    }
}

const startCountdown = (expiresAt) => {
    const update = () => {
        const now = new Date()
        const diff = expiresAt - now

        if (diff <= 0) {
            blockedTimeRemaining.value = 'Expired'
            if (countdownInterval) {
                clearInterval(countdownInterval)
            }
            return
        }

        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        blockedTimeRemaining.value = `${minutes}:${seconds.toString().padStart(2, '0')}`

        if (diff <= 60000) {
            blockedTimeRemaining.value = `Expire soon: ${blockedTimeRemaining.value}`
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