import { WebSocketMessage } from "@shared/schema";

export let websocket: WebSocket | null = null;

export const setupWebSocket = (sessionId: string) => {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  websocket = new WebSocket(wsUrl);
  
  websocket.onopen = () => {
    console.log("WebSocket connection established");
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: "user_connected",
        sessionId
      } as WebSocketMessage));
    }
  };
  
  websocket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
  
  websocket.onclose = () => {
    console.log("WebSocket connection closed");
    // Implement reconnection logic if needed
    setTimeout(() => {
      if (websocket?.readyState !== WebSocket.OPEN) {
        setupWebSocket(sessionId);
      }
    }, 5000);
  };

  return websocket;
};
