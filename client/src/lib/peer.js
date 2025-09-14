"use client";

class PeerService {
  constructor() {
    if (typeof window !== "undefined" && !this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:stun.l.google.com:19302"] },
        ],
      });

      this.peer.onicecandidate = (event) => {
        if (event.candidate && this.onIceCandidate) {
          this.onIceCandidate(event.candidate);
        }
      };

      this.peer.ontrack = (event) => {
        if (this.onTrack) {
          this.onTrack(event.streams[0]);
        }
      };
    }
  }

  async getOffer() {
    if (!this.peer) return;
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    return offer;
  }

  async getAnswer(offer) {
    if (!this.peer) return;
    await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peer.createAnswer();
    await this.peer.setLocalDescription(answer);
    return answer;
  }

  async setRemoteAnswer(answer) {
    if (!this.peer) return;
    await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
  }

  addStream(stream) {
    if (!this.peer) return;
    stream.getTracks().forEach(track => this.peer.addTrack(track, stream));
  }

  setOnIceCandidate(callback) {
    this.onIceCandidate = callback;
  }

  setOnTrack(callback) {
    this.onTrack = callback;
  }
}

let peerService;
if (typeof window !== "undefined") {
  peerService = new PeerService();
}

export default peerService;
