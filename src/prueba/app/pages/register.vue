<template>
  <div class="container">
    <div class="bg-white">
      <h1 class="text-2xl">
        Registrarse
      </h1>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-indigo-500">Nombre</label>
          <input v-model="name" type="text" class="w-full" required />
        </div>

        <div class="mb-4">
          <label class="block">Email</label>
          <input v-model="email" type="email" class="w-full" required />
        </div>

        <div class="mb-4">
          <label class="block">Contraseña</label>
          <input v-model="password" type="password" class="w-full" required />
        </div>

        <button type="submit" class="w-full">
          Registrarse
        </button>
      </form>

      <p class="mt-4">
        Ya tienes cuenta
        <NuxtLink to="/login" class="text-blue">Iniciar Sesión</NuxtLink>
      </p>

      <p v-if="error" class="mb-4">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const authStore = useAuthStore();

const handleRegister = async () => {
  error.value = "";
  const result = await authStore.register(
    name.value,
    email.value,
    password.value,
  );

  if (result.success) {
    navigateTo("/");
  } else {
    error.value = result.message || "Error al registrarse";
  }
};
</script>
