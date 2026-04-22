import { useAuthStore } from "~/stores/auth";

export const useBooking = () => {
  const authStore = useAuthStore();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authStore.token}`,
  });

  const getSessionSeats = async (sessionId: number) => {
    return await $fetch(
      `http://localhost:8000/api/sessions/${sessionId}/seats`,
      {},
    );
  };

  const blockSeats = async (
    sessionId: number,
    seatIds: (number | string)[],
  ) => {
    return await $fetch("http://localhost:8000/api/orders/block-seats", {
      method: "POST",
      headers: getAuthHeaders(),
      body: {
        session_id: sessionId,
        seats_ids: seatIds.map((id) => Number(id)),
      },
    });
  };

  const releaseSeats = async (sessionId: number, seatIds: number[]) => {
    return await $fetch("http://localhost:8000/api/orders/release-seats", {
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

    return await $fetch("http://localhost:8000/api/orders/create", {
      method: "POST",
      headers: getAuthHeaders(),
      body: { session_id: sessionId, seats_ids: validatedSeatIds },
    });
  };

  const simulatePayment = async (orderId: number) => {
    return await $fetch("http://localhost:8000/api/orders/simulate-payment", {
      method: "POST",
      headers: getAuthHeaders(),
      body: { order_id: orderId },
    });
  };

  const getMyOrders = async () => {
    return await $fetch("http://localhost:8000/api/orders/my-orders", {
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
