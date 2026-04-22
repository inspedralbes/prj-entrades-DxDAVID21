import { io } from 'socket.io-client'
import { useBookingStore } from '~/stores/booking'
import { useAuthStore } from '~/stores/auth'

export const useSocket = () => {
    const bookingStore = useBookingStore()
    const authStore = useAuthStore()

    let socket: any = null
    const connectedUserCount = ref (0)

    const connect = (sessionId: number) => {
        const socketUrl = 'http://localhost:3001'
        const token = localStorage.getItem('token')

        socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            query: {
                sessionId: sessionId,
                userId: authStore.user?.id || null,
                token: token || null
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id)
            socket.emit('session:join', {
                sessionId,
                userId: authStore.user?.id,
                token: token || null
            })
        })

        socket.on('disconnect', (reason: string) => {
            console.log('Socket disconnected:', reason)
        })

        socket.on('reconnect', (attemptNumber: number) => {
            console.log('Socket reconnected after', attemptNumber, 'attempts')
            const reconnectToken = localStorage.getItem('token')
            socket.emit('session:join', {
                sessionId,
                userId: authStore.user?.id,
                token: reconnectToken || null
            })
        })

        socket.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error)
        })

        socket.on('seat:status', (data: any) => {
            console.log('Seat status update:', data)
            if (data.seatId && data.status) {
                bookingStore.updateSeatStatus(data.seatId, data.status)
                if (data.blockedBy) {
                    const seat = bookingStore.seats.find((s: any) => s.id === data.seatId)
                    if (seat) {
                        seat.blocked_by = data.blockedBy
                        seat.lock_expires_at = data.lockedUntil
                    }
                }
            }
        })

        socket.on('seat:update', (data: any) => {
            console.log('Seat update received:', data)
            if (data.seatId && data.status) {
                bookingStore.updateSeatStatus(data.seatId, data.status)
            }
        })

        socket.on('users:count', (data: any) => {
            console.log('Users count update:', data)
            connectedUserCount.value = data.count
        })

        socket.on('activity', (data: any) => {
            console.log('Activity:', data)
        })

        socket.on('error', (error: any) => {
            console.error('Socket error:', error)
        })

        return socket
    }

    const disconnect = () => {
        if (socket) {
            socket.emit('session:leave', {
                sessionId: bookingStore.session?.id,
                userId: authStore.user?.id
            })
            socket.disconnect()
            socket = null
        }
    }

    const emitSeatBlock = (sessionId: number, seatId: number, lockedUntil: string) => {
        if (socket && socket.connected) {
            socket.emit('seat:block', {
                sessionId,
                seatId,
                userId: authStore.user?.id,
                lockedUntil
            })
        }
    }

    const emitSeatRelease = (sessionId: number, seatId: number) => {
        if (socket && socket.connected) {
            socket.emit('seat:release', {
                sessionId,
                seatId,
                userId: authStore.user?.id
            })
        }
    }

    const emitSeatPurchase = (sessionId: number, seatIds: number[]) => {
        if (socket && socket.connected) {
            socket.emit('seat:purchase', {
                sessionId,
                seatIds,
                userId: authStore.user?.id
            })
        }
    }

    const getSocketId = () => {
        return socket?.id || null
    }

    const isConnected = () => {
        return socket?.connected || false
    }

    return {
        connect,
        disconnect,
        emitSeatBlock,
        emitSeatRelease,
        emitSeatPurchase,
        getSocketId,
        isConnected,
        connectedUserCount
    }
}