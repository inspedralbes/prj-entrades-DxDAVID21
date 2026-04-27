export const usePublicMovies = () => {
    const getMovies = async () => {
        return await $fetch('/api/movies', {
        })
    }

    const getMovie = async (id: number) => {
        return await $fetch(`/api/movies/${id}`, {
        })
    }

   


    return {
        getMovies,
        getMovie,
    }
}