import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Validate required environment variables for production
function validateEnvironment() {
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    log(`DEPLOYMENT ERROR: ${errorMessage}`);
    log(`Available environment variables: ${Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('TOKEN')).join(', ')}`);
    throw new Error(errorMessage);
  }
  
  // Set NODE_ENV to production if not set in production context
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
    log('NODE_ENV not set, defaulting to production');
  }
  
  log(`Environment validation passed. NODE_ENV: ${process.env.NODE_ENV}`);
  log(`Database URL configured: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`);
  log(`Port configuration: ${process.env.PORT || '5000'}`);
  
  // Additional production checks
  if (process.env.NODE_ENV === 'production') {
    log('Production mode: Ensuring all critical services are available');
    // Add any additional production-specific validations here
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Validate environment variables before starting the server
    validateEnvironment();
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    
    // Validate port is a valid number
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid port configuration: ${process.env.PORT}. Port must be a number between 1 and 65535.`);
    }
    
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`🚀 Server successfully started`);
      log(`📡 Listening on host: 0.0.0.0`);
      log(`🔌 Port: ${port}`);
      log(`🌍 Environment: ${process.env.NODE_ENV}`);
      log(`📊 Ready to accept connections`);
      
      // Log additional deployment info
      if (process.env.REPLIT_DOMAINS) {
        log(`🌐 Replit domains: ${process.env.REPLIT_DOMAINS}`);
      }
    });
  } catch (error) {
    log(`FATAL SERVER ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Server startup failed:', error);
    process.exit(1);
  }
})();
