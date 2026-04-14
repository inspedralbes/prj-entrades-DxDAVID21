<template>
    <div class="p-8">
        <h1 class="text-2xl">Editar Sala</h1>
        <div v-if="loading">Cargando...</div>
    
        <form v-else @submit.prevent="handleSubmit" class="max-w-lg">
        <div class="mb-4">
            <label class="block mb-1">Nombre de la Sala</label>
            <input v-model="form.name" type="text" class="w-full border p-2" required />
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
            Guardar Cambios
        </button>
        
        <NuxtLink to="/admin/rooms" class="ml-4 text-gray-500">Cancelar</NuxtLink>
        </form>
    </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
const form = ref({})
const loading = ref(true)
const roomsApi = useRooms()
const authStore = useAuthStore()


onMounted(async () => {
    authStore.initFromStorage()

    if (!authStore.isAuthenticated) {
        navigateTo('/')

        return
    }
    try {
        const room = await roomsApi.getRoom(parseInt(id))
        form.value= {...room}
    } catch (error) {
        console.error(error)
    } finally {
        loading.value = false
    }
})

const handleSubmit = async () => {
    try {
        await roomsApi.updateRoom(parseInt(id), form.value)
        navigateTo('/admin/rooms')
    } catch (error) {
        alert('Error al actualitzar sala')
        console.error(error)
    }
}

</script>