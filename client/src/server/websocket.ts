import { WebSocketServer, WebSocket } from "ws";
import { SessionManager } from "./session";
import { WebSocketMessage } from "@shared/schema";

export function setupWebSocketHandlers(wss: WebSocketServer, sessionManager: SessionManager) {
  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    
    ws.on('message', (message: string) => {
      try {
        const data: WebSocketMessage = JSON.parse(message.toString());
        
        switch (data.type) {
          case "user_connected":
            if (data.sessionId) {
              handleUserConnected(ws, data.sessionId, sessionManager);
            }
            break;
            
          case "find_partner":
            if (data.sessionId && data.username) {
              handleFindPartner(ws, data.sessionId, data.username, sessionManager);
            }
            break;
            
          case "disconnect_partner":
            if (data.sessionId && data.partnerId) {
              handleDisconnectPartner(data.sessionId, data.partnerId, sessionManager);
            }
            break;
            
          case "cancel_connection":
            if (data.sessionId) {
              handleCancelConnection(data.sessionId, sessionManager);
            }
            break;
            
          case "signal":
            if (data.sessionId && data.partnerId && data.signal) {
              handleSignal(data.sessionId, data.partnerId, data.signal, sessionManager);
            }
            break;
            
          case "send_message":
            if (data.sessionId && data.partnerId && data.message) {
              handleSendMessage(data.sessionId, data.partnerId, data.message, sessionManager);
            }
            break;
        }
      } catch (error) {
        console.error("Error processing websocket message:", error);
      }
    });
    
    ws.on('close', () => {
      // Find and remove the session when client disconnects
      console.log('Client disconnected');
      sessionManager.removeBySocket(ws);
    });
  });
}

function handleUserConnected(ws: WebSocket, sessionId: string, sessionManager: SessionManager) {
  // Register the user in the session manager with their WebSocket connection
  sessionManager.addSession(sessionId, ws);
  
  // Confirm connection to the client
  sendToClient(ws, {
    type: "user_connected"
  });
}

function handleFindPartner(ws: WebSocket, sessionId: string, username: string, sessionManager: SessionManager) {
  // Update session state
  sessionManager.updateSession(sessionId, { status: "waiting", username });
  
  // Try to find a waiting partner
  const partner = sessionManager.findWaitingPartner(sessionId);
  
  if (partner) {
    // Partner found, update both sessions
    const session = sessionManager.getSession(sessionId);
    
    if (session) {
      sessionManager.updateSession(sessionId, { 
        partnerId: partner.sessionId,
        status: "connected" 
      });
      
      sessionManager.updateSession(partner.sessionId, { 
        partnerId: sessionId,
        status: "connected" 
      });
      
      // Notify both clients that they are paired
      sendToClient(ws, {
        type: "partner_found",
        partnerId: partner.sessionId,
        username: partner.username
      });
      
      sendToClient(partner.ws, {
        type: "partner_found",
        partnerId: sessionId,
        username: session.username
      });
    }
  } else {
    // No partner currently available, wait
    // The user will remain in 'waiting' status until a partner is found
  }
}

function handleDisconnectPartner(sessionId: string, partnerId: string, sessionManager: SessionManager) {
  const session = sessionManager.getSession(sessionId);
  const partner = sessionManager.getSession(partnerId);
  
  if (session && partner) {
    // Update both sessions
    sessionManager.updateSession(sessionId, { 
      partnerId: undefined,
      status: "disconnected" 
    });
    
    sessionManager.updateSession(partnerId, { 
      partnerId: undefined,
      status: "disconnected" 
    });
    
    // Notify partner that they have been disconnected
    sendToClient(partner.ws, {
      type: "partner_disconnected"
    });
  }
}

function handleCancelConnection(sessionId: string, sessionManager: SessionManager) {
  sessionManager.updateSession(sessionId, { 
    status: "disconnected" 
  });
}

function handleSignal(sessionId: string, partnerId: string, signal: any, sessionManager: SessionManager) {
  const partner = sessionManager.getSession(partnerId);
  
  if (partner && partner.ws.readyState === WebSocket.OPEN) {
    sendToClient(partner.ws, {
      type: "signal",
      sessionId,
      partnerId,
      signal
    });
  }
}

function handleSendMessage(sessionId: string, partnerId: string, message: any, sessionManager: SessionManager) {
  const partner = sessionManager.getSession(partnerId);
  
  if (partner && partner.ws.readyState === WebSocket.OPEN) {
    sendToClient(partner.ws, {
      type: "message_received",
      message
    });
  }
}

function sendToClient(ws: WebSocket, data: any) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}
