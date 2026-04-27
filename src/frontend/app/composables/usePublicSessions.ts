export const usePublicSessions = () => {
    const config = useRuntimeConfig()
    const getSessions = async () => {
        return await $fetch(`${config.public.apiBase}/sessions`)
    }

    const getSession = async (id: number) => {
        return await $fetch(`${config.public.apiBase}/sessions/${id}`)
    }

    const getSessionSeats = async (id: number) => {
        return await $fetch(`${config.public.apiBase}/sessions/${id}/seats`)
    }


    return {getSessions, getSession, getSessionSeats}
}