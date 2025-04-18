import { websocket } from "./websocket";

export let peerConnection: RTCPeerConnection | null = null;

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ]
};

export const setupRTCPeerConnection = (
  sessionId: string,
  partnerId: string,
  stream: MediaStream,
  isInitiator: boolean
) => {
  // Close any existing connections
  if (peerConnection) {
    peerConnection.close();
  }

  peerConnection = new RTCPeerConnection(ICE_SERVERS);
  
  // Add local audio tracks to peer connection
  stream.getTracks().forEach(track => {
    peerConnection.addTrack(track, stream);
  });
  
  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate && websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: "signal",
        sessionId,
        partnerId,
        signal: {
          type: "candidate",
          candidate: event.candidate
        }
      }));
    }
  };
  
  // Handle connection state changes
  peerConnection.onconnectionstatechange = () => {
    console.log("Connection state:", peerConnection?.connectionState);
  };
  
  // Handle receiving remote tracks
  peerConnection.ontrack = (event) => {
    const remoteAudio = document.createElement('audio');
    remoteAudio.srcObject = event.streams[0];
    remoteAudio.autoplay = true;
    remoteAudio.id = 'remoteAudio';
    
    // Replace any existing remote audio element
    const existingAudio = document.getElementById('remoteAudio');
    if (existingAudio) {
      existingAudio.remove();
    }
    
    document.body.appendChild(remoteAudio);
  };
  
  // If initiator, create and send offer
  if (isInitiator) {
    peerConnection.createOffer()
      .then(offer => peerConnection!.setLocalDescription(offer))
      .then(() => {
        if (websocket && websocket.readyState === WebSocket.OPEN && peerConnection?.localDescription) {
          websocket.send(JSON.stringify({
            type: "signal",
            sessionId,
            partnerId,
            signal: peerConnection.localDescription
          }));
        }
      })
      .catch(error => console.error("Error creating offer:", error));
  }
  
  return peerConnection;
};
