<template>
  <div class="seat-selector">
    <div class="screen-indicator mb-8">
      <div
        class="screen bg-gradient-to-r from-transparent via-zinc-500 to-transparent h-1 rounded-full relative"
      >
        <span
          class="absolute -top-8 left-1/2 -translate-x-1/2 text-zinc-400 text-sm"
        >
          PANTALLA
        </span>
      </div>
    </div>

    <div class="seats-grid flex flex-col items-center gap-2 mb-8">
      <div
        v-for="(row, rowIndex) in seats"
        :key="rowIndex"
        class="seat-row flex items-center gap-1"
      >
        <span class="row-label text-zinc-500 text-xs w-6">
          {{ String.fromCharCode(65 + rowIndex) }}
        </span>

        <button
          v-for="seat in row"
          :key="seat.id"
          :disabled="seat.status === 'occupied'"
          :class="[
            'seat w-8 h-8 rounded-t-lg text-xs font-medium transition-all duration-200 hover:scale-110 flex items-center justify-center',
            seat.status === 'occupied'
              ? 'bg-zinc-600 text-zinc-500 cursor-not-allowed'
              : seat.status === 'selected'
              ? 'bg-[#0068C8] text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          ]"
          @click="toggleSeat(seat.id, rowIndex)"
        >
          {{ seat.number }}
        </button>

        <span class="row-label text-zinc-500 text-xs w-6">
          {{ String.fromCharCode(65 + rowIndex) }}
        </span>
      </div>
    </div>

    <div class="legend flex justify-center gap-8 mb-8 flex-wrap">
      <div class="legend-item flex items-center gap-2">
        <div class="w-6 h-6 rounded-t-lg bg-zinc-700"></div>
        <span class="text-zinc-400 text-sm">lliure</span>
      </div>

      <div class="legend-item flex items-center gap-2">
        <div class="w-6 h-6 rounded-t-lg bg-[#0068C8]"></div>
        <span class="text-zinc-400 text-sm">seleccionat</span>
      </div>

      <div class="legend-item flex items-center gap-2">
        <div class="w-6 h-6 rounded-t-lg bg-zinc-600"></div>
        <span class="text-zinc-400 text-sm">ocupat</span>
      </div>
    </div>

    <div class="selection-summary bg-[#1A2238] rounded-lg p-4">
      <div class="flex justify-between items-center mb-4">
        <span class="text-zinc-400">Seients seleccionats:</span>
        <span class="text-white font-semibold">
          {{ selectedSeats.length }} / {{ maxSeats }}
        </span>
      </div>

      <div v-if="selectedSeats.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="seat in selectedSeats"
            :key="seat.id"
            class="bg-[#0068C8] text-white text-xs px-2 py-1 rounded"
          >
            {{ seat.label }}
          </span>
        </div>
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-zinc-700">
        <span class="text-zinc-400">Total:</span>
        <span class="text-[#F7C600] text-2xl font-bold">
          {{ formatPrice(totalPrice) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  seats: Array,
  selectedSeats: Array,
  maxSeats: {
    type: Number,
    default: 8
  },
  basePrice: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(["update:selectedSeats"]);

function toggleSeat(seatId, rowIndex) {
  const newSelected = [...props.selectedSeats];
  const existingIndex = newSelected.findIndex((s) => s.id === seatId);

  if (existingIndex >= 0) {
    newSelected.splice(existingIndex, 1);
  } else {
    if (newSelected.length >= props.maxSeats) return;
    
    // Find the seat in the grid to get its properties
    let seatData = null;
    for (const row of props.seats) {
      const found = row.find(s => s.id === seatId);
      if (found) {
        seatData = found;
        break;
      }
    }
    
    if (seatData) {
      newSelected.push({
        id: seatId,
        row: String.fromCharCode(65 + rowIndex),
        number: seatData.number,
        price: Number(props.basePrice) || 0,
        label: `${String.fromCharCode(65 + rowIndex)}${seatData.number}`,
      });
    }
  }

  emit("update:selectedSeats", newSelected);
}

const totalPrice = computed(() => {
  return props.selectedSeats.reduce((sum, seat) => {
    const seatPrice = Number(seat.price) || 0;
    return sum + seatPrice;
  }, 0);
});

function formatPrice(price) {
  const numPrice = Number(price) || 0;
  return `${numPrice.toFixed(2)} €`;
}
</script>
