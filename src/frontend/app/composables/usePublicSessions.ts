export const usePublicSessions = () => {
    const getSessions = async () => {
        return await $fetch('/api/sessions')
    }

    const getSession = async (id: number) => {
        return await $fetch(`/api/sessions/${id}`)
    }

    const getSessionSeats = async (id: number) => {
        return await $fetch(`/api/sessions/${id}/seats`)
    }



    return {getSessions, getSession, getSessionSeats}
}