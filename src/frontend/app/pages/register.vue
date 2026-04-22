<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-[#1A2238] rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-[#F7C600] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-[#0A0F1F] font-bold text-2xl">C</span>
          </div>
          <h1 class="text-3xl font-bold text-white">Crear compte</h1>
          <p class="text-gray-400 mt-2">Registra't per comprar entrades</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
            <UInput
              v-model="name"
              type="text"
              placeholder="El teu nom"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>

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
              placeholder="Mínim 6 caràcters"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div>

          <!-- <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Confirmar contrasenya</label>
            <UInput
              v-model="confirmPassword"
              type="password"
              placeholder="Repeteix la contrasenya"
              size="lg"
              :ui="{ root: 'bg-[#0A0F1F] border-gray-700 text-white placeholder-gray-500' }"
              required
            />
          </div> -->

          <div class="flex items-start gap-2">
            <UCheckbox
              v-model="acceptTerms"
              color="primary"
            />
            <span class="text-sm text-gray-400">
              Accepto els
              <a href="#" class="text-[#0068C8] hover:underline">Termes i condicions</a>
              i la
              <a href="#" class="text-[#0068C8] hover:underline">Política de privacitat</a>
            </span>
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
            :disabled="!acceptTerms"
          >
            Crear compte
          </UButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Ja tens compte?
            <NuxtLink to="/login" class="text-[#F7C600] hover:underline font-medium">
              Iniciar sessió
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const router = useRouter()

const name = ref("")
const email = ref("")
const password = ref("")
// const confirmPassword = ref("")
const acceptTerms = ref(false)
const error = ref("")
const loading = ref(false)
const authStore = useAuthStore()

const handleRegister = async () => {
  error.value = ""

  // if (password.value !== confirmPassword.value) {
  //   error.value = "Les contrasenyes no coincideixen"
  //   return
  // }

  if (password.value.length < 6) {
    error.value = "La contrasenya ha de tenir mínim 6 caràcters"
    return
  }

  loading.value = true

  try {
    const result = await authStore.register(
      name.value,
      email.value,
      password.value
    )

    if (result.success) {
      router.push("/")
    } else {
      error.value = result.message || "Error en registrar-se"
    }
  } catch (e) {
    error.value = "Error en registrar-se"
  } finally {
    loading.value = false
  }
}
</script>
