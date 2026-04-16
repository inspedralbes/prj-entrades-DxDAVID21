import {useAuthStore} from '~/stores/auth'

export const useMovies = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`
  })

  const getMovies = async () => {
    return await $fetch("http://localhost:8000/api/admin/movies", {
      headers: getAuthHeaders(),
    });
  };

  const getMovie = async (id: number) => {
    return await $fetch(`http://localhost:8000/api/admin/movies/${id}`, {
      headers: getAuthHeaders(),
    });
  };

  const createMovie = async (movieData: any) => {
    return await $fetch("http://localhost:8000/api/admin/movies", {
      method: "POST",
      headers: getAuthHeaders(),
      body: movieData,
    });
  };

  const updateMovie = async (id: number, movieData: any) => {
    return await $fetch(`http://localhost:8000/api/admin/movies/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: movieData,
    });
  };

  const deleteMovie = async (id: number) => {
    return await $fetch(`http://localhost:8000/api/admin/movies/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  };

  return {
    getMovies,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie,
  };
};
