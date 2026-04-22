<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-[#1A2238] rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-[#F7C600] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-[#0A0F1F] font-bold text-2xl">C</span>
          </div>
          <h1 class="text-3xl font-bold text-white">Iniciar sessió</h1>
          <p class="text-gray-400 mt-2">Accedeix al teu compte de Cinema</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Correu electrònic</label>
            <UInput
              v-model="email"
              type="email"
              placeholder="elmeu@email.cat"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Contrasenya</label>
            <UInput
              v-model="password"
              type="password"
              placeholder="La teva contrasenya"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox
                v-model="rememberMe"
                color="primary"
              />
              <span class="text-sm text-gray-400">Recorda'm</span>
            </label>
            <a href="#" class="text-sm text-[#0068C8] hover:underline">
              Has oblidat la contrasenya?
            </a>
          </div>

          <UAlert v-if="error" color="error" variant="subtle">
            {{ error }}
          </UAlert>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            :loading="loading"
          >
            Iniciar sessió
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            No tens compte?
            <NuxtLink to="/register" class="text-[#F7C600] hover:underline font-medium">
              Registrar-se
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const loading = ref(false)
const authStore = useAuthStore()

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await authStore.login(email.value, password.value)

    if (result.success) {
      const redirect = route.query.redirect as string
      router.push(redirect || '/')
    } else {
      error.value = result.message || 'Error en iniciar sessió'
    }
  } catch (e) {
    error.value = 'Error en iniciar sessió'
  } finally {
    loading.value = false
  }
}
</script>
