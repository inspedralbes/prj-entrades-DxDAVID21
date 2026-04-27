import { useAuthStore } from "~/stores/auth";

export const useSessions = () => {
  const authStore = useAuthStore();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
  });

  const getSessions = async () => {
    return await $fetch('/api/admin/sessions', {
      headers: getAuthHeaders(),
    });
  };

  const getSession = async (id: number) => {
    return await $fetch(`/api/admin/sessions/${id}`, {
      headers: getAuthHeaders(),
    });
  };

  const createSession = async (sessionData: any) => {
    return await $fetch('/api/admin/sessions', {
      method: "POST",
      headers: getAuthHeaders(),
      body: sessionData,
    });
  };

  const updateSession = async (id: number, sessionData: any) => {
    return await $fetch(`/api/admin/sessions/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: sessionData,
    });
  };

  const deleteSession = async (id: number) => {
    return await $fetch(`/api/admin/sessions/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  };



  return {
    getSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession,
  };
};
