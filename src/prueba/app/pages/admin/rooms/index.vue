<template>
  <div class="p-8">
    <div class="flex">
      <h1 class="text-2xl">Gestion de salas</h1>
      <NuxtLink to="/admin/rooms/create" class="bg-blue-500"
        >Nueva sala</NuxtLink
      >
    </div>

    <div v-if="loading">Cargando...</div>

    <div v-else-if="rooms && rooms.length > 0">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-200">
            <th class="border">ID</th>
            <th class="border">Nombre</th>
            <th class="border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id" class="text-center">
            <td class="border">{{ room.id }}</td>
            <td class="border">{{ room.name }}</td>
            <td class="border">
              <NuxtLink
                :to="`/admin/rooms/${room.id}/edit`"
                class="text-blue-500"
                >Editar</NuxtLink
              >
              <button @click="handleDelete(room.id)" class="text-red-500"
                >Eliminar</button
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>No hay salas</div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const rooms = ref(null)
const loading = ref(true)
const roomsApi = useRooms()

onMounted(async () => {
    authStore.initFromStorage()

    if (!authStore.isAuthenticated) {
        navigateTo('/')
        return
    }
    
    try {
        rooms.value = await roomsApi.getRooms()
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

const handleDelete = async (id) => {
    if (confirm('Estas seguro de eliminar la sala')) {
        await roomsApi.deleteRoom(id)
        rooms.value = await roomsApi.getRooms()
    }
}
</script>
