"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSocket, SocketProvider } from "@/lib/socket";
import peerService from "@/lib/peer";

function LobbyInner() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const router = useRouter();

  const handleSubmitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email || !room) return;

      // Capture local media before joining room
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        peerService.addStream(stream);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }

      // Emit join room event
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  // Navigate to room when server confirms join
  const handleJoinRoom = useCallback(
    ({ room }) => {
      router.push(`/doctor/videocall/${room}`);
    },
    [router]
  );

  // ✅ Add listener in useEffect
  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => socket.off("room:join", handleJoinRoom);
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Join Video Call
          </h1>
          <p className="text-gray-600">
            Enter your details to join the consultation room
          </p>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter room ID"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Join Room
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Make sure your camera and microphone are ready for the call
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LobbyPage() {
  return (
    <SocketProvider>
      <LobbyInner />
    </SocketProvider>
  );
}
