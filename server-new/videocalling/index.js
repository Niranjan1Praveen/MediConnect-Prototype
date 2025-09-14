const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: { origin: "*" },
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  // ---------------- Room join ----------------
  socket.on("room:join", ({ email, room }) => {
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    socket.join(room);

    // Notify current user: include existing users
    const existingUsers = [];
    for (let [sockId] of socket.adapter.rooms.get(room) || []) {
      if (sockId !== socket.id) existingUsers.push(sockId);
    }
    io.to(socket.id).emit("room:join", { email, room, existingUsers });

    // Notify others in the room that a new user joined
    socket.to(room).emit("user:joined", { email, id: socket.id });
  });

  // ---------------- WebRTC signaling ----------------
  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  // ---------------- ICE candidate ----------------
  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", { candidate });
  });

  // ---------------- Disconnect ----------------
  socket.on("disconnect", () => {
    console.log("Socket Disconnected:", socket.id);
    const email = socketidToEmailMap.get(socket.id);
    emailToSocketIdMap.delete(email);
    socketidToEmailMap.delete(socket.id);
    // Notify room members that user left (optional)
  });
});
