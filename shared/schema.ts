import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  sessionId: text("session_id").notNull().unique(),
  partnerId: text("partner_id"),
  status: text("status").notNull().default("disconnected"), // disconnected, waiting, connected
  muted: boolean("muted").notNull().default(false),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id"),
  timestamp: integer("timestamp").notNull(),
  type: text("type").notNull().default("text"), // text, system
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  sessionId: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  senderId: true,
  receiverId: true,
  timestamp: true,
  type: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// WebRTC Signaling Types
export type SignalData = {
  type: string;
  sdp?: string;
  candidate?: RTCIceCandidate;
};

export type WebSocketMessage = {
  type: string;
  sessionId?: string;
  partnerId?: string;
  username?: string;
  signal?: SignalData;
  message?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: number;
    type: string;
  };
};
