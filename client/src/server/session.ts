import { WebSocket } from "ws";

interface Session {
  sessionId: string;
  ws: WebSocket;
  username?: string;
  partnerId?: string;
  status: "disconnected" | "waiting" | "connected";
}

export class SessionManager {
  private sessions: Map<string, Session>;
  
  constructor() {
    this.sessions = new Map();
  }
  
  addSession(sessionId: string, ws: WebSocket) {
    this.sessions.set(sessionId, {
      sessionId,
      ws,
      status: "disconnected"
    });
  }
  
  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }
  
  updateSession(sessionId: string, updates: Partial<Session>) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.set(sessionId, { ...session, ...updates });
    }
  }
  
  removeSession(sessionId: string) {
    // If this user has a partner, notify the partner
    const session = this.sessions.get(sessionId);
    if (session && session.partnerId) {
      const partner = this.sessions.get(session.partnerId);
      if (partner && partner.ws.readyState === WebSocket.OPEN) {
        partner.ws.send(JSON.stringify({
          type: "partner_disconnected"
        }));
        
        // Update partner status
        this.updateSession(session.partnerId, {
          partnerId: undefined,
          status: "disconnected"
        });
      }
    }
    
    this.sessions.delete(sessionId);
  }
  
  removeBySocket(ws: WebSocket) {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.ws === ws) {
        this.removeSession(sessionId);
        break;
      }
    }
  }
  
  findWaitingPartner(excludeSessionId: string): Session | undefined {
    for (const session of this.sessions.values()) {
      if (
        session.sessionId !== excludeSessionId &&
        session.status === "waiting" &&
        !session.partnerId
      ) {
        return session;
      }
    }
    return undefined;
  }
  
  getActiveSessionsCount(): number {
    return this.sessions.size;
  }
  
  getWaitingSessionsCount(): number {
    let count = 0;
    for (const session of this.sessions.values()) {
      if (session.status === "waiting") {
        count++;
      }
    }
    return count;
  }
  
  getConnectedSessionsCount(): number {
    let count = 0;
    for (const session of this.sessions.values()) {
      if (session.status === "connected") {
        count++;
      }
    }
    return count;
  }
}

// Create singleton instance
export const SESSION_MANAGER = new SessionManager();
