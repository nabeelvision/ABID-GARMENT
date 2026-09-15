import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for large payload (e.g. logos, compressed images)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // File persistence paths
  const DATA_DIR = path.join(process.cwd(), "data");
  const DATA_FILE = path.join(DATA_DIR, "store-data.json");

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // API 1: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API 2: Get persisted store data (products, background, intro, store settings, social, optimization)
  app.get("/api/store-data", (req, res) => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(content);
        return res.json(parsed);
      }
      return res.json({ default: true });
    } catch (err) {
      console.error("Error reading store-data.json:", err);
      return res.status(500).json({ error: "Failed to read store data file" });
    }
  });

  // API 3: Update & persist store data to file
  app.post("/api/store-data", (req, res) => {
    try {
      const incomingData = req.body;
      if (!incomingData || typeof incomingData !== "object") {
        return res.status(400).json({ error: "Invalid payload" });
      }

      // Read existing data to merge safely if partial
      let currentData: Record<string, any> = {};
      if (fs.existsSync(DATA_FILE)) {
        try {
          currentData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
        } catch {
          currentData = {};
        }
      }

      const mergedData = {
        ...currentData,
        ...incomingData,
        lastUpdated: new Date().toISOString(),
      };

      // Write to disk permanently
      fs.writeFileSync(DATA_FILE, JSON.stringify(mergedData, null, 2), "utf-8");

      return res.json({
        success: true,
        message: "All settings and data permanently saved to server file!",
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("Error saving store-data.json:", err);
      return res.status(500).json({ error: "Failed to write store data file" });
    }
  });

  // Vite middleware for development vs static production serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
