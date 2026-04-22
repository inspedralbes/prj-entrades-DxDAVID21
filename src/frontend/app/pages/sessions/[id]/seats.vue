<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center py-16">
      <UIcon
        name="i-heroicons-arrow-path"
        class="w-8 h-8 text-[#0068C8] animate-spin"
      />
    </div>

    <div v-else-if="session">
      <div class="bg-[#1A2238] rounded-xl p-6 mb-6">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        >
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">
              {{ session.movie?.title }}
            </h1>
            <div class="flex flex-wrap gap-4 text-gray-400">
              <span class="flex items-center gap-2">
                <UIcon name="i-heroicons-building-office" class="w-4 h-4" />
                {{ session.room?.name }}
              </span>
              <span class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                {{ formatDate(session.start_time) }}
              </span>
              <span class="text-[#F7C600] font-bold flex items-center gap-2">
                <UIcon name="i-heroicons-currency-euro" class="w-4 h-4" />
                {{ price }}€
              </span>
            </div>
          </div>
          <div class="text-right mt-4 md:mt-0">
            <div class="text-sm text-gray-500">Usuaris connectats</div>
            <div class="text-2xl font-bold text-[#0068C8]">
              {{ connectedUsers }}
            </div>
          </div>
        </div>

        <UAlert
          v-if="notification"
          :color="notificationType"
          variant="subtle"
          class="mb-6"
        >
          {{ notification }}
        </UAlert>

        <SeatSelector
          :seats="formattedSeats"
          :selected-seats="selectedSeatObjects"
          :base-price="price"
          @update:selected-seats="handleSeatUpdate"
        />

        <div class="mt-6 flex justify-end">
          <UButton
            size="lg"
            :loading="processing"
            :disabled="selectedSeats.length === 0"
            icon="i-heroicons-credit-card"
            class="bg-[#0068C8] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
            @click="proceedToCheckout"
          >
            Continuar a la compra
          </UButton>
        </div>

        <div
          v-if="recentActivity.length > 0"
          class="mt-6 pt-6 border-t border-gray-700"
        >
          <h3 class="text-sm font-semibold text-gray-400 mb-2">
            Activitat recent
          </h3>
          <div class="space-y-1">
            <div
              v-for="(activity, index) in recentActivity"
              :key="index"
              class="text-sm text-gray-500"
            >
              {{ activity }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="blockedTimeRemaining"
        class="bg-yellow-600 text-white px-4 py-2 rounded-lg text-center mb-4"
      >
        <UIcon name="i-heroicons-clock" class="w-5 h-5 mr-2" />
        Temps restant per completar la compra: {{ blockedTimeRemaining }}
      </div>
    </div>

    <div v-else class="text-center py-16">
      <div class="text-gray-400 text-xl mb-4">Sessió no trobada</div>
      <NuxtLink to="/movies">
        <UButton
          class="bg-[#0068C8] text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-[#004fa3] active:bg-[#003d75] transition-all duration-200 transform hover:scale-105"
        >
          Tornar a les pel·lícules
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { useBookingStore } from "~/stores/booking";

const route = useRoute();
const router = useRouter();
const sessionId = parseInt(route.params.id);

const authStore = useAuthStore();
const bookingStore = useBookingStore();

const loading = ref(true);
const processing = ref(false);
const blockedTimeRemaining = ref("");
const connectedUsers = ref(0);
const notification = ref("");
const notificationType = ref("info");
const recentActivity = ref([]);
let countdownInterval = null;
let notificationTimeout = null;

const session = ref(null);
const selectedSeats = ref([]);
const selectedSeatObjects = ref([]);
const price = ref(12);

const publicSessions = usePublicSessions();
const booking = useBooking();
const socketInstance = useSocket();
let rawSocket = null;

onMounted(async () => {
  try {
    const data = await publicSessions.getSessionSeats(sessionId);
    session.value = data.session;
    price.value = data.price;

    bookingStore.setSessionData(data.session, data.seats, data.price);
    selectedSeats.value = [];
    selectedSeatObjects.value = [];

    rawSocket = socketInstance.connect(sessionId);

    rawSocket.on("users:count", (data) => {
      if (data.sessionId === sessionId) {
        connectedUsers.value = data.count;
      }
    });

    rawSocket.on("activity", (data) => {
      if (data.sessionId === sessionId && data.userId !== authStore.user?.id) {
        addActivity(data.message);

        if (data.type === "seats_purchased") {
          showNotification(
            `S'han venut ${data.seatIds?.length || 1} seient(s)!`,
            "warning",
          );
        }
      }
    });

    rawSocket.on("seat:status", (data) => {
      if (data.sessionId === sessionId) {
        bookingStore.updateSeatStatus(data.seatId, data.status);

        if (
          data.status === "blocked" &&
          data.blockedBy !== authStore.user?.id
        ) {
          showNotification(`Un altre usuari ha bloquejat un seient`, "info");
        } else if (data.status === "purchased") {
          showNotification(`Un seient ha estat venut!`, "warning");
        }
      }
    });
  } catch (error) {
    console.error("Error loading session:", error);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  socketInstance.disconnect();
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }
});

const seatsByRow = computed(() => bookingStore.getSeatsByRow);
const orderedRows = computed(() => Object.keys(seatsByRow.value).sort());

const formattedSeats = computed(() => {
  const rows = [];
  for (const rowLabel of orderedRows.value) {
    const row = [];
    for (const seat of seatsByRow.value[rowLabel]) {
      let status = "available";
      if (seat.status === "purchased") {
        status = "occupied";
      } else if (seat.status === "blocked") {
        if (isMyBlockedSeat(seat)) {
          status = "selected";
        } else {
          status = "occupied";
        }
      } else if (selectedSeats.value.includes(seat.id)) {
        status = "selected";
      }

      row.push({
        id: seat.id,
        number: seat.number,
        status,
        price: price.value,
      });
    }
    rows.push(row);
  }
  return rows;
});

function handleSeatUpdate(seats) {
  selectedSeatObjects.value = seats;
  selectedSeats.value = seats.map((s) => s.id);
}

const showNotification = (message, type = "info") => {
  notification.value = message;
  notificationType.value = type;

  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
  }

  notificationTimeout = setTimeout(() => {
    notification.value = "";
  }, 5000);
};

const addActivity = (message) => {
  const timestamp = new Date().toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  recentActivity.value.unshift(`[${timestamp}] ${message}`);
  if (recentActivity.value.length > 5) {
    recentActivity.value.pop();
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("ca-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isMyBlockedSeat = (seat) => {
  return seat.blocked_by === authStore.user?.id;
};

const proceedToCheckout = async () => {
  if (selectedSeats.value.length === 0) return;

  processing.value = true;

  try {
    console.log("Bloqueando asientos:", selectedSeats.value);
    const result = await booking.blockSeats(sessionId, selectedSeats.value);
    console.log("Resultado del bloqueo:", result);

    if (result && result.session_seats) {
      result.session_seats.forEach((seatData) => {
        socketInstance.emitSeatBlock(sessionId, seatData.id, result.expires_at);
      });

      bookingStore.setBlockedSeats(result.session_seats, result.expires_at);

      const expiresAt = new Date(result.expires_at);
      startCountdown(expiresAt);

      showNotification(
        "Seients bloquejats! Tens 15 minuts per completar la compra.",
        "success",
      );

      setTimeout(() => {
        router.push("/checkout");
      }, 1500);
    } else {
      console.error("Respuesta inesperada del servidor:", result);
      showNotification("Error: Respuesta inesperada del servidor", "error");
    }
  } catch (error) {
    console.error("Error blocking seats:", error);
    const errorMessage =
      error.data?.message || error.message || "Error en bloquejar els seients";
    showNotification(errorMessage, "error");
  } finally {
    processing.value = false;
  }
};

const startCountdown = (expiresAt) => {
  const update = () => {
    const now = new Date();
    const diff = expiresAt - now;

    if (diff <= 0) {
      blockedTimeRemaining.value = "Expirat!";
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      selectedSeats.value.forEach((seatId) => {
        socketInstance.emitSeatRelease(sessionId, seatId);
      });
      bookingStore.clearSelection();

      showNotification("Temps expirat! Els seients s'han alliberat.", "error");

      setTimeout(() => {
        router.push("/movies");
      }, 2000);
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    blockedTimeRemaining.value = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (diff <= 60000) {
      blockedTimeRemaining.value = `Expire aviat: ${blockedTimeRemaining.value}`;
    }
  };

  update();
  countdownInterval = setInterval(update, 1000);
};
</script>
