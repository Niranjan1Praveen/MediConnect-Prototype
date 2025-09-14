"use client";
import { useEffect, useRef } from "react";

export default function VideoCall({ myStream, remoteStream }) {
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Attach local stream
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // Attach remote stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <video
        ref={myVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "45%", border: "2px solid green" }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "45%", border: "2px solid red" }}
      />
    </div>
  );
}
