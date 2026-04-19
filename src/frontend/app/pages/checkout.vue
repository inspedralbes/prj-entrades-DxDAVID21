<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <div v-if="!hasBlockedSeats" class="text-center py-12">
      <p class="text-gray-600 mb-4">No hi ha seients seleccionats</p>
      <NuxtLink to="/movies" class="text-blue-500 hover:underline">Veure pel.licules</NuxtLink>
    </div>

    <div v-else>
      <div class="bg-white border rounded-lg p-4 mb-6">
        <h2 class="font-semibold mb-4">Detalls de la Sessio</h2>
        <div class="space-y-2 text-gray-600">
          <p><span class="font-medium">Pel.licula:</span> {{ session?.movie?.title }}</p>
          <p><span class="font-medium">Sala:</span> {{ session?.room?.name }}</p>
          <p><span class="font-medium">Data:</span> {{ formatDate(session?.start_time) }}</p>
        </div>
      </div>

      <div class="bg-white border rounded-lg p-4 mb-6">
        <h2 class="font-semibold mb-4">Seients Seleccionats</h2>
        <div class="space-y-2">
          <div
            v-for="seatId in blockedSeats"
            :key="seatId"
            class="flex justify-between items-center py-2 border-b last:border-b-0"
          >
            <span>Fila {{ getSeatRow(seatId) }}, Seient {{ getSeatNumber(seatId) }}</span>
            <span class="font-medium">{{ price }}€</span>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4 pt-4 border-t">
          <span class="text-lg font-semibold">Total</span>
          <span class="text-xl font-bold text-green-600">{{ total }}€</span>
        </div>
      </div>

      <div v-if="expiresAt && !paymentSuccess" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p class="text-yellow-800">
          Els seients expiraran en: <span class="font-bold">{{ timeRemaining }}</span>
        </p>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ errorMessage }}</p>
      </div>

      <div v-if="!paymentSuccess" class="flex gap-4">
        <button
          class="flex-1 bg-gray-500 text-white py-3 rounded hover:bg-gray-600 disabled:opacity-50"
          :disabled="processing"
          @click="cancelOrder"
        >
          Cancel.lar Comanda
        </button>
        <button
          class="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-50"
          :disabled="processing"
          @click="payNow"
        >
          {{ processing ? 'Processant...' : 'Pagar Ara' }}
        </button>
      </div>
    </div>

    <div v-if="paymentSuccess" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <p class="text-green-800 font-semibold">Pagament realitzat amb exit!</p>
      <p class="text-green-600 mt-2">Les teves entrades estan preparades.</p>
      <NuxtLink to="/tickets" class="block mt-4 text-center text-green-700 hover:underline font-medium">
        Veure les Meves Entrades
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from '~/stores/booking'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const bookingStore = useBookingStore()
const authStore = useAuthStore()
const booking = useBooking()
const socketInstance = useSocket()
let rawSocket = null

const processing = ref(false)
const paymentSuccess = ref(false)
const timeRemaining = ref('')
const errorMessage = ref('')
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

    if (session.value) {
        rawSocket = socketInstance.connect(session.value.id)
    }

    if (expiresAt.value) {
        const expiresAtDate = new Date(expiresAt.value)
        if (expiresAtDate > new Date()) {
            startCountdown(expiresAtDate)
        } else {
            errorMessage.value = 'Els teus seients han expirat!'
            bookingStore.clearSelection()
            setTimeout(() => {
                router.push('/movies')
            }, 2000)
        }
    }
})

onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
    }
    socketInstance.disconnect()
})

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleString('ca-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
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
            timeRemaining.value = 'Expirat!'
            if (countdownInterval) {
                clearInterval(countdownInterval)
            }

            blockedSeats.value.forEach((seatId) => {
                socketInstance.emitSeatRelease(session.value.id, seatId)
            })

            bookingStore.clearSelection()
            errorMessage.value = 'Temps expirat! Els seients s\'han alliberat.'

            setTimeout(() => {
                router.push('/movies')
            }, 3000)
            return
        }

        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        timeRemaining.value = `${minutes}:${seconds.toString().padStart(2, '0')}`

        if (diff <= 60000) {
            timeRemaining.value = `Expire aviat: ${timeRemaining.value}`
        }
    }

    update()
    countdownInterval = setInterval(update, 1000)
}

const cancelOrder = async () => {
    if (!session.value || blockedSeats.value.length === 0) return

    processing.value = true
    errorMessage.value = ''

    try {
        await booking.releaseSeats(session.value.id, blockedSeats.value)

        blockedSeats.value.forEach((seatId) => {
            socketInstance.emitSeatRelease(session.value.id, seatId)
        })

        bookingStore.clearSelection()

        if (countdownInterval) {
            clearInterval(countdownInterval)
        }

        router.push('/movies')
    } catch (error) {
        console.error('Error releasing seats:', error)
        errorMessage.value = error.data?.message || 'Error en alliberar els seients'
    } finally {
        processing.value = false
    }
}

const payNow = async () => {
    if (!session.value || blockedSeats.value.length === 0) return

    processing.value = true
    errorMessage.value = ''

    try {
        const orderResult = await booking.createOrder(session.value.id, blockedSeats.value)

        if (orderResult.order) {
            bookingStore.setOrder(orderResult.order, orderResult.expires_at)

            const paymentResult = await booking.simulatePayment(orderResult.order.id)

            if (paymentResult.order) {
                socketInstance.emitSeatPurchase(session.value.id, blockedSeats.value)

                paymentSuccess.value = true
                bookingStore.clearSelection()

                if (countdownInterval) {
                    clearInterval(countdownInterval)
                }

                setTimeout(() => {
                    router.push('/tickets')
                }, 3000)
            }
        }
    } catch (error) {
        console.error('Payment error:', error)
        errorMessage.value = error.data?.message || 'Error en el pagament. Els seients segueixen bloquejats.'
    } finally {
        processing.value = false
    }
}
</script>