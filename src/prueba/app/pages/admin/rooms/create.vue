<template>
    <div class="p-8">
        <h1 class="text-2xl">Crear</h1>

        <form @submit.prevent="handleSubmit" class="max-w-lg">
            <div class="mb-4">
                <label class="block">Nombre de la sala</label>
                <input v-model="form.name" type="text"  required/>
            </div>
            
            <div class="mb-4">
                <label class="block">Filas</label>
                <input v-model="form.rows" type="number"  required/>
            </div>

            <div class="mb-4">
                <label class="block">Asientos por fila</label>
                <input v-model="form.seats_per_row" type="number"  required/>
            </div>

            <button type="submit" class="bg-blue-500">Crear sala</button>
            <NuxtLink to="/admin/rooms" class="ml-4">Cancelar</NuxtLink>
        </form>
    </div>
</template>

<script setup>
const form = ref({
    name: '',
    rows: '',
    seats_per_row: ''
})

const authStore = useAuthStore()
const roomsApi = useRooms()

onMounted(() => {
    authStore.initFromStorage()

    if (!authStore.isAuthenticated){
        navigateTo('/')
    }
})
    
const handleSubmit = async () => {
    try {
        await roomsApi.createRoom(form.value)
        navigateTo('/admin/rooms')
    } catch (error) {
        alert('Error al crear sala')
    }
}
</script>