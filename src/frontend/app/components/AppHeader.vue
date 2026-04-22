<template>
  <header class="bg-[#0A0F1F] border-b border-gray-800 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-[#F7C600] rounded-lg flex items-center justify-center"
          >
            <span class="text-[#0A0F1F] font-bold text-xl">C</span>
          </div>
          <span class="text-white font-bold text-xl hidden sm:block"
            >Cinema</span
          >
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-gray-300 hover:text-[#F7C600] transition-colors"
            active-class="text-[#F7C600]"
          >
            Inici
          </NuxtLink>
          <NuxtLink
            to="/movies"
            class="text-gray-300 hover:text-[#F7C600] transition-colors"
            active-class="text-[#F7C600]"
          >
            Pel·lícules
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/tickets"
              class="text-gray-300 hover:text-[#F7C600] transition-colors hidden md:block"
              active-class="text-[#F7C600]"
            >
              Les meves entrades
            </NuxtLink>

            <div class="relative" v-if="authStore.isAdmin">
              <button
                class="text-gray-300 hover:text-[#F7C600] transition-colors flex items-center gap-2"
                @click="showAdminMenu = !showAdminMenu"
              >
                <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5" />
                <span class="hidden sm:inline">Admin</span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
              </button>
              <Transition name="fade">
                <div
                  v-if="showAdminMenu"
                  class="absolute right-0 mt-2 w-48 bg-[#1A2238] rounded-lg shadow-xl border border-gray-700 py-2 z-50"
                >
                  <NuxtLink
                    to="/admin/movies"
                    class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    @click="showAdminMenu = false"
                  >
                    Pel·lícules
                  </NuxtLink>
                  <NuxtLink
                    to="/admin/rooms"
                    class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    @click="showAdminMenu = false"
                  >
                    Sales
                  </NuxtLink>
                  <NuxtLink
                    to="/admin/sessions"
                    class="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    @click="showAdminMenu = false"
                  >
                    Sessions
                  </NuxtLink>
                </div>
              </Transition>
            </div>

            <div class="flex items-center gap-3 border-l border-gray-700 pl-4">
              <span
                class="text-gray-300 text-sm hidden sm:inline min-w-[120px] text-right"
              >
                {{ authStore.user?.name }}
              </span>
              <UButton
                size="sm"
                class="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-red-700 active:bg-red-800 transition-all duration-200 transform hover:scale-105"
                @click="handleLogout"
              >
                Sortir
              </UButton>
            </div>
          </template>

          <template v-else>
            <NuxtLink to="/login">
              <UButton
                size="sm"
                class="bg-[#F7C600] text-[#0A0F1F] font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#dfa500] active:bg-[#c99a00] transition-all duration-200 transform hover:scale-105"
              >
                Iniciar sessió
              </UButton>
            </NuxtLink>
            <NuxtLink to="/register">
              <UButton
                size="sm"
                class="bg-[#0068C8] text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
              >
                Registrar-se
              </UButton>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const authStore = useAuthStore();
const router = useRouter();
const showAdminMenu = ref(false);

function handleLogout() {
  authStore.logout();
  router.push("/");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
