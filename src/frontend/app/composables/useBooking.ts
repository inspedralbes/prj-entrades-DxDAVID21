import { useAuthStore } from "~/stores/auth";

export const useBooking = () => {
  const authStore = useAuthStore();
  const config = useRuntimeConfig();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
  });

  const getSessionSeats = async (sessionId: number) => {
    return await $fetch(
      `${config.public.apiBase}/sessions/${sessionId}/seats`,
      {},
    );
  };

  const blockSeats = async (
    sessionId: number,
    seatIds: (number | string)[],
  ) => {
    return await $fetch(`${config.public.apiBase}/orders/block-seats`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: {
        session_id: sessionId,
        seats_ids: seatIds.map((id) => Number(id)),
      },
    });
  };

  const releaseSeats = async (sessionId: number, seatIds: number[]) => {
    return await $fetch(`${config.public.apiBase}/orders/release-seats`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: { session_id: sessionId, seats_ids: seatIds },
    });
  };

  const createOrder = async (sessionId: number, seatIds: number[]) => {
    // Validar que el session_id es un número válido
    if (!sessionId || isNaN(sessionId)) {
      throw new Error("Invalid session ID");
    }

    // Convertir todos los seat IDs a números enteros
    const validatedSeatIds = seatIds.map((id) => {
      const numId = Number(id);
      if (isNaN(numId)) {
        throw new Error(`Invalid seat ID: ${id}`);
      }
      return numId;
    });

    if (validatedSeatIds.length === 0) {
      throw new Error("No seats selected");
    }

    console.log("Creating order with:", {
      session_id: sessionId,
      seats_ids: validatedSeatIds,
    });

    return await $fetch(`${config.public.apiBase}/orders/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: { session_id: sessionId, seats_ids: validatedSeatIds },
    });
  };

  const simulatePayment = async (orderId: number) => {
    return await $fetch(`${config.public.apiBase}/orders/simulate-payment`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: { order_id: orderId },
    });
  };

  const getMyOrders = async () => {
    return await $fetch(`${config.public.apiBase}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
  };


  return {
    getSessionSeats,
    blockSeats,
    releaseSeats,
    createOrder,
    simulatePayment,
    getMyOrders,
  };
};
