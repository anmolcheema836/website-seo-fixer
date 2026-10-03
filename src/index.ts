import express from 'express';
import cors from 'cors';
import { runAudit } from './tools/audit.js';
import { logger } from './utils/logger.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ChatGPT will hit this endpoint to audit a website
app.post('/api/audit', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
    logger.info(`Running audit for: ${url}`);
    const result = await runAudit({ url });
    res.json(result);
  } catch (error: any) {
    logger.error("Audit failed", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Website SEO Fixer API running on port ${PORT}`);
});