<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="text-center max-w-3xl">
      <div class="mb-8">
        <div
          class="w-24 h-24 bg-[#F7C600] rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <span class="text-[#0A0F1F] font-bold text-4xl">C</span>
        </div>
        <h1 class="text-5xl font-bold text-white mb-4">Benvingut a Cinema</h1>
        <p class="text-xl text-gray-400">
          La teva experiència cinematogràfica definitiva. Descobreix les millors
          pel·lícules i compra les teves entrades fàcilment.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/movies">
          <UButton
            size="lg"
            icon="i-heroicons-film"
            class="bg-[#0068C8] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
          >
            Veure pel·lícules
          </UButton>
        </NuxtLink>

        <template v-if="!authStore.isAuthenticated">
          <NuxtLink to="/login">
            <UButton
              size="lg"
              class="bg-[#F7C600] text-[#0A0F1F] font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#dfa500] active:bg-[#c99a00] transition-all duration-200 transform hover:scale-105"
            >
              Iniciar sessió
            </UButton>
          </NuxtLink>
        </template>
      </div>

      <div v-if="authStore.isAuthenticated" class="mt-8">
        <NuxtLink to="/tickets">
          <UButton
            size="lg"
            icon="i-heroicons-ticket"
            class="bg-[#F7C600] text-[#0A0F1F] font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#dfa500] active:bg-[#c99a00] transition-all duration-200 transform hover:scale-105"
          >
            Les meves entrades
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

onMounted(() => {
  authStore.initFromStorage();
});
</script>
