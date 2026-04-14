<template>
  <div class="p-8">
    <div class="flex">
      <h1 class="text-2xl">Gestion de sessiones</h1>
      <NuxtLink to="/admin/sessions/create" class="bg-blue-500"
        >Nueva sala</NuxtLink
      >
    </div>

    <div v-if="loading">Cargando...</div>

    <div v-else-if="sessions && sessions.length > 0">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200">
            <th class="border">ID</th>
            <th class="border">Pelicula</th>
            <th class="border">Sala</th>
            <th class="border">Hora Inicio</th>
            <th class="border">Precio</th>
            <th class="border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.id" class="text-center">
            <td class="border">{{ session.id }}</td>
            <td class="border">{{ session.movie?.title }}</td>
            <td class="border">{{ session.room?.name }}</td>
            <td class="border">{{ session.start_time }}</td>
            <td class="border">{{ session.price }}€</td>
            <td class="border">
              <NuxtLink
                :to="`/admin/sessions/${session.id}/edit`"
                class="text-blue-500"
                >Editar</NuxtLink
              >
              <button @click="handleDelete(session.id)" class="text-red-500">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>No hay sesiones</div>
  </div>
</template>

<script setup>
const authStore = useAuthStore();
const sessions = ref(null);
const loading = ref(true);
const sessionsApi = useSessions();

onMounted(async () => {
  authStore.initFromStorage();

  if (!authStore.isAuthenticated) {
    navigateTo("/");
    return;
  }

  try {
    sessions.value = await sessionsApi.getSessions();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const handleDelete = async (id) => {
  if (confirm("Estas seguro de eliminar la sala")) {
    await sessionsApi.deleteSession(id);
        sessions.value = await sessionsApi.getSessions();
  }
};
</script>
