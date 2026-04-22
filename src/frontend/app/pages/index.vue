<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="text-center max-w-3xl">
      <div class="mb-8">
        <div class="w-24 h-24 bg-[#F7C600] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span class="text-[#0A0F1F] font-bold text-4xl">C</span>
        </div>
        <h1 class="text-5xl font-bold text-white mb-4">Benvingut a Cinema</h1>
        <p class="text-xl text-gray-400">
          La teva experiència cinematogràfica definitiva. Descobreix les millors pel·lícules i compra les teves entrades fàcilment.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/movies">
          <UButton color="primary" size="lg" icon="i-heroicons-film">
            Veure pel·lícules
          </UButton>
        </NuxtLink>

        <template v-if="!authStore.isAuthenticated">
          <NuxtLink to="/login">
            <UButton variant="ghost" size="lg">
              Iniciar sessió
            </UButton>
          </NuxtLink>
        </template>
      </div>

      <div v-if="authStore.isAuthenticated" class="mt-8">
        <NuxtLink to="/tickets">
          <UButton variant="ghost" size="lg" icon="i-heroicons-ticket">
            Les meves entrades
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initFromStorage()
})
</script>