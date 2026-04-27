import { useAuthStore } from "~/stores/auth";

export const useRooms = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
  });

  const getRooms = async () => {
    return await $fetch(`${config.public.apiBase}/admin/rooms`, {
      headers: getAuthHeaders(),
    });
  };

  const getRoom = async (id: number) => {
    return await $fetch(`${config.public.apiBase}/admin/rooms/${id}`, {
      headers: getAuthHeaders(),
    });
  };

  const createRoom = async (roomData: any) => {
    return await $fetch(`${config.public.apiBase}/admin/rooms`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: roomData,
    });
  };

  const updateRoom = async (id: number, roomData: any) => {
    return await $fetch(`${config.public.apiBase}/admin/rooms/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: roomData,
    });
  };

  const deleteRoom = async (id: number) => {
    return await $fetch(`${config.public.apiBase}/admin/rooms/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  };


  return { getRooms, getRoom, createRoom, updateRoom, deleteRoom };
};
