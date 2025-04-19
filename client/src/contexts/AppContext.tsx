import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { WebSocketMessage } from "@shared/schema";
import { setupWebSocket, websocket } from "../lib/websocket";
import { setupRTCPeerConnection, peerConnection } from "../lib/webrtc";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  type: string;
  sentiment?: number; // Added sentiment field
  language?: string; // Added language field
}

interface AppContextProps {
  connectionState: "disconnected" | "connecting" | "connected";
  isMuted: boolean;
  messages: Message[];
  currentUser: User;
  partner: User | null;
  showFirstVisitModal: boolean;
  showConnectionModal: boolean;
  audioStream: MediaStream | null;
  sendMessage: (content: string) => void;
  findNextPartner: () => void;
  toggleMute: () => void;
  hideFirstVisitModal: () => void;
  cancelConnection: () => void;
  getStarted: () => Promise<boolean>;
}

const defaultContext: AppContextProps = {
  connectionState: "disconnected",
  isMuted: false,
  messages: [],
  currentUser: { id: "", name: "", avatar: "" },
  partner: null,
  showFirstVisitModal: true,
  showConnectionModal: false,
  audioStream: null,
  sendMessage: () => {},
  findNextPartner: () => {},
  toggleMute: () => {},
  hideFirstVisitModal: () => {},
  cancelConnection: () => {},
  getStarted: async () => false
};

const AppContext = createContext<AppContextProps>(defaultContext);

export const useAppContext = () => useContext(AppContext);

const generateRandomName = (): string => {
  const firstNames = [
    "Alex", "Taylor", "Jordan", "Casey", "Riley", "Morgan", "Quinn", "Avery",
    "Jamie", "Charlie", "Skyler", "Dakota", "Peyton", "Reese", "Finley", "Sasha"
  ];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
};

const getInitials = (name: string): string => {
  return name.substring(0, 2).toUpperCase();
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [connectionState, setConnectionState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const randomName = generateRandomName();
    return {
      id: crypto.randomUUID(),
      name: randomName,
      avatar: getInitials(randomName)
    };
  });
  const [partner, setPartner] = useState<User | null>(null);
  const [showFirstVisitModal, setShowFirstVisitModal] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const hideFirstVisitModal = () => {
    setShowFirstVisitModal(false);
  };

  const cancelConnection = () => {
    setShowConnectionModal(false);
    setConnectionState("disconnected");

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: "cancel_connection",
        sessionId: currentUser.id
      }));
    }
  };

  const getStarted = async () => {
    console.log("getStarted function called");

    try {
      console.log("Requesting microphone access...");

      // Create a timeout promise to fail faster if permission takes too long
      const timeoutPromise = new Promise<MediaStream>((_, reject) => {
        setTimeout(() => reject(new Error("Microphone permission request timed out")), 8000);
      });

      // Request microphone access with a timeout
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }),
        timeoutPromise
      ]);

      console.log("Microphone access granted");

      // Set the audio stream after successful permission
      setAudioStream(stream);

      // Hide the welcome modal only after successful microphone access
      hideFirstVisitModal();

      // Initialize the WebSocket connection in parallel with the UI update
      setTimeout(() => {
        initializeWebSocketConnection();
      }, 0);

      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);

      // Add appropriate error handling message to the user
      if (error instanceof Error && error.message === "Microphone permission request timed out") {
        addSystemMessage("Taking too long to access microphone. Please check browser permissions or try again.");
      } else {
        addSystemMessage("Failed to access microphone. Please ensure your microphone is connected and you've granted permission.");
      }

      // Don't hide the welcome screen if there was an error
      return false;
    }
  };

  const addSystemMessage = (content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      senderId: "system",
      senderName: "System",
      timestamp: Date.now(),
      type: "system"
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const initializeWebSocketConnection = () => {
    try {
      const ws = setupWebSocket(currentUser.id);
      console.log("WebSocket setup result:", ws ? "Success" : "Failed");

      if (websocket) {
        websocket.onmessage = (event) => {
          const data: WebSocketMessage = JSON.parse(event.data);

          switch (data.type) {
            case "user_connected":
              // Initial connection acknowledgment
              addSystemMessage("Connected to server. Click 'Next Partner' to start chatting.");
              break;

            case "partner_found":
              if (data.partnerId && data.username) {
                setPartner({
                  id: data.partnerId,
                  name: data.username,
                  avatar: getInitials(data.username)
                });
                setConnectionState("connected");
                setShowConnectionModal(false);
                addSystemMessage(`Connected with ${data.username}. Say hello!`);

                // Initialize WebRTC after partner is found
                if (audioStream) {
                  setupRTCPeerConnection(currentUser.id, data.partnerId, audioStream, false);
                }
              }
              break;

            case "signal":
              if (data.signal && peerConnection) {
                handleSignalingData(data.signal);
              }
              break;

            case "message_received":
              if (data.message) {
                const newMessage: Message = {
                  id: crypto.randomUUID(),
                  content: data.message.content,
                  senderId: data.message.senderId,
                  senderName: data.message.senderName,
                  timestamp: data.message.timestamp,
                  type: data.message.type
                };
                setMessages(prev => [...prev, newMessage]);
              }
              break;

            case "partner_disconnected":
              addSystemMessage("Your partner has disconnected.");
              setPartner(null);
              setConnectionState("disconnected");
              break;

            case "no_partners_available":
              addSystemMessage("No partners are available right now. Please try again in a moment.");
              setShowConnectionModal(false);
              setConnectionState("disconnected");
              break;
          }
        };

        setIsInitialized(true);
      }
    } catch (error) {
      console.error("Error initializing WebSocket connection:", error);
    }
  };

  const handleSignalingData = (signal: any) => {
    if (!peerConnection) {
      console.error("No peer connection available");
      return;
    }

    if (signal.type === 'offer') {
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal))
        .then(() => peerConnection!.createAnswer())
        .then(answer => peerConnection!.setLocalDescription(answer))
        .then(() => {
          if (websocket && websocket.readyState === WebSocket.OPEN && peerConnection && peerConnection.localDescription) {
            websocket.send(JSON.stringify({
              type: "signal",
              sessionId: currentUser.id,
              partnerId: partner?.id,
              signal: peerConnection.localDescription
            }));
          }
        })
        .catch(error => console.error("Error handling offer:", error));
    } else if (signal.type === 'answer') {
      peerConnection.setRemoteDescription(new RTCSessionDescription(signal))
        .catch(error => console.error("Error setting remote description:", error));
    } else if (signal.candidate) {
      peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate))
        .catch(error => console.error("Error adding ICE candidate:", error));
    }
  };

  const findNextPartner = () => {
    if (connectionState === "connected" && partner) {
      // Disconnect from current partner
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: "disconnect_partner",
          sessionId: currentUser.id,
          partnerId: partner.id
        }));
      }

      // Clean up existing peer connection
      if (peerConnection) {
        peerConnection.close();
      }

      setPartner(null);
    }

    setConnectionState("connecting");
    setShowConnectionModal(true);

    // Request a new partner
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: "find_partner",
        sessionId: currentUser.id,
        username: currentUser.name
      }));
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (audioStream) {
      audioStream.getAudioTracks().forEach(track => {
        track.enabled = !newMutedState; // When muted is true, we need to disable the track
      });
    }
  };

  const sendMessage = (content: string) => {
    if (!content.trim() || !partner) return;

    // Analyze sentiment
    const Sentiment = require('sentiment');
    const sentiment = new Sentiment();
    const sentimentScore = sentiment.analyze(content).score;

    // Detect language
    const LanguageDetect = require('langdetect');
    const detector = new LanguageDetect();
    const detectedLang = detector.detect(content);

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: Date.now(),
      type: "text",
      sentiment: sentimentScore,
      language: detectedLang[0]?.lang || 'unknown'
    };

    setMessages(prev => [...prev, newMessage]);

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: "send_message",
        sessionId: currentUser.id,
        partnerId: partner.id,
        message: {
          content,
          senderId: currentUser.id,
          senderName: currentUser.name,
          timestamp: Date.now(),
          type: "text"
        }
      }));
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }

      if (peerConnection) {
        peerConnection.close();
      }

      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const value: AppContextProps = {
    connectionState,
    isMuted,
    messages,
    currentUser,
    partner,
    showFirstVisitModal,
    showConnectionModal,
    audioStream,
    sendMessage,
    findNextPartner,
    toggleMute,
    hideFirstVisitModal,
    cancelConnection,
    getStarted
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};