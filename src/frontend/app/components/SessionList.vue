<template>
  <div class="session-list space-y-4">
    <div v-if="sessions.length === 0" class="text-gray-400 text-center py-8">
      No hi ha sessions disponibles
    </div>
    <div
      v-for="session in sessions"
      :key="session.id"
      class="session-item bg-[#1A2238] rounded-lg p-4 flex items-center justify-between hover:bg-[#252d4a] transition-colors cursor-pointer"
      @click="$emit('select', session)"
    >
      <div class="flex items-center gap-4">
        <div class="text-center px-4 border-r border-gray-600">
          <div class="text-[#F7C600] font-bold text-xl">
            {{ formatDate(session.start_time) }}
          </div>
          <div class="text-gray-400 text-sm">
            {{ formatTime(session.start_time) }}
          </div>
        </div>
        <div>
          <div class="text-white font-semibold">{{ session.cinema_name }}</div>
          <div class="text-gray-400 text-sm">
            Sala {{ session.room_number }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <div class="text-[#0068C8] font-bold">
            {{ formatPrice(session.price) }}
          </div>
          <div class="text-gray-400 text-xs">
            {{ session.available_seats }} localitats
          </div>
        </div>
        <UButton
          size="sm"
          icon="i-heroicons-ticket"
          class="bg-[#0068C8] text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
        >
          Comprar
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["select"]);

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ca-ES", { day: "2-digit", month: "short" });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(price) {
  return `${Number(price).toFixed(2)} €`;
}
</script>
