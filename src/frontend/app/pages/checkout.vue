<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>

    <div v-if="!hasBlockedSeats" class="text-center py-16">
      <div class="text-gray-400 text-xl mb-4">
        No hi ha seients seleccionats
      </div>
      <NuxtLink to="/movies">
        <UButton
          class="bg-[#0068C8] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
        >
          Veure pel·lícules
        </UButton>
      </NuxtLink>
    </div>

    <div v-else class="max-w-2xl mx-auto">
      <div class="bg-[#1A2238] rounded-xl p-6 mb-6">
        <h2
          class="text-xl font-semibold text-white mb-4 flex items-center gap-2"
        >
          <UIcon name="i-heroicons-film" class="w-5 h-5" />
          Detalls de la sessió
        </h2>
        <div class="space-y-3 text-gray-300">
          <div class="flex justify-between">
            <span class="text-gray-400">Pel·lícula:</span>
            <span class="text-white font-medium">{{
              session?.movie?.title
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Cinema:</span>
            <span class="text-white font-medium">{{
              session?.cinema_name
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Sala:</span>
            <span class="text-white font-medium">{{
              session?.room?.name
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Data i hora:</span>
            <span class="text-white font-medium">{{
              formatDate(session?.start_time)
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-[#1A2238] rounded-xl p-6 mb-6">
        <h2
          class="text-xl font-semibold text-white mb-4 flex items-center gap-2"
        >
          <UIcon name="i-heroicons-ticket" class="w-5 h-5" />
          Seients seleccionats
        </h2>
        <div class="space-y-3">
          <div
            v-for="seatId in blockedSeats"
            :key="seatId"
            class="flex justify-between items-center py-3 border-b border-gray-700 last:border-b-0"
          >
            <span class="text-gray-300">
              <UIcon name="i-heroicons-chair" class="w-4 h-4 mr-2" />
              Fila {{ getSeatRow(seatId) }}, Seient {{ getSeatNumber(seatId) }}
            </span>
            <span class="text-[#0068C8] font-medium">{{ price }}€</span>
          </div>
        </div>

        <PriceSummary :items="priceItems" class="mt-6" />
      </div>

      <div
        v-if="expiresAt && !paymentSuccess"
        class="bg-yellow-600/20 border border-yellow-600 rounded-lg p-4 mb-6"
      >
        <p class="text-yellow-400 flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="w-5 h-5" />
          Els seients expiraran en:
          <span class="font-bold">{{ timeRemaining }}</span>
        </p>
      </div>

      <UAlert v-if="errorMessage" color="error" variant="subtle" class="mb-6">
        {{ errorMessage }}
      </UAlert>

      <div v-if="!paymentSuccess" class="flex gap-4">
        <UButton
          size="lg"
          class="flex-1 bg-red-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-red-700 active:bg-red-800 transition-all duration-200"
          :loading="processing"
          @click="cancelOrder"
        >
          Cancel·lar comanda
        </UButton>
        <UButton
          size="lg"
          class="flex-1 bg-[#0068C8] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
          :loading="processing"
          icon="i-heroicons-credit-card"
          @click="payNow"
        >
          Pag ara
        </UButton>
      </div>

      <div
        v-if="paymentSuccess"
        class="mt-6 bg-green-600/20 border border-green-600 rounded-xl p-6 text-center"
      >
        <UIcon
          name="i-heroicons-check-circle"
          class="w-16 h-16 text-green-500 mx-auto mb-4"
        />
        <p class="text-green-400 font-semibold text-xl">
          Pagament realitzat amb èxit!
        </p>
        <p class="text-gray-400 mt-2">Les teves entrades estan preparades.</p>
        <NuxtLink to="/tickets" class="mt-6 block">
          <UButton
            size="lg"
            class="w-full bg-[#0068C8] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
          >
            Veure les meves entrades
          </UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookingStore } from "~/stores/booking";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const bookingStore = useBookingStore();
const authStore = useAuthStore();
const booking = useBooking();
const socketInstance = useSocket();
let rawSocket = null;

const processing = ref(false);
const paymentSuccess = ref(false);
const timeRemaining = ref("");
const errorMessage = ref("");
let countdownInterval = null;

const session = computed(() => bookingStore.session);
const blockedSeats = computed(() => bookingStore.selectedSeats);
const price = computed(() => bookingStore.price);
const total = computed(() => blockedSeats.value.length * price.value);
const expiresAt = computed(() => bookingStore.expiresAt);

const hasBlockedSeats = computed(() => blockedSeats.value.length > 0);

const priceItems = computed(() => {
  const items = [];
  const seatPrices = {};

  blockedSeats.value.forEach((seatId) => {
    const seat = bookingStore.seats.find((s) => s.id === seatId);
    if (seat) {
      const key = seat.type === "vip" ? "VIP" : "Standard";
      if (!seatPrices[key]) {
        seatPrices[key] = {
          count: 0,
          price: seat.type === "vip" ? price.value * 1.5 : price.value,
        };
      }
      seatPrices[key].count++;
    }
  });

  Object.entries(seatPrices).forEach(([label, data]) => {
    items.push({
      label: `${label} (x${data.count})`,
      amount: data.price * data.count,
    });
  });

  if (items.length > 0) {
    const taxRate = 0.1;
    const subtotal = total.value;
    const tax = subtotal * taxRate;
    items.push({
      label: "IVA (10%)",
      amount: tax,
    });
  }

  return items;
});

onMounted(() => {
  if (!session.value || blockedSeats.value.length === 0) {
    router.push("/movies");
    return;
  }

  if (session.value) {
    rawSocket = socketInstance.connect(session.value.id);
  }

  if (expiresAt.value) {
    const expiresAtDate = new Date(expiresAt.value);
    if (expiresAtDate > new Date()) {
      startCountdown(expiresAtDate);
    } else {
      errorMessage.value = "Els teus seients han expirat!";
      bookingStore.clearSelection();
      setTimeout(() => {
        router.push("/movies");
      }, 2000);
    }
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  socketInstance.disconnect();
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("ca-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSeatRow = (seatId) => {
  const seat = bookingStore.seats.find((s) => s.id === seatId);
  return seat?.row_label || "";
};

const getSeatNumber = (seatId) => {
  const seat = bookingStore.seats.find((s) => s.id === seatId);
  return seat?.number || "";
};

const startCountdown = (expiresAtDate) => {
  const update = () => {
    const now = new Date();
    const diff = expiresAtDate - now;

    if (diff <= 0) {
      timeRemaining.value = "Expirat!";
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      blockedSeats.value.forEach((seatId) => {
        socketInstance.emitSeatRelease(session.value.id, seatId);
      });

      bookingStore.clearSelection();
      errorMessage.value = "Temps expirat! Els seients s'han alliberat.";

      setTimeout(() => {
        router.push("/movies");
      }, 3000);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    timeRemaining.value = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (diff <= 60000) {
      timeRemaining.value = `Expire aviat: ${timeRemaining.value}`;
    }
  };

  update();
  countdownInterval = setInterval(update, 1000);
};

const cancelOrder = async () => {
  if (!session.value || blockedSeats.value.length === 0) return;

  processing.value = true;
  errorMessage.value = "";

  try {
    await booking.releaseSeats(session.value.id, blockedSeats.value);

    blockedSeats.value.forEach((seatId) => {
      socketInstance.emitSeatRelease(session.value.id, seatId);
    });

    bookingStore.clearSelection();

    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    router.push("/movies");
  } catch (error) {
    console.error("Error releasing seats:", error);
    errorMessage.value =
      error.data?.message || "Error en alliberar els seients";
  } finally {
    processing.value = false;
  }
};

const payNow = async () => {
  if (!session.value || blockedSeats.value.length === 0) return;

  processing.value = true;
  errorMessage.value = "";

  try {
    // Validar que session tiene ID
    if (!session.value.id || isNaN(session.value.id)) {
      throw new Error("Session ID inválid");
    }

    // Validar que blockedSeats son números
    const validSeatIds = blockedSeats.value.map((id) => {
      const numId = Number(id);
      if (isNaN(numId)) {
        throw new Error(`Seat ID inválid: ${id}`);
      }
      return numId;
    });

    if (validSeatIds.length === 0) {
      throw new Error("No seats selected");
    }

    console.log("Attempting to create order with:", {
      session_id: session.value.id,
      seats_ids: validSeatIds,
    });

    const orderResult = await booking.createOrder(
      session.value.id,
      validSeatIds,
    );

    if (orderResult.order) {
      bookingStore.setOrder(orderResult.order, orderResult.expires_at);

      const paymentResult = await booking.simulatePayment(orderResult.order.id);

      if (paymentResult.order) {
        socketInstance.emitSeatPurchase(session.value.id, blockedSeats.value);

        paymentSuccess.value = true;
        bookingStore.clearSelection();

        if (countdownInterval) {
          clearInterval(countdownInterval);
        }

        setTimeout(() => {
          router.push("/tickets");
        }, 3000);
      } else if (paymentResult.message) {
        errorMessage.value = paymentResult.message;
        await releaseSeatsOnError();
      }
    }
  } catch (error) {
    console.error("Payment error:", error);

    // Mostrar mensaje de error más descriptivo
    if (error.data?.message) {
      errorMessage.value = error.data.message;
    } else if (error.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value =
        "Error en el pagament. Els seients segueixen bloquejats.";
    }

    await releaseSeatsOnError();
  } finally {
    processing.value = false;
  }
};

const releaseSeatsOnError = async () => {
  try {
    await booking.releaseSeats(session.value.id, blockedSeats.value);
    blockedSeats.value.forEach((seatId) => {
      socketInstance.emitSeatRelease(session.value.id, seatId);
    });
    bookingStore.clearSelection();
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  } catch (releaseError) {
    console.error("Failed to release seats on error:", releaseError);
  }
};
</script>
