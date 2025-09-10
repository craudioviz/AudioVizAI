import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isCreator: boolean("is_creator").default(false),
  isAdmin: boolean("is_admin").default(false),
  ageVerified: boolean("age_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const avatars = pgTable("avatars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'ai' | 'human'
  status: text("status").notNull().default("live"), // 'live' | 'offline' | 'maintenance'
  description: text("description"),
  personality: jsonb("personality"),
  capabilities: jsonb("capabilities"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const universeZones = pgTable("universe_zones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  rating: text("rating").notNull(), // 'G' | 'PG' | 'PG-13' | 'R' | 'X'
  isActive: boolean("is_active").default(true),
  requiresAgeVerification: boolean("requires_age_verification").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  avatarId: varchar("avatar_id").references(() => avatars.id),
  messages: jsonb("messages"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emergencyLogs = pgTable("emergency_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  reason: text("reason"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const auditTrails = pgTable("audit_trails", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  chatSessions: many(chatSessions),
  emergencyLogs: many(emergencyLogs),
  auditTrails: many(auditTrails),
}));

export const avatarsRelations = relations(avatars, ({ many }) => ({
  chatSessions: many(chatSessions),
}));

export const chatSessionsRelations = relations(chatSessions, ({ one }) => ({
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
  avatar: one(avatars, {
    fields: [chatSessions.avatarId],
    references: [avatars.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertAvatarSchema = createInsertSchema(avatars).omit({
  id: true,
  createdAt: true,
});

export const insertUniverseZoneSchema = createInsertSchema(universeZones).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAvatar = z.infer<typeof insertAvatarSchema>;
export type Avatar = typeof avatars.$inferSelect;
export type InsertUniverseZone = z.infer<typeof insertUniverseZoneSchema>;
export type UniverseZone = typeof universeZones.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type EmergencyLog = typeof emergencyLogs.$inferSelect;
export type AuditTrail = typeof auditTrails.$inferSelect;
