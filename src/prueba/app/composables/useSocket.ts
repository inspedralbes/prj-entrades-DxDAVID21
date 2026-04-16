import { io } from 'socket.io-client'
import { useBookingStore } from '~/stores/booking'

export const useSocket = () => {
    const bookingStore = useBookingStore()

    let socket: any = null

    const connect = (sessionId: number) => {
        const socketUrl = 'http://localhost:3001'

        socket = io(socketUrl, {
            transport: ['websocket'],
            query: {sessionId}
        })

        socket.on('seat:update', (data: any) => {
            bookingStore.updateSeatStatus(data.seatId, data.status)
        })

        socket.on('seat:blocked', (data: any) => {
            bookingStore.updateSeatStatus(data.seatId, 'blocked')
        })

        socket.on('seat:released', (data: any) => {
            bookingStore.updateSeatStatus(data.seatId, 'available')
        })

        socket.on('seat:purchased', (data: any) => {
            bookingStore.updateSeatStatus(data.seatId, 'purchased')
        })
        
        return socket
    }

    const disconnect = () => {
        if (socket) {
            socket.disconnect()
            socket = null
        }
    }

    const emitSeatSelect = (sessionId: number, seatId: number) => {
        if (socket) {
            socket.emit('seat:select', {sessionId, seatId})
        }
    }

    const emitSeatRelease = (sessionId: number, seatId: number) => {
        if (socket) {
            socket.emit('seat:release', {sessionId, seatId})
        }
    }

    return {
        connect,
        disconnect,
        emitSeatSelect,
        emitSeatRelease
    }
}