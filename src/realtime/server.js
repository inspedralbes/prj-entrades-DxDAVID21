const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

const activeSessions = new Map();

io.on("connection", (socket) => {
  const sessionId = socket.handshake.query.sessionId;

  if (sessionId) {
    socket.join(`session_${sessionId}`);
    console.log(`User connected to session ${sessionId}`);
  }

  socket.on("join-session", (data) => {
    const { sessionId } = data;
    socket.join(`session_${sessionId}`);

    if (!activeSessions.has(sessionId)) {
      activeSessions.set(sessionId, new Set());
    }
    activeSessions.get(sessionId).add(socket.id);
  });

  socket.on("leave-session", (data) => {
    const { sessionId } = data;
    socket.leave(`session_${sessionId}`);

    if (activeSessions.has(sessionId)) {
      activeSessions.get(sessionId).delete(socket.id);
    }
  });

  socket.on("seat:block", (data) => {
    const { sessionId, seatId, userId, lockedUntil } = data;

    io.to(`session_${sessionId}`).emit("seat:update", {
      seatId,
      status: "blocked",
      blockedBy: userId,
      lockedUntil,
    });
  });

  socket.on("seat:release", (data) => {
    const { sessionId, seatId } = data;

    io.to(`session_${sessionId}`).emit("seat:update", {
      seatId,
      status: "available",
      blockedBy: null,
      lockedUntil: null,
    });
  });

  socket.on("seat:purchase", (data) => {
    const { sessionId, seatId } = data;

    io.to(`session_${sessionId}`).emit("seat:update", {
      seatId,
      status: "purchased",
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Realtime server running on port 3001");
});