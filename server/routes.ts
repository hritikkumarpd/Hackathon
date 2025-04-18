import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";
import { setupWebSocketHandlers } from "./websocket";
import { SESSION_MANAGER } from "./session";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Setup WebSocket event handlers
  setupWebSocketHandlers(wss, SESSION_MANAGER);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  return httpServer;
}
