const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const axios = require("axios");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const activeSessions = new Map();
const connectedUsers = new Map();
const userBlockedSeats = new Map();

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "http://localhost:8000/api";

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", connections: io.engine.clientsCount });
});

app.post("/emit", (req, res) => {
  const { event, room, data } = req.body;
  if (event && room) {
    io.to(room).emit(event, data);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Missing event or room" });
  }
});

app.post("/broadcast", (req, res) => {
  const { event, data } = req.body;
  if (event) {
    io.emit(event, data);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Missing event" });
  }
});

io.on("connection", (socket) => {
  const sessionId = socket.handshake.query.sessionId;
  const userId = socket.handshake.query.userId;
  const token = socket.handshake.query.token;

  console.log(`User connected: ${socket.id}, session: ${sessionId}, user: ${userId}`);

  if (sessionId) {
    const roomName = `session_${sessionId}`;
    socket.join(roomName);

    if (!activeSessions.has(roomName)) {
      activeSessions.set(roomName, new Set());
    }
    activeSessions.get(roomName).add(socket.id);

    if (userId) {
      connectedUsers.set(socket.id, { sessionId, userId, token, joinedAt: new Date() });
    }

    const userCount = activeSessions.get(roomName).size;
    io.to(roomName).emit("users:count", { sessionId: parseInt(sessionId), count: userCount });

    console.log(`Room ${roomName} now has ${userCount} users`);
  }

  socket.on("session:join", (data) => {
    const { sessionId, userId, token } = data;
    const roomName = `session_${sessionId}`;

    socket.join(roomName);

    if (!activeSessions.has(roomName)) {
      activeSessions.set(roomName, new Set());
    }
    activeSessions.get(roomName).add(socket.id);

    if (userId) {
      connectedUsers.set(socket.id, { sessionId, userId, token, joinedAt: new Date() });
    }

    const userCount = activeSessions.get(roomName).size;
    io.to(roomName).emit("users:count", { sessionId: parseInt(sessionId), count: userCount });
    io.to(roomName).emit("user:joined", { sessionId: parseInt(sessionId), userId, socketId: socket.id });

    console.log(`User ${userId} joined session ${sessionId}`);
  });

  socket.on("session:leave", async (data) => {
    const { sessionId, userId } = data;
    const roomName = `session_${sessionId}`;

    socket.leave(roomName);

    const userData = connectedUsers.get(socket.id);
    const token = userData?.token || null;

    const userKey = `${sessionId}_${userId}`;
    const blockedSeats = userBlockedSeats.get(userKey) || [];

    if (blockedSeats.size > 0) {
      console.log(`Releasing ${blockedSeats.size} seats on session leave for user ${userId}`);

      for (const seatId of blockedSeats) {
        try {
          await axios.post(`${LARAVEL_API_URL}/orders/release-seats`, {
            session_id: parseInt(sessionId),
            seats_ids: [seatId]
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            }
          });

          io.to(roomName).emit("seat:status", {
            sessionId: parseInt(sessionId),
            seatId,
            status: "available",
            blockedBy: null,
            lockedUntil: null,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error(`Failed to release seat ${seatId}:`, error.message);
        }
      }

      userBlockedSeats.delete(userKey);
    }

    if (activeSessions.has(roomName)) {
      activeSessions.get(roomName).delete(socket.id);
      const userCount = activeSessions.get(roomName).size;
      io.to(roomName).emit("users:count", { sessionId: parseInt(sessionId), count: userCount });
    }

    if (userId) {
      connectedUsers.delete(socket.id);
      io.to(roomName).emit("user:left", { sessionId: parseInt(sessionId), userId });
    }

    console.log(`User ${userId} left session ${sessionId}`);
  });

  socket.on("seat:block", (data) => {
    const { sessionId, seatId, userId, lockedUntil } = data;
    const roomName = `session_${sessionId}`;

    const userKey = `${sessionId}_${userId}`;
    if (!userBlockedSeats.has(userKey)) {
      userBlockedSeats.set(userKey, new Set());
    }
    userBlockedSeats.get(userKey).add(seatId);

    console.log(`Seat blocked: session=${sessionId}, seat=${seatId}, user=${userId}`);

    io.to(roomName).emit("seat:status", {
      sessionId: parseInt(sessionId),
      seatId,
      status: "blocked",
      blockedBy: userId,
      lockedUntil,
      timestamp: new Date().toISOString()
    });

    io.to(roomName).emit("activity", {
      type: "seat_blocked",
      sessionId: parseInt(sessionId),
      seatId,
      userId,
      message: `User blocked seat ${seatId}`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("seat:release", (data) => {
    const { sessionId, seatId, userId } = data;
    const roomName = `session_${sessionId}`;

    const userKey = `${sessionId}_${userId}`;
    if (userBlockedSeats.has(userKey)) {
      userBlockedSeats.get(userKey).delete(seatId);
    }

    console.log(`Seat released: session=${sessionId}, seat=${seatId}, user=${userId}`);

    io.to(roomName).emit("seat:status", {
      sessionId: parseInt(sessionId),
      seatId,
      status: "available",
      blockedBy: null,
      lockedUntil: null,
      timestamp: new Date().toISOString()
    });

    io.to(roomName).emit("activity", {
      type: "seat_released",
      sessionId: parseInt(sessionId),
      seatId,
      userId,
      message: `User released seat ${seatId}`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("seat:purchase", (data) => {
    const { sessionId, seatIds, userId } = data;
    const roomName = `session_${sessionId}`;

    console.log(`Seats purchased: session=${sessionId}, seats=${seatIds.join(",")}, user=${userId}`);

    seatIds.forEach((seatId) => {
      io.to(roomName).emit("seat:status", {
        sessionId: parseInt(sessionId),
        seatId,
        status: "purchased",
        timestamp: new Date().toISOString()
      });
    });

    io.to(roomName).emit("activity", {
      type: "seats_purchased",
      sessionId: parseInt(sessionId),
      seatIds,
      userId,
      message: `User purchased ${seatIds.length} seat(s)`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("admin:subscribe", (data) => {
    const { sessionId } = data;
    const roomName = `session_${sessionId}`;

    socket.join(`admin_${roomName}`);

    const userCount = activeSessions.has(roomName) ? activeSessions.get(roomName).size : 0;

    socket.emit("admin:stats", {
      sessionId: parseInt(sessionId),
      connectedUsers: userCount,
      timestamp: new Date().toISOString()
    });

    console.log(`Admin subscribed to session ${sessionId}`);
  });

  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);

const userData = connectedUsers.get(socket.id);
    if (userData) {
      const { sessionId, userId, token } = userData;
      const roomName = `session_${sessionId}`;

      const userKey = `${sessionId}_${userId}`;
      const blockedSeats = userBlockedSeats.get(userKey) || [];

      if (blockedSeats.size > 0) {
        console.log(`Releasing ${blockedSeats.size} seats on disconnect for user ${userId}`);

        for (const seatId of blockedSeats) {
          try {
            await axios.post(`${LARAVEL_API_URL}/orders/release-seats`, {
              session_id: parseInt(sessionId),
              seats_ids: [seatId]
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
              }
            });

            io.to(roomName).emit("seat:status", {
              sessionId: parseInt(sessionId),
              seatId,
              status: "available",
              blockedBy: null,
              lockedUntil: null,
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            console.error(`Failed to release seat ${seatId}:`, error.message);
          }
        }

        userBlockedSeats.delete(userKey);
      }

      if (activeSessions.has(roomName)) {
        activeSessions.get(roomName).delete(socket.id);
        const userCount = activeSessions.get(roomName).size;
        io.to(roomName).emit("users:count", { sessionId: parseInt(sessionId), count: userCount });
        io.to(roomName).emit("user:left", { sessionId: parseInt(sessionId), userId });
      }

      connectedUsers.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Realtime server running on port ${PORT}`);
});