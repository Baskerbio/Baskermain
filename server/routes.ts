import type { Express } from "express";
import { createServer, type Server } from "http";
import { BskyAgent } from "@atproto/api";

export async function registerRoutes(app: Express): Promise<Server> {
  // AT Protocol handles all data storage
  // Server routes are minimal for this serverless architecture
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", service: "basker" });
  });

  // Public profile endpoint that doesn't require authentication
  app.get("/api/public-profile/:handle", async (req, res) => {
    try {
      const { handle } = req.params;
      
      // Create a new agent instance for public API calls
      const agent = new BskyAgent({ service: "https://bsky.social" });
      
      // Resolve handle to DID
      const resolution = await agent.api.com.atproto.identity.resolveHandle({
        handle: handle,
      });
      
      const did = resolution.data.did;
      
      // Get profile information using the public API
      const profileResponse = await agent.api.app.bsky.actor.getProfile({
        actor: did,
      });
      
      res.json(profileResponse.data);
    } catch (error: any) {
      console.error('Failed to get public profile:', error);
      res.status(500).json({ error: error.message || 'Failed to get public profile' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
