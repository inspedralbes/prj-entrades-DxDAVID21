<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <div v-if="!hasBlockedSeats" class="text-center py-12">
      <p class="text-gray-600 mb-4">No seats selected</p>
      <NuxtLink to="/movies" class="text-blue-500 hover:underline">Browse sessions</NuxtLink>
    </div>

    <div v-else>
      <div class="bg-white border rounded-lg p-4 mb-6">
        <h2 class="font-semibold mb-4">Session Details</h2>
        <div class="space-y-2 text-gray-600">
          <p><span class="font-medium">Movie:</span> {{ session?.movie?.title }}</p>
          <p><span class="font-medium">Room:</span> {{ session?.room?.name }}</p>
          <p><span class="font-medium">Date:</span> {{ formatDate(session?.start_time) }}</p>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-4 mb-6">
        <h2 class="font-semibold mb-4">Selected Seats</h2>
        <div class="space-y-2">
          <div
            v-for="seatId in blockedSeats"
            :key="seatId"
            class="flex justify-between items-center py-2 border-b last:border-b-0"
          >
            <span>Row {{ getSeatRow(seatId) }}, Seat {{ getSeatNumber(seatId) }}</span>
            <span class="font-medium">{{ price }}€</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4 pt-4 border-t">
          <span class="text-lg font-semibold">Total</span>
          <span class="text-xl font-bold text-green-600">{{ total }}€</span>
        </div>
      </div>

      <div v-if="expiresAt" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p class="text-yellow-800">
          Seats will expire in: <span class="font-bold">{{ timeRemaining }}</span>
        </p>
      </div>

      <div class="flex gap-4">
        <button
          class="flex-1 bg-gray-500 text-white py-3 rounded hover:bg-gray-600 disabled:opacity-50"
          :disabled="processing"
          @click="cancelOrder"
        >
          Cancel
        </button>
        <button
          class="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
          :disabled="processing"
          @click="payNow"
        >
          {{ processing ? 'Processing...' : 'Pay Now' }}
        </button>
      </div>
    </div>

    <div v-if="paymentSuccess" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <p class="text-green-800 font-semibold">Payment successful!</p>
      <p class="text-green-600 mt-2">Your tickets are ready.</p>
      <NuxtLink to="/tickets" class="block mt-4 text-center text-green-700 hover:underline">
        View My Tickets
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from '~/stores/booking'

const router = useRouter()
const bookingStore = useBookingStore()
const booking = useBooking()

const processing = ref(false)
const paymentSuccess = ref(false)
const timeRemaining = ref('')
let countdownInterval = null

const session = computed(() => bookingStore.session)
const blockedSeats = computed(() => bookingStore.selectedSeats)
const price = computed(() => bookingStore.price)
const total = computed(() => blockedSeats.value.length * price.value)
const expiresAt = computed(() => bookingStore.expiresAt)

const hasBlockedSeats = computed(() => blockedSeats.value.length > 0)

onMounted(() => {
    if (!session.value || blockedSeats.value.length === 0) {
        router.push('/movies')
        return
    }

    if (expiresAt.value) {
        startCountdown(new Date(expiresAt.value))
    }
})

onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
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

const getSeatRow = (seatId) => {
    const seat = bookingStore.seats.find((s) => s.id === seatId)
    return seat?.row_label || ''
}

const getSeatNumber = (seatId) => {
    const seat = bookingStore.seats.find((s) => s.id === seatId)
    return seat?.number || ''
}

const startCountdown = (expiresAtDate) => {
    const update = () => {
        const now = new Date()
        const diff = expiresAtDate - now

        if (diff <= 0) {
            timeRemaining.value = 'Expired - seats released'
            if (countdownInterval) {
                clearInterval(countdownInterval)
            }
            router.push('/movies')
            return
        }

        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        timeRemaining.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    update()
    countdownInterval = setInterval(update, 1000)
}

const cancelOrder = async () => {
    if (!session.value || blockedSeats.value.length === 0) return

    processing.value = true

    try {
        await booking.releaseSeats(session.value.id, blockedSeats.value)
        bookingStore.clearSelection()
        router.push('/movies')
    } catch (error) {
        console.error('Error releasing seats:', error)
    } finally {
        processing.value = false
    }
}

const payNow = async () => {
    if (!session.value || blockedSeats.value.length === 0) return

    processing.value = true

    try {
        const orderResult = await booking.createOrder(session.value.id, blockedSeats.value)

        if (orderResult.order) {
            bookingStore.setOrder(orderResult.order, orderResult.expires_at)

            const paymentResult = await booking.simulatePayment(orderResult.order.id)

            if (paymentResult.order) {
                paymentSuccess.value = true
                bookingStore.clearSelection()

                setTimeout(() => {
                    router.push('/tickets')
                }, 2000)
            }
        }
    } catch (error) {
        console.error('Payment error:', error)
        alert(error.data?.message || 'Payment failed')
    } finally {
        processing.value = false
    }
}
</script>