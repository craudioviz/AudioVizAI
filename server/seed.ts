import { db } from "./db";
import { users, avatars, universeZones } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data
    await db.delete(users);
    await db.delete(avatars);
    await db.delete(universeZones);
    
    console.log("Cleared existing data");

    // Create admin users (Roy and Cindy)
    const adminUsers = [
      {
        username: "roy",
        email: "royhenderson@craudiovizai.com",
        password: await hashPassword("secure_admin_password_2025"),
        isCreator: true,
        isAdmin: true,
        ageVerified: true,
      },
      {
        username: "cindy", 
        email: "cindy@craudiovizai.com",
        password: await hashPassword("secure_admin_password_2025"),
        isCreator: true,
        isAdmin: true,
        ageVerified: true,
      }
    ];

    await db.insert(users).values(adminUsers);
    console.log("Created admin users");

    // Create demo user
    const demoUser = {
      username: "demo_user",
      email: "demo@craudiovizai.com", 
      password: await hashPassword("demo123"),
      isCreator: false,
      isAdmin: false,
      ageVerified: false,
    };

    await db.insert(users).values([demoUser]);
    console.log("Created demo user");

    // Create avatars
    const avatarData = [
      {
        name: "Javari",
        type: "ai",
        status: "live",
        description: "AI Knowledge Assistant - Your intelligent guide through the CRVerse",
        personality: {
          traits: ["intelligent", "helpful", "curious", "analytical"],
          style: "professional yet approachable",
          expertise: ["knowledge synthesis", "learning guidance", "research assistance"]
        },
        capabilities: {
          languages: ["English", "Spanish", "French", "German"],
          skills: ["research", "analysis", "tutoring", "content creation"],
          specialties: ["education", "knowledge management", "AI assistance"]
        }
      },
      {
        name: "Kairo", 
        type: "ai",
        status: "live",
        description: "Business Strategist - Your partner in strategic planning and growth",
        personality: {
          traits: ["strategic", "ambitious", "analytical", "results-driven"],
          style: "executive and confident",
          expertise: ["business strategy", "market analysis", "growth planning"]
        },
        capabilities: {
          languages: ["English", "Spanish", "Mandarin"],
          skills: ["strategy", "analysis", "planning", "consulting"],
          specialties: ["business development", "market research", "executive coaching"]
        }
      },
      {
        name: "CRAI",
        type: "ai", 
        status: "live",
        description: "Technical Assistant - Your coding companion and tech guide",
        personality: {
          traits: ["logical", "precise", "innovative", "problem-solving"],
          style: "technical and systematic",
          expertise: ["software development", "system architecture", "debugging"]
        },
        capabilities: {
          languages: ["English", "Python", "JavaScript", "TypeScript"],
          skills: ["coding", "debugging", "architecture", "DevOps"],
          specialties: ["web development", "AI/ML", "system design"]
        }
      },
      {
        name: "Roy",
        type: "human",
        status: "live", 
        description: "CEO & Founder - Visionary leader of CRAudioVizAI",
        personality: {
          traits: ["visionary", "entrepreneurial", "passionate", "innovative"],
          style: "inspiring and charismatic",
          expertise: ["business leadership", "product vision", "team building"]
        },
        capabilities: {
          languages: ["English"],
          skills: ["leadership", "strategy", "innovation", "communication"],
          specialties: ["business vision", "product development", "team leadership"]
        }
      },
      {
        name: "Cindy",
        type: "human",
        status: "live",
        description: "Co-Founder - Strategic partner and operational excellence leader", 
        personality: {
          traits: ["collaborative", "strategic", "detail-oriented", "supportive"],
          style: "professional and nurturing",
          expertise: ["operations", "team dynamics", "strategic partnerships"]
        },
        capabilities: {
          languages: ["English"],
          skills: ["operations", "collaboration", "planning", "relationship building"],
          specialties: ["operational excellence", "team coordination", "strategic partnerships"]
        }
      }
    ];

    await db.insert(avatars).values(avatarData);
    console.log("Created avatars");

    // Create universe zones
    const universeZoneData = [
      {
        name: "Family Zone",
        description: "Safe, educational content for all ages",
        rating: "G",
        isActive: true,
        requiresAgeVerification: false,
      },
      {
        name: "Creative Studio", 
        description: "Design, build, and share your stories",
        rating: "PG",
        isActive: true,
        requiresAgeVerification: false,
      },
      {
        name: "Business Hub",
        description: "Professional networking and collaboration",
        rating: "PG-13", 
        isActive: true,
        requiresAgeVerification: false,
      },
      {
        name: "Entertainment Zone",
        description: "Mature content and adult gaming",
        rating: "R",
        isActive: true,
        requiresAgeVerification: true,
      },
      {
        name: "Only Avatar",
        description: "Private adult fantasy experiences with creator monetization",
        rating: "X",
        isActive: true,
        requiresAgeVerification: true,
      },
      {
        name: "Future Worlds",
        description: "New universes in development",
        rating: "G",
        isActive: false,
        requiresAgeVerification: false,
      }
    ];

    await db.insert(universeZones).values(universeZoneData);
    console.log("Created universe zones");

    console.log("Database seeding completed successfully!");
    console.log("\n=== Admin Login Credentials ===");
    console.log("Roy: roy / secure_admin_password_2025");
    console.log("Cindy: cindy / secure_admin_password_2025");
    console.log("\n=== Demo User Credentials ===");
    console.log("Demo: demo_user / demo123");
    console.log("\n=== IMPORTANT SECURITY NOTE ===");
    console.log("Please change the default admin passwords in production!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding process failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
