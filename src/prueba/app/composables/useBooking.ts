import { useAuthStore } from '~/stores/auth'

export const useBooking = () => {
  const authStore = useAuthStore()

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  const getSessionSeats = async (sessionId: number) => {
    return await $fetch(
      `http://localhost:8000/api/sessions/${sessionId}/seats`,
      {}
    )
  }

  const blockSeats = async (sessionId: number, seatIds: number[]) => {
    return await $fetch('http://localhost:8000/api/orders/block-seats', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { session_id: sessionId, seats_ids: seatIds }
    })
  }

  const releaseSeats = async (sessionId: number, seatIds: number[]) => {
    return await $fetch('http://localhost:8000/api/orders/release-seats', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { session_id: sessionId, seats_ids: seatIds }
    })
  }

  const createOrder = async (sessionId: number, seatIds: number[]) => {
    return await $fetch('http://localhost:8000/api/orders/create', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { session_id: sessionId, seats_ids: seatIds }
    })
  }

  const simulatePayment = async (orderId: number) => {
    return await $fetch('http://localhost:8000/api/orders/simulate-payment', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: { order_id: orderId }
    })
  }

  const getMyOrders = async () => {
    return await $fetch('http://localhost:8000/api/orders/my-orders', {
      headers: getAuthHeaders()
    })
  }

  return {
    getSessionSeats,
    blockSeats,
    releaseSeats,
    createOrder,
    simulatePayment,
    getMyOrders
  }
}
