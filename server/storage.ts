import { 
  users, 
  avatars, 
  universeZones, 
  chatSessions, 
  emergencyLogs,
  auditTrails,
  type User, 
  type InsertUser,
  type Avatar,
  type InsertAvatar,
  type UniverseZone,
  type InsertUniverseZone,
  type ChatSession,
  type InsertChatSession,
  type EmergencyLog,
  type AuditTrail
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAgeVerification(id: string, verified: boolean): Promise<User>;
  
  // Avatar management
  getAllAvatars(): Promise<Avatar[]>;
  getAvatar(id: string): Promise<Avatar | undefined>;
  getAvatarByName(name: string): Promise<Avatar | undefined>;
  createAvatar(avatar: InsertAvatar): Promise<Avatar>;
  updateAvatarStatus(id: string, status: string): Promise<Avatar>;
  
  // Universe zones
  getAllUniverseZones(): Promise<UniverseZone[]>;
  getUniverseZone(id: string): Promise<UniverseZone | undefined>;
  createUniverseZone(zone: InsertUniverseZone): Promise<UniverseZone>;
  
  // Chat sessions
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getUserChatSessions(userId: string): Promise<ChatSession[]>;
  updateChatSession(id: string, messages: any): Promise<ChatSession>;
  
  // Emergency & audit
  logEmergencyAction(userId: string, action: string, reason?: string): Promise<EmergencyLog>;
  logAuditAction(userId: string, action: string, details?: any): Promise<AuditTrail>;
  getEmergencyLogs(): Promise<EmergencyLog[]>;
  getAuditTrails(): Promise<AuditTrail[]>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserAgeVerification(id: string, verified: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ageVerified: verified })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllAvatars(): Promise<Avatar[]> {
    return await db.select().from(avatars);
  }

  async getAvatar(id: string): Promise<Avatar | undefined> {
    const [avatar] = await db.select().from(avatars).where(eq(avatars.id, id));
    return avatar || undefined;
  }

  async getAvatarByName(name: string): Promise<Avatar | undefined> {
    const [avatar] = await db.select().from(avatars).where(eq(avatars.name, name));
    return avatar || undefined;
  }

  async createAvatar(insertAvatar: InsertAvatar): Promise<Avatar> {
    const [avatar] = await db
      .insert(avatars)
      .values(insertAvatar)
      .returning();
    return avatar;
  }

  async updateAvatarStatus(id: string, status: string): Promise<Avatar> {
    const [avatar] = await db
      .update(avatars)
      .set({ status })
      .where(eq(avatars.id, id))
      .returning();
    return avatar;
  }

  async getAllUniverseZones(): Promise<UniverseZone[]> {
    return await db.select().from(universeZones);
  }

  async getUniverseZone(id: string): Promise<UniverseZone | undefined> {
    const [zone] = await db.select().from(universeZones).where(eq(universeZones.id, id));
    return zone || undefined;
  }

  async createUniverseZone(insertZone: InsertUniverseZone): Promise<UniverseZone> {
    const [zone] = await db
      .insert(universeZones)
      .values(insertZone)
      .returning();
    return zone;
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));
  }

  async updateChatSession(id: string, messages: any): Promise<ChatSession> {
    const [session] = await db
      .update(chatSessions)
      .set({ messages, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }

  async logEmergencyAction(userId: string, action: string, reason?: string): Promise<EmergencyLog> {
    const [log] = await db
      .insert(emergencyLogs)
      .values({ userId, action, reason })
      .returning();
    return log;
  }

  async logAuditAction(userId: string, action: string, details?: any): Promise<AuditTrail> {
    const [log] = await db
      .insert(auditTrails)
      .values({ userId, action, details })
      .returning();
    return log;
  }

  async getEmergencyLogs(): Promise<EmergencyLog[]> {
    return await db
      .select()
      .from(emergencyLogs)
      .orderBy(desc(emergencyLogs.timestamp));
  }

  async getAuditTrails(): Promise<AuditTrail[]> {
    return await db
      .select()
      .from(auditTrails)
      .orderBy(desc(auditTrails.timestamp));
  }
}

export const storage = new DatabaseStorage();
