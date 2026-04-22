import { defineStore } from 'pinia'

interface Seat {
    id: number
    row_label: string
    number: number
    type: string
    price_modifier: number
    status: 'available' | 'blocked' | 'purchased'
    blocked_by: number | null
    lock_expires_at: string | null
}

interface BookingState {
    session: any | null
    seats: Seat[]
    selectedSeats: number[]
    price: number
    total: number
    loading: boolean
    order: any | null
    expiresAt: string | null
}

export const useBookingStore = defineStore('booking', {
    state: (): BookingState => ({
        session: null,
        seats: [],
        selectedSeats: [],
        price: 12,
        total: 0,
        loading: false,
        order: null,
        expiresAt: null,
    }),

    getters: {
        getSeatsByRow: (state) => {
            const rows: Record<string, Seat[]> = {}
            state.seats.forEach((seat) => {
                const rowLabel = seat.row_label
                if (!rows[seat.row_label]) {
                    rows[seat.row_label] = []
                }
                rows[rowLabel]!.push(seat)
            })
            Object.keys(rows).forEach((row) => {
                rows[row]!.sort((a, b) => a.number - b.number)
            })
            return rows
        },
    },

    actions: {
        setSession(session: any) {
            this.session = session
        },

        setSessionData(session: any, seats: Seat[], price: number) {
            this.session = session
            this.seats = seats
            this.price = price
        },

        toggleSeat(seatId: number) {
            const seat = this.seats.find((s) => s.id === seatId)
            if (!seat || seat.status === 'purchased' || seat.status === 'blocked') {
                return
            }

            const index = this.selectedSeats.indexOf(seatId)
            if (index > -1) {
                this.selectedSeats.splice(index, 1)
            } else {
                this.selectedSeats.push(seatId)
            }
            this.calculateTotal()
        },

        calculateTotal() {
            this.total = this.selectedSeats.length * this.price
        },

        updateSeatStatus(seatId: number, status: string) {
            const seat = this.seats.find((s) => s.id === seatId)
            if (seat) {
                seat.status = status as Seat['status']
            }
        },

        setBlockedSeats(seats: Seat[], expiresAt: string) {
            seats.forEach((seat) => {
                const existing = this.seats.find((s) => s.id === seat.id)
                if (existing) {
                    existing.status = 'blocked'
                    existing.blocked_by = seat.blocked_by
                    existing.lock_expires_at = seat.lock_expires_at
                }
            })
            this.selectedSeats = seats.map(s => s.id)
            this.expiresAt = expiresAt
        },

        clearSelection() {
            this.selectedSeats = []
            this.total = 0
            this.order = null
            this.expiresAt = null
        },

        setOrder(order: any, expiresAt: string) {
            this.order = order
            this.expiresAt = expiresAt
        },

        reset() {
            this.session = null
            this.seats = []
            this.selectedSeats = []
            this.price = 0
            this.total = 0
            this.loading = false
            this.order = null
            this.expiresAt = null
        },
    },
})