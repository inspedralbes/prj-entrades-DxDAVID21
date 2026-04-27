export const usePublicMovies = () => {
    const config = useRuntimeConfig()

    const getMovies = async () => {
        return await $fetch(`${config.public.apiBase}/movies`, {
        })
    }

    const getMovie = async (id: number) => {
        return await $fetch(`${config.public.apiBase}/movies/${id}`, {
        })
    }

   


    return {
        getMovies,
        getMovie,
    }
}