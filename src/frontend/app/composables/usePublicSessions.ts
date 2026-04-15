export const usePublicSessions = () => {
    const getSessions = async () => {
        return await $fetch('http://localhost:8000/api/sessions')
    }

    const getSession = async (id: number) => {
        return await $fetch(`http://localhost:8000/api/sessions/${id}`)
    }

    return {getSessions, getSession}
}