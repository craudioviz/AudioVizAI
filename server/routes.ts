import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Avatar management routes
  app.get("/api/avatars", async (req, res) => {
    try {
      const avatars = await storage.getAllAvatars();
      res.json(avatars);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching avatars: " + error.message });
    }
  });

  app.get("/api/avatars/:name", async (req, res) => {
    try {
      const avatar = await storage.getAvatarByName(req.params.name);
      if (!avatar) {
        return res.status(404).json({ message: "Avatar not found" });
      }
      res.json(avatar);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching avatar: " + error.message });
    }
  });

  // Universe zones routes
  app.get("/api/universe-zones", async (req, res) => {
    try {
      const zones = await storage.getAllUniverseZones();
      res.json(zones);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching universe zones: " + error.message });
    }
  });

  // Chat session routes
  app.post("/api/chat/start", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { avatarId } = req.body;
      const avatar = await storage.getAvatar(avatarId);
      
      if (!avatar) {
        return res.status(404).json({ message: "Avatar not found" });
      }

      const session = await storage.createChatSession({
        userId: req.user!.id,
        avatarId,
        messages: []
      });

      // Log the chat session start
      await storage.logAuditAction(req.user!.id, "chat_session_started", { 
        avatarId, 
        sessionId: session.id 
      });

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: "Error starting chat session: " + error.message });
    }
  });

  app.post("/api/chat/:sessionId/message", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { sessionId } = req.params;
      const { message } = req.body;

      const session = await storage.getChatSession(sessionId);
      if (!session || session.userId !== req.user!.id) {
        return res.status(404).json({ message: "Chat session not found" });
      }

      // TODO: Implement actual AI avatar response logic
      // For now, return a placeholder response
      const avatarResponse = {
        id: Date.now().toString(),
        sender: "avatar",
        content: "Thank you for your message. I'm learning and will provide better responses soon!",
        timestamp: new Date().toISOString()
      };

      const userMessage = {
        id: Date.now().toString() + "_user",
        sender: "user",
        content: message,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [
        ...(session.messages as any[] || []),
        userMessage,
        avatarResponse
      ];

      const updatedSession = await storage.updateChatSession(sessionId, updatedMessages);
      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: "Error sending message: " + error.message });
    }
  });

  // Age verification route
  app.post("/api/age-verification", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { confirmed } = req.body;
      
      if (confirmed) {
        const updatedUser = await storage.updateUserAgeVerification(req.user!.id, true);
        await storage.logAuditAction(req.user!.id, "age_verification_completed", {});
        res.json({ verified: true, user: updatedUser });
      } else {
        res.json({ verified: false });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error processing age verification: " + error.message });
    }
  });

  // Emergency controls route
  app.post("/api/emergency-stop", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }

    try {
      const { action, reason } = req.body;
      
      // Check if user has admin privileges (Roy or Cindy)
      if (!req.user!.isAdmin) {
        return res.status(403).json({ message: "Insufficient privileges for emergency controls" });
      }

      await storage.logEmergencyAction(req.user!.id, action, reason);
      
      // TODO: Implement actual emergency stop logic
      console.log(`Emergency action ${action} by ${req.user!.username}: ${reason}`);
      
      res.json({ success: true, message: "Emergency action logged" });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing emergency action: " + error.message });
    }
  });

  // Creator dashboard data routes
  app.get("/api/dashboard/stats", async (req, res) => {
    if (!req.isAuthenticated() || !req.user!.isCreator) {
      return res.sendStatus(403);
    }

    try {
      const userSessions = await storage.getUserChatSessions(req.user!.id);
      const emergencyLogs = await storage.getEmergencyLogs();
      const auditTrails = await storage.getAuditTrails();

      res.json({
        totalSessions: userSessions.length,
        emergencyActions: emergencyLogs.length,
        auditEntries: auditTrails.length,
        lastActivity: userSessions[0]?.updatedAt || null
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching dashboard stats: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
