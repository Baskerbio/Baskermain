import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Check if this is a custom domain request that needs a redirect
      const redirectToProfile = (req as any).locals?.redirectToProfile;
      const customHandle = (req as any).locals?.customDomainHandle;
      
      if (redirectToProfile && customHandle) {
        // This is a full custom domain - redirect to basker.bio with the handle
        res.redirect(302, `http://localhost:3000/${customHandle}`);
        return;
      }

      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      
      // Inject custom handle if present
      if (customHandle) {
        const scriptTag = `<script>window.__CUSTOM_DOMAIN_HANDLE__ = "${customHandle}";</script>`;
        template = template.replace('</head>', `${scriptTag}</head>`);
      }
      
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res) => {
    const htmlPath = path.resolve(distPath, "index.html");
    
    // Check if this is a custom domain request that needs a redirect
    const redirectToProfile = (req as any).locals?.redirectToProfile;
    const customHandle = (req as any).locals?.customDomainHandle;
    
    if (redirectToProfile && customHandle) {
      // This is a full custom domain - redirect to basker.bio with the handle
      res.redirect(302, `https://basker.bio/${customHandle}`);
      return;
    }
    
    if (customHandle) {
      // Read and inject the custom handle into the HTML
      let html = await fs.promises.readFile(htmlPath, "utf-8");
      
      // Inject a script tag to make the custom handle available to the client
      const scriptTag = `<script>window.__CUSTOM_DOMAIN_HANDLE__ = "${customHandle}";</script>`;
      html = html.replace('</head>', `${scriptTag}</head>`);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else {
      res.sendFile(htmlPath);
    }
  });
}
