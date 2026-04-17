export const usePublicMovies = () => {

    const getMovies = async () => {
        return await $fetch('http://localhost:8000/api/movies', {
        })
    }

    const getMovie = async (id: number) => {
        return await $fetch(`http://localhost:8000/api/movies/${id}`, {
        })
    }

   


    return {
        getMovies,
        getMovie,
    }
}