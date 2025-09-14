"use client";

import { useState, useEffect } from "react";
import { useSocket, SocketProvider } from "@/lib/socket";
import peerService from "@/lib/peer";
import VideoCall from "@/components/dashboard/VideoCall";

function RoomInner({ roomId }) {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // -------------------- Handle remote stream --------------------
  useEffect(() => {
    peerService.peer.ontrack = (event) => {
      console.log("📡 Remote track received");
      setRemoteStream(event.streams[0]);
    };
  }, []);

  // -------------------- Get Local Media --------------------
  useEffect(() => {
    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);

        // Add tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerService.peer.addTrack(track, stream);
        });
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    }
    initMedia();
  }, []);

  // -------------------- ICE Candidate --------------------
  useEffect(() => {
    peerService.peer.onicecandidate = (event) => {
      if (event.candidate && remoteSocketId) {
        console.log("📨 Sending ICE candidate");
        socket.emit("ice-candidate", { to: remoteSocketId, candidate: event.candidate });
      }
    };
  }, [remoteSocketId, socket]);

  // -------------------- Socket Handlers --------------------
  useEffect(() => {
    socket.on("user:joined", async ({ id }) => {
      console.log("👤 User joined:", id);
      setRemoteSocketId(id);

      if (myStream) {
        const offer = await peerService.getOffer();
        socket.emit("user:call", { to: id, offer });
      }
    });

    socket.on("incoming:call", async ({ from, offer }) => {
      console.log("📞 Incoming call from:", from);
      setRemoteSocketId(from);

      const answer = await peerService.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans: answer });
    });

    socket.on("call:accepted", async ({ ans }) => {
      console.log("✅ Call accepted");
      await peerService.setRemoteAnswer(ans);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("🧊 ICE candidate received");
      try {
        await peerService.peer.addIceCandidate(candidate);
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    return () => {
      socket.off("user:joined");
      socket.off("incoming:call");
      socket.off("call:accepted");
      socket.off("ice-candidate");
    };
  }, [socket, myStream]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Room: {roomId}</h1>
      <h4>{remoteSocketId ? "Connected ✅" : "Waiting for others..."}</h4>

      <VideoCall myStream={myStream} remoteStream={remoteStream} />
    </div>
  );
}

export default async function RoomPage({ params }) {
  const { roomId } = params;
  return (
    <SocketProvider>
      <RoomInner roomId={roomId} />
    </SocketProvider>
  );
}